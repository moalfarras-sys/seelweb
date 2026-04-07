import { NextRequest, NextResponse } from "next/server";
import { generateAgbPDF, generateOfferPDF } from "@/lib/pdf";
import { CONTACT } from "@/config/contact";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { createOfferFromOrder, nextTrackingNumber } from "@/lib/workflow";
import { Prisma, type ServiceCategory } from "@prisma/client";
import { calculateAggregatePricing } from "@/lib/pricing/rules";

const JSON_UTF8_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
};

const PRICING_SETUP_ERRORS = new Set([
  "NO_PRICE_RULES",
  "SERVICE_NOT_FOUND",
]);

const SERVICE_LABELS: Record<string, string> = {
  MOVING: "Umzug",
  EXPRESS_MOVING: "Expressumzug",
  HOME_CLEANING: "Wohnungsreinigung",
  OFFICE_CLEANING: "Büroreinigung",
  MOVE_OUT_CLEANING: "Endreinigung",
  DISPOSAL: "Entrümpelung / Entsorgung",
};

type IncomingExtraPayload = {
  code?: string;
  name?: string;
  selected?: boolean;
  quantity?: number;
};

type IncomingServicePayload = {
  serviceType?: ServiceCategory | "EXPRESS_MOVING";
  hours?: number;
  extras?: IncomingExtraPayload[];
  volumeM3?: number;
  distanceKm?: number;
  floorFrom?: number;
  floorTo?: number;
  hasElevatorFrom?: boolean;
  hasElevatorTo?: boolean;
  addressFrom?: unknown;
  addressTo?: unknown;
  areaM2?: number;
  heavyItems?: number;
  express24h?: boolean;
  express48h?: boolean;
  businessMove?: boolean;
  evening?: boolean;
};

function buildPaypalRedirectUrl(amount: number, trackingNumber: string) {
  const base = (process.env.PAYPAL_ME_LINK || "").trim();
  if (!base) return null;
  const normalized = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const amountPart = normalized > 0 ? `/${normalized.toFixed(2)}EUR` : "";
  const sep = base.includes("?") ? "&" : "?";
  const note = encodeURIComponent(`SEEL ${trackingNumber}`);
  return `${base.replace(/\/$/, "")}${amountPart}${sep}note=${note}`;
}

type IncomingAddressPayload = {
  displayName?: string;
  street?: string;
  houseNumber?: string;
  zip?: string;
  city?: string;
  state?: string;
  lat?: number;
  lon?: number;
};

type NormalizedAddress = {
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  state: string;
  lat: number | null;
  lon: number | null;
  displayName: string;
};

function errorResponse(status: number, code: string, message: string, requestId: string) {
  return NextResponse.json(
    {
      success: false,
      code,
      error: message,
      requestId,
    },
    { status, headers: JSON_UTF8_HEADERS }
  );
}

function summarizeBookingServices(services: IncomingServicePayload[]) {
  return services.map((service) => {
    const from = normalizeAddressPayload(service.addressFrom);
    const to = normalizeAddressPayload(service.addressTo);
    return {
      serviceType: service.serviceType ?? null,
      hours: service.hours ?? null,
      zipFrom: from?.zip || null,
      zipTo: to?.zip || null,
      distanceKm: service.distanceKm ?? null,
      volumeM3: service.volumeM3 ?? null,
      areaM2: service.areaM2 ?? null,
      businessMove: Boolean(service.businessMove),
      express24h: Boolean(service.express24h),
      express48h: Boolean(service.express48h),
    };
  });
}

function splitStreetAndHouseNumber(input: string) {
  const raw = input.trim();
  if (!raw) return { street: "", houseNumber: "" };
  const match = raw.match(/^(.*?)[,\s]+(\d+[a-zA-Z0-9/-]*)$/);
  if (!match) return { street: raw, houseNumber: "" };
  return { street: match[1].trim(), houseNumber: match[2].trim() };
}

function normalizeAddressPayload(input: unknown): NormalizedAddress | null {
  if (!input) return null;
  if (typeof input === "string") {
    const { street, houseNumber } = splitStreetAndHouseNumber(input);
    return {
      street,
      houseNumber,
      zip: "",
      city: "",
      state: "",
      lat: null,
      lon: null,
      displayName: input,
    };
  }

  if (typeof input === "object") {
    const addr = input as IncomingAddressPayload;
    const displayName = (addr.displayName || "").trim();
    const street = (addr.street || "").trim();
    const houseNumber = (addr.houseNumber || "").trim();
    const zip = (addr.zip || "").trim();
    const city = (addr.city || "").trim();
    const state = (addr.state || "").trim();

    const fallbackLine = [street, houseNumber, zip, city].filter(Boolean).join(", ");
    const selectedLine = displayName || fallbackLine;
    if (!selectedLine) return null;
    const split = splitStreetAndHouseNumber(street || selectedLine);

    return {
      street: split.street || selectedLine,
      houseNumber: houseNumber || split.houseNumber,
      zip,
      city,
      state,
      lat: typeof addr.lat === "number" ? addr.lat : null,
      lon: typeof addr.lon === "number" ? addr.lon : null,
      displayName: selectedLine,
    };
  }

  return null;
}

function mapPaymentMethod(input: unknown) {
  const normalized = String(input || "").toUpperCase();
  if (normalized === "BAR") return "BAR";
  if (normalized === "PAYPAL") return "PAYPAL";
  if (normalized === "STRIPE") return "STRIPE";
  if (normalized === "RECHNUNG" || normalized === "UEBERWEISUNG") return "UEBERWEISUNG";
  return "UEBERWEISUNG";
}

function toEffectiveCategory(serviceType: ServiceCategory | "EXPRESS_MOVING") {
  if (serviceType === "EXPRESS_MOVING") return "MOVING" as ServiceCategory;
  return serviceType;
}

function isMoving(serviceType: ServiceCategory | "EXPRESS_MOVING") {
  return toEffectiveCategory(serviceType) === "MOVING";
}

function isDisposal(serviceType: ServiceCategory | "EXPRESS_MOVING") {
  return toEffectiveCategory(serviceType) === "DISPOSAL";
}

function isCleaning(serviceType: ServiceCategory | "EXPRESS_MOVING") {
  const category = toEffectiveCategory(serviceType);
  return category === "HOME_CLEANING" || category === "MOVE_OUT_CLEANING" || category === "OFFICE_CLEANING";
}

function formatCustomerSummary(data: {
  customerName: string;
  trackingNumber: string;
  offerNumber: string;
  validUntil: string;
  totalPrice: string;
  serviceSummary: string;
  offerUrl: string;
}) {
  return `<!DOCTYPE html>
  <html lang="de">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f6f8;padding:32px;margin:0;">
    <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#0f2550;padding:24px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;">SEEL Transport & Reinigung</h1>
      </div>
      <div style="padding:26px;">
        <h2 style="margin:0 0 12px;color:#0f2550;">Ihr Angebot</h2>
        <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">Sehr geehrte/r ${data.customerName}, vielen Dank für Ihre Anfrage. Wir haben Ihr Angebot vorbereitet.</p>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;margin:12px 0 20px;">
          <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Trackingnummer</td><td style="padding:10px 14px;text-align:right;font-family:monospace;color:#0d9ea0;font-weight:700;">${data.trackingNumber}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Angebotsnummer</td><td style="padding:10px 14px;text-align:right;font-family:monospace;color:#0d9ea0;font-weight:700;">${data.offerNumber}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Leistungen</td><td style="padding:10px 14px;text-align:right;color:#0f2550;">${data.serviceSummary}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Gültig bis</td><td style="padding:10px 14px;text-align:right;color:#0f2550;">${data.validUntil}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Gesamt</td><td style="padding:10px 14px;text-align:right;color:#0f2550;font-size:20px;font-weight:800;">${data.totalPrice}</td></tr>
        </table>
        <p style="margin:0 0 12px;color:#6b7280;font-size:12px;">Status: Anfrage eingegangen. Ihr Auftrag wartet auf Bestätigung.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${data.offerUrl}" style="display:inline-block;background:#0d9ea0;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;">Angebot online ansehen</a>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();
  let incomingServices: IncomingServicePayload[] = [];

  try {
    const body = await req.json();
    const {
      customer,
      services,
      scheduledAt,
      timeSlot,
      notes,
      paymentMethod,
      discountCode,
      quotedTotal,
      quoteFingerprint,
    } = body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return errorResponse(400, "VALIDATION_ERROR", "Kundeninformationen unvollständig", requestId);
    }

    if (!scheduledAt) {
      return errorResponse(400, "VALIDATION_ERROR", "Datum ist ein Pflichtfeld", requestId);
    }

    const selectedDate = new Date(scheduledAt);
    if (Number.isNaN(selectedDate.getTime())) {
      return errorResponse(400, "VALIDATION_ERROR", "Ungültiges Datum", requestId);
    }

    incomingServices = Array.isArray(services) ? services : [];
    if (incomingServices.length === 0) {
      return errorResponse(400, "VALIDATION_ERROR", "Mindestens ein Service ist erforderlich", requestId);
    }

    const normalizedServices = incomingServices
      .filter((item) => item?.serviceType && typeof item.hours === "number" && Number.isFinite(item.hours) && item.hours > 0)
      .map((item) => ({ ...item, serviceType: item.serviceType as ServiceCategory | "EXPRESS_MOVING" }));

    if (normalizedServices.length === 0) {
      return errorResponse(400, "VALIDATION_ERROR", "Service und Dauer sind Pflichtfelder", requestId);
    }

    const serviceValidation = normalizedServices.map((item) => {
      const from = normalizeAddressPayload(item.addressFrom);
      const to = normalizeAddressPayload(item.addressTo);

      if (isMoving(item.serviceType) && (!from || !to)) {
        return { ok: false, message: "Für Umzug sind Start- und Zieladresse erforderlich." as const };
      }
      if ((isDisposal(item.serviceType) || isCleaning(item.serviceType)) && !from) {
        return { ok: false, message: "Für diesen Service ist eine Leistungsadresse erforderlich." as const };
      }

      return { ok: true as const, from, to };
    });

    const invalidService = serviceValidation.find((v) => !v.ok);
    if (invalidService && !invalidService.ok) {
      return errorResponse(400, "VALIDATION_ERROR", invalidService.message, requestId);
    }

    const pricingServices = normalizedServices.map((svc, index) => {
      const validation = serviceValidation[index];
      const from = validation.ok ? validation.from : null;
      const to = validation.ok ? validation.to : null;
      const zip = from?.zip || to?.zip || "";

      return {
        serviceType: svc.serviceType,
        zip,
        params: {
          hours: svc.hours,
          workers: isMoving(svc.serviceType) ? 2 : 1,
          distanceKm: svc.distanceKm,
          volumeM3: svc.volumeM3,
          areaM2: svc.areaM2,
          floorFrom: svc.floorFrom,
          floorTo: svc.floorTo,
          hasElevatorFrom: svc.hasElevatorFrom,
          hasElevatorTo: svc.hasElevatorTo,
          heavyItems: svc.heavyItems,
          express24h: svc.express24h || svc.serviceType === "EXPRESS_MOVING",
          express48h: svc.express48h,
          businessMove: svc.businessMove,
          evening: svc.evening,
          weekend: selectedDate.getDay() === 0 || selectedDate.getDay() === 6,
          extras: (svc.extras || []).map((e) => ({ code: String(e.code || ""), selected: Boolean(e.selected), quantity: Number(e.quantity || 1) })),
        },
      };
    });

    if (pricingServices.some((s) => !/^\d{5}$/.test(s.zip))) {
      return errorResponse(400, "ZIP_REQUIRED", "Bitte eine gültige PLZ in der Adresse angeben.", requestId);
    }

    const dbCustomer = await prisma.customer.upsert({
      where: { email: customer.email },
      update: {
        name: customer.name,
        phone: customer.phone,
        company: customer.company || null,
      },
      create: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || null,
      },
    });

    const aggregate = await calculateAggregatePricing({
      services: pricingServices,
      discountCode: discountCode || null,
      customerEmail: dbCustomer.email,
      customerPhone: dbCustomer.phone,
      customerId: dbCustomer.id,
    });

    if (typeof quotedTotal === "number" && Number.isFinite(quotedTotal)) {
      const roundedQuoted = Number(quotedTotal.toFixed(2));
      if (Math.abs(roundedQuoted - aggregate.total) > 0.01) {
        return errorResponse(409, "QUOTE_MISMATCH", "Preis hat sich geändert. Bitte aktualisieren Sie die Berechnung.", requestId);
      }
    }

    if (quoteFingerprint && quoteFingerprint !== aggregate.quoteFingerprint) {
      return errorResponse(409, "QUOTE_EXPIRED", "Preisberechnung ist veraltet. Bitte neu berechnen.", requestId);
    }

    const firstService = normalizedServices[0];
    const firstValidation = serviceValidation[0];
    const firstFrom = firstValidation.ok ? firstValidation.from : null;
    const firstTo = firstValidation.ok ? firstValidation.to : null;
    const firstCategory = toEffectiveCategory(firstService.serviceType);

    let catalogService = await prisma.serviceCatalog.findFirst({
      where: { category: firstCategory },
    });

    if (!catalogService) {
      catalogService = await prisma.serviceCatalog.create({
        data: {
          category: firstCategory,
          nameDe: SERVICE_LABELS[firstCategory] || firstCategory,
          descDe: `${SERVICE_LABELS[firstCategory] || firstCategory} Service`,
          isActive: true,
        },
      });
    }

    let fromAddressId: string | null = null;
    let toAddressId: string | null = null;

    if (firstFrom) {
      const fromAddr = await prisma.address.create({
        data: {
          street: firstFrom.street,
          houseNumber: firstFrom.houseNumber || "",
          zip: firstFrom.zip,
          city: firstFrom.city || "",
          floor: firstService.floorFrom || 0,
          hasElevator: firstService.hasElevatorFrom || false,
          latitude: firstFrom.lat,
          longitude: firstFrom.lon,
        },
      });
      fromAddressId = fromAddr.id;
    }

    if (firstTo) {
      const toAddr = await prisma.address.create({
        data: {
          street: firstTo.street,
          houseNumber: firstTo.houseNumber || "",
          zip: firstTo.zip,
          city: firstTo.city || "",
          floor: firstService.floorTo || 0,
          hasElevator: firstService.hasElevatorTo || false,
          latitude: firstTo.lat,
          longitude: firstTo.lon,
        },
      });
      toAddressId = toAddr.id;
    }

    const trackingNumber = await nextTrackingNumber();
    const orderNumber = trackingNumber;
    const combinedHours = Number(normalizedServices.reduce((sum, s) => sum + Number(s.hours || 0), 0).toFixed(2));

    const dbOrder = await prisma.order.create({
      data: {
        orderNumber,
        trackingNumber,
        customerId: dbCustomer.id,
        serviceId: catalogService.id,
        status: "ANFRAGE",
        fromAddressId,
        toAddressId,
        scheduledAt: selectedDate,
        timeSlot: timeSlot || null,
        bookedHours: combinedHours,
        extrasTimeMin: 0,
        totalHours: combinedHours,
        hourlyRate: combinedHours > 0 ? Number((aggregate.subtotal / combinedHours).toFixed(2)) : 0,
        workers: firstCategory === "MOVING" ? 2 : 1,
        volumeM3: firstService.volumeM3 || null,
        distanceKm: firstService.distanceKm || null,
        areaM2: firstService.areaM2 || null,
        subtotal: aggregate.subtotal,
        discountAmount: aggregate.discountAmount,
        discountCode: aggregate.discountCode,
        quoteFingerprint: aggregate.quoteFingerprint,
        quoteSnapshotJson: {
          services: aggregate.services.map((s) => ({
            serviceType: s.originalServiceType,
            effectiveServiceType: s.serviceType,
            region: s.result.regionName,
            zip: s.zip,
            subtotal: s.result.subtotal,
            total: s.result.total,
          })),
          lines: aggregate.lines,
          generatedAt: new Date().toISOString(),
        },
        netto: aggregate.netto,
        mwst: aggregate.mwst,
        totalPrice: aggregate.total,
        paymentMethod: mapPaymentMethod(paymentMethod) as never,
        paymentStatus: "AUSSTEHEND",
        extrasJson: normalizedServices.map((s) => ({
          serviceType: s.serviceType,
          extras: (s.extras || []).filter((e) => e.selected),
        })),
        breakdownJson: {
          services: aggregate.services.map((s, i) => ({
            serviceType: s.originalServiceType,
            effectiveServiceType: s.serviceType,
            hours: normalizedServices[i]?.hours || 0,
            pricing: s.result,
          })),
          lines: aggregate.lines,
          quoteFingerprint: aggregate.quoteFingerprint,
        },
        addressSnapshotJson: normalizedServices.map((s, i) => ({
          serviceType: s.serviceType,
          from: serviceValidation[i].ok ? serviceValidation[i].from : null,
          to: serviceValidation[i].ok ? serviceValidation[i].to : null,
        })),
        notes: notes || null,
      },
    });

    if (aggregate.discountCode) {
      await prisma.discount.update({
        where: { code: aggregate.discountCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    const createdOffer = await createOfferFromOrder({
      id: dbOrder.id,
      customerId: dbOrder.customerId,
      subtotal: dbOrder.subtotal,
      netto: dbOrder.netto,
      mwst: dbOrder.mwst,
      totalPrice: dbOrder.totalPrice,
      discountAmount: dbOrder.discountAmount,
      breakdownJson: dbOrder.breakdownJson,
      extrasJson: dbOrder.extrasJson,
    });

    const offer = await prisma.offer.findUnique({
      where: { id: createdOffer.id },
      include: { items: true },
    });

    if (!offer) {
      return errorResponse(500, "OFFER_NOT_CREATED", "Angebot konnte nicht erstellt werden", requestId);
    }

    const serviceLabel = aggregate.services.map((s) => SERVICE_LABELS[s.serviceType] || s.serviceType).join(", ");

    let offerPdf: Buffer | null = null;
    try {
      offerPdf = generateOfferPDF({
        offerNumber: offer.offerNumber,
        validUntil: offer.validUntil.toLocaleDateString("de-DE"),
        customerName: dbCustomer.name,
        customerEmail: dbCustomer.email,
        customerPhone: dbCustomer.phone,
        customerCompany: dbCustomer.company ?? undefined,
        serviceSummary: serviceLabel,
        routeDistanceKm: dbOrder.distanceKm,
        serviceDate: selectedDate.toLocaleDateString("de-DE"),
        timeSlot,
        fromAddress: firstFrom?.displayName ?? null,
        toAddress: firstTo?.displayName ?? null,
        items: offer.items.map((item) => ({
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        subtotal: offer.subtotal,
        discountAmount: offer.discountAmount,
        extraFees: offer.extraFees,
        netto: offer.netto,
        mwst: offer.mwst,
        totalPrice: offer.totalPrice,
        notes: dbOrder.notes,
        trackingNumber,
        statusNote: "Anfrage eingegangen - wartet auf Bestätigung",
        agbText: "Es gelten unsere AGB. Stornierungsbedingungen gemäß AGB.",
        jobDetails: {
          computedDurationHours: combinedHours,
          routeDurationMin: null,
          floorFrom: firstService.floorFrom ?? null,
          floorTo: firstService.floorTo ?? null,
          hasElevatorFrom: firstService.hasElevatorFrom ?? null,
          hasElevatorTo: firstService.hasElevatorTo ?? null,
          parkingFrom: null,
          parkingTo: null,
          estimateNote: aggregate.estimateLabelEnabled
            ? "Hinweis: Distanzkosten werden als Richtwert/Schätzung berechnet, bis die finale Einsatzplanung bestätigt ist."
            : null,
          addons: (firstService.extras || [])
            .filter((e) => e.selected)
            .map((e) => String(e.name || e.code || "").trim())
            .filter(Boolean),
        },
      });
    } catch (pdfError) {
      console.error(`[booking:${requestId}] pdf_generation_failed`, pdfError);
    }

    const agbPdf = generateAgbPDF();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const offerUrl = `${baseUrl}/angebot/${offer.token}`;

    await sendEmail({
      to: dbCustomer.email,
      subject: "Ihr Angebot - Seel Transport & Reinigung",
      html: formatCustomerSummary({
        customerName: dbCustomer.name,
        trackingNumber,
        offerNumber: offer.offerNumber,
        validUntil: offer.validUntil.toLocaleDateString("de-DE"),
        totalPrice: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(offer.totalPrice),
        serviceSummary: serviceLabel,
        offerUrl,
      }),
      attachments: [
        ...(offerPdf
          ? [
              {
                filename: `Angebot-${offer.offerNumber}.pdf`,
                content: offerPdf,
                contentType: "application/pdf",
              },
            ]
          : []),
        {
          filename: "AGB-SEEL-Transport-Reinigung.pdf",
          content: agbPdf,
          contentType: "application/pdf",
        },
      ],
      requestId,
    });

    await prisma.communication.create({
      data: {
        customerId: dbCustomer.id,
        offerId: offer.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: "Ihr Angebot - Seel Transport & Reinigung",
        message: `Angebot ${offer.offerNumber} an Kunden versendet.`,
        metaJson: {
          offerUrl,
          pdfAttached: offerPdf !== null,
          agbAttached: true,
          requestId,
          trackingNumber,
        },
        sentBy: "system",
      },
    });

    await sendEmail({
      to: CONTACT.EMAIL,
      subject: `Neues Angebot ${offer.offerNumber} - ${dbCustomer.name}`,
      html: `<p>Neues Angebot erstellt.</p><p>Tracking: <strong>${trackingNumber}</strong></p><p>Kunde: ${dbCustomer.name} (${dbCustomer.email})</p>`,
      attachments: offerPdf
        ? [
            {
              filename: `Angebot-${offer.offerNumber}.pdf`,
              content: offerPdf,
              contentType: "application/pdf",
            },
          ]
        : [],
      requestId,
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber,
        trackingNumber,
        offerNumber: offer.offerNumber,
        offerToken: offer.token,
        offerStatus: offer.status,
        offerValidUntil: offer.validUntil,
        offerPdfUrl: `/api/angebot/${offer.token}/pdf?download=1`,
        paypalRedirectUrl:
          mapPaymentMethod(paymentMethod) === "PAYPAL"
            ? buildPaypalRedirectUrl(offer.totalPrice, trackingNumber)
            : null,
        orderId: dbOrder.id,
        requestId,
      },
      { headers: JSON_UTF8_HEADERS }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "BOOKING_CREATE_FAILED";
    if (message === "SERVICE_AREA_NOT_SUPPORTED") {
      return errorResponse(422, message, "Service in dieser Region derzeit nicht verfügbar.", requestId);
    }
    if (PRICING_SETUP_ERRORS.has(message)) {
      console.error(`[booking:${requestId}] pricing_configuration_error`, {
        message,
        services: summarizeBookingServices(incomingServices),
      });
      return errorResponse(
        503,
        "PRICING_CONFIGURATION_ERROR",
        "Preisregeln sind fuer diese Leistung derzeit nicht vollstaendig eingerichtet. Bitte kontaktieren Sie uns kurz direkt.",
        requestId
      );
    }
    if (message.startsWith("DISCOUNT_")) {
      return errorResponse(422, message, "Rabattcode ist ungültig oder nicht anwendbar.", requestId);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`[booking:${requestId}] prisma_known_error`, {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
      return errorResponse(500, "DB_ERROR", "Datenbankfehler beim Erstellen der Buchung", requestId);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error(`[booking:${requestId}] prisma_validation_error`, {
        message: error.message,
      });
      return errorResponse(400, "DB_VALIDATION_ERROR", "Ungültige Buchungsdaten", requestId);
    }

    console.error(`[booking:${requestId}] unhandled_error`, error);
    return errorResponse(500, "BOOKING_CREATE_FAILED", "Fehler beim Erstellen der Buchung", requestId);
  }
}
