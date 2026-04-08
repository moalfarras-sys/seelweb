import { NextRequest, NextResponse } from "next/server";
import { CONTACT } from "@/config/contact";
import { createOfferToken } from "@/lib/fallback-booking";
import { sendEmail } from "@/lib/email";
import { generateAgbPDF } from "@/lib/pdf";
import { getPublicServicePrices, getMovingPublicRate } from "@/lib/public-service-pricing";

type IncomingService = {
  serviceType?: "MOVING" | "EXPRESS_MOVING" | "OFFICE_CLEANING" | "HOME_CLEANING" | "MOVE_OUT_CLEANING" | "DISPOSAL";
  hours?: number;
  areaM2?: number;
  volumeM3?: number;
  businessMove?: boolean;
  express48h?: boolean;
  addressFrom?: { displayName?: string } | null;
  addressTo?: { displayName?: string } | null;
};

const labels: Record<NonNullable<IncomingService["serviceType"]>, string> = {
  MOVING: "Privat- & Firmenumzug",
  EXPRESS_MOVING: "Expressumzug",
  OFFICE_CLEANING: "Büro- & Gewerbereinigung",
  HOME_CLEANING: "Wohnungsreinigung",
  MOVE_OUT_CLEANING: "Endreinigung",
  DISPOSAL: "Entrümpelung & Entsorgung",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function numberId(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = body.customer || {};
    const services = (Array.isArray(body.services) ? body.services : []) as IncomingService[];
    const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : "";
    const timeSlot = typeof body.timeSlot === "string" ? body.timeSlot : "";

    if (!customer.name || !customer.email || !customer.phone || services.length === 0 || !scheduledAt || !timeSlot) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const { prices } = await getPublicServicePrices();
    const lineItems = services.map((service) => {
      const type = service.serviceType || "MOVING";
      const hours = Math.max(1, Number(service.hours || 0));
      const rate =
        type === "MOVING" || type === "EXPRESS_MOVING"
          ? getMovingPublicRate(prices, {
              businessMove: Boolean(service.businessMove),
              express24h: type === "EXPRESS_MOVING",
              express48h: Boolean(service.express48h),
            })
          : type === "OFFICE_CLEANING"
            ? prices.reinigungBuero
            : type === "MOVE_OUT_CLEANING"
              ? prices.endreinigung
              : type === "DISPOSAL"
                ? prices.entruempelung
                : prices.reinigungWohnung;

      const metric =
        type === "MOVING" || type === "EXPRESS_MOVING" || type === "DISPOSAL"
          ? `${Number(service.volumeM3 || 0)} m³`
          : `${Number(service.areaM2 || 0)} m²`;

      return {
        title: labels[type],
        description: `${hours} Std. · ${metric}`,
        quantity: hours,
        unitPrice: rate,
        totalPrice: Math.round(rate * hours * 100) / 100,
      };
    });

    const subtotal = Math.round(lineItems.reduce((sum, item) => sum + item.totalPrice, 0) * 100) / 100;
    const quotedTotal = Number(body.quotedTotal || 0);
    const totalPrice = quotedTotal > 0 ? quotedTotal : Math.round(subtotal * 1.19 * 100) / 100;
    const netto = Math.round((totalPrice / 1.19) * 100) / 100;
    const mwst = Math.round((totalPrice - netto) * 100) / 100;
    const validUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
    const trackingNumber = numberId("ST");
    const offerNumber = numberId("ANG");
    const contractNumber = numberId("VTR");
    const serviceSummary = lineItems.map((item) => item.title).join(", ");
    const fromAddress = services[0]?.addressFrom?.displayName || null;
    const toAddress = services[0]?.addressTo?.displayName || null;

    const offerToken = createOfferToken({
      offerNumber,
      contractNumber,
      trackingNumber,
      validUntil,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerCompany: customer.company || null,
      serviceSummary,
      scheduledAt,
      timeSlot,
      fromAddress,
      toAddress,
      items: lineItems,
      subtotal,
      discountAmount: 0,
      extraFees: 0,
      netto,
      mwst,
      totalPrice,
      notes: body.notes || null,
    });

    const offerPdfUrl = `/api/angebot/${offerToken}/pdf?download=1`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://seeltransport.de";
    const { buildOfferPdf } = await import("@/lib/fallback-booking");
    const offerPdf = buildOfferPdf({
      kind: "offer",
      offerNumber,
      contractNumber,
      trackingNumber,
      validUntil,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerCompany: customer.company || null,
      serviceSummary,
      scheduledAt,
      timeSlot,
      fromAddress,
      toAddress,
      items: lineItems,
      subtotal,
      discountAmount: 0,
      extraFees: 0,
      netto,
      mwst,
      totalPrice,
      notes: body.notes || null,
    });

    await sendEmail({
      to: customer.email,
      subject: `Ihr Angebot ${offerNumber} - SEEL Transport & Reinigung`,
      html: `
        <h2>Vielen Dank für Ihre Anfrage</h2>
        <p>Ihr Angebot <strong>${offerNumber}</strong> wurde vorbereitet.</p>
        <p><strong>Leistungen:</strong> ${serviceSummary}</p>
        <p><strong>Termin:</strong> ${new Date(scheduledAt).toLocaleDateString("de-DE")} · ${timeSlot}</p>
        <p><strong>Gesamt:</strong> ${formatNumber(totalPrice)}</p>
        <p><a href="${baseUrl}/angebot/${offerToken}">Angebot online ansehen</a></p>
      `,
      attachments: [
        { filename: `Angebot-${offerNumber}.pdf`, content: offerPdf, contentType: "application/pdf" },
        { filename: "AGB-SEEL-Transport-Reinigung.pdf", content: generateAgbPDF(), contentType: "application/pdf" },
      ],
      throwOnFailure: false,
    });

    await sendEmail({
      to: CONTACT.EMAIL,
      subject: `Neue Anfrage ${offerNumber} - ${customer.name}`,
      html: `
        <h2>Neue Buchungsanfrage</h2>
        <p><strong>Kunde:</strong> ${customer.name}</p>
        <p><strong>E-Mail:</strong> ${customer.email}</p>
        <p><strong>Telefon:</strong> ${customer.phone}</p>
        <p><strong>Leistungen:</strong> ${serviceSummary}</p>
        <p><strong>Termin:</strong> ${new Date(scheduledAt).toLocaleDateString("de-DE")} · ${timeSlot}</p>
        <p><strong>Gesamt:</strong> ${formatNumber(totalPrice)}</p>
      `,
      attachments: [{ filename: `Angebot-${offerNumber}.pdf`, content: offerPdf, contentType: "application/pdf" }],
      throwOnFailure: false,
    });

    return NextResponse.json({
      success: true,
      orderNumber: trackingNumber,
      trackingNumber,
      offerNumber,
      offerToken,
      offerPdfUrl,
      paypalRedirectUrl: null,
    });
  } catch (error) {
    console.error("[booking] fallback error:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen der Buchung" }, { status: 500 });
  }
}
