import { NextRequest, NextResponse } from "next/server";
import {
  calculateAggregatePricing,
  type PricingInputParams,
  type PricingServiceInput,
} from "@/lib/pricing/rules";

const PRICING_SETUP_ERRORS = new Set([
  "NO_PRICE_RULES",
  "SERVICE_NOT_FOUND",
]);

function summarizeServices(services: PricingServiceInput[]) {
  return services.map((service) => ({
    serviceType: service.serviceType,
    zip: service.zip,
    hours: service.params.hours ?? null,
    distanceKm: service.params.distanceKm ?? null,
    volumeM3: service.params.volumeM3 ?? null,
    areaM2: service.params.areaM2 ?? null,
    businessMove: Boolean(service.params.businessMove),
    express24h: Boolean(service.params.express24h),
    express48h: Boolean(service.params.express48h),
  }));
}

function mapPricingError(message: string, requestId: string) {
  if (message === "SERVICE_AREA_NOT_SUPPORTED") {
    return NextResponse.json(
      { code: message, error: "Service in dieser Region derzeit nicht verfuegbar.", requestId },
      { status: 422 }
    );
  }

  if (message.startsWith("DISCOUNT_")) {
    return NextResponse.json(
      { code: message, error: "Rabattcode ist ungueltig oder nicht anwendbar.", requestId },
      { status: 422 }
    );
  }

  if (PRICING_SETUP_ERRORS.has(message)) {
    return NextResponse.json(
      {
        code: "PRICING_CONFIGURATION_ERROR",
        error: "Preisregeln sind fuer diese Leistung derzeit nicht vollstaendig eingerichtet. Bitte kontaktieren Sie uns kurz direkt.",
        requestId,
      },
      { status: 503 }
    );
  }

  return null;
}

function optionalString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();
  let services: PricingServiceInput[] = [];
  let body: Record<string, unknown> = {};

  try {
    body = (await req.json()) as Record<string, unknown>;
    const incomingServices = Array.isArray(body.services) ? body.services : [];

    if (incomingServices.length === 0) {
      return NextResponse.json({ error: "Pflichtfeld: services[]", requestId }, { status: 400 });
    }

    services = incomingServices.map((svc: Record<string, unknown>) => {
      const extras = Array.isArray(svc?.extras)
        ? svc.extras
            .map((entry) => {
              if (!entry || typeof entry !== "object") return null;
              const item = entry as Record<string, unknown>;
              const code = String(item.code || "").trim();
              if (!code) return null;
              return {
                code,
                quantity: item.quantity == null ? undefined : Number(item.quantity),
                selected: item.selected == null ? undefined : Boolean(item.selected),
              };
            })
            .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
        : [];

      const params: PricingInputParams = {
        hours: Number(svc?.hours || 0),
        workers: svc?.workers ? Number(svc.workers) : undefined,
        distanceKm: svc?.distanceKm ? Number(svc.distanceKm) : undefined,
        volumeM3: svc?.volumeM3 ? Number(svc.volumeM3) : undefined,
        areaM2: svc?.areaM2 ? Number(svc.areaM2) : undefined,
        floorFrom: svc?.floorFrom ? Number(svc.floorFrom) : undefined,
        floorTo: svc?.floorTo ? Number(svc.floorTo) : undefined,
        hasElevatorFrom: Boolean(svc?.hasElevatorFrom),
        hasElevatorTo: Boolean(svc?.hasElevatorTo),
        heavyItems: svc?.heavyItems ? Number(svc.heavyItems) : undefined,
        express24h: Boolean(svc?.express24h),
        express48h: Boolean(svc?.express48h),
        businessMove: Boolean(svc?.businessMove),
        evening: Boolean(svc?.evening),
        weekend: Boolean(body.isWeekend),
        extras,
      };

      return {
        serviceType: String(svc?.serviceType || "") as PricingServiceInput["serviceType"],
        zip: String(svc?.zip || "").trim(),
        params,
      };
    });

    if (services.some((s) => !s.serviceType || !/^\d{5}$/.test(s.zip))) {
      return NextResponse.json(
        { error: "Ungueltige services[] Daten (serviceType/zip).", requestId },
        { status: 400 }
      );
    }

    const pricing = await calculateAggregatePricing({
      services,
      discountCode: optionalString(body.discountCode),
      customerEmail: optionalString(body.customerEmail),
      customerPhone: optionalString(body.customerPhone),
    });

    return NextResponse.json({ success: true, pricing, requestId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fehler bei der Preisberechnung";
    console.error(`[pricing:${requestId}] failed`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
      services: summarizeServices(services),
      isWeekend: Boolean(body.isWeekend),
      hasDiscountCode: Boolean(body.discountCode),
      hasCustomerEmail: Boolean(body.customerEmail),
      hasCustomerPhone: Boolean(body.customerPhone),
    });

    const mappedResponse = mapPricingError(message, requestId);
    if (mappedResponse) {
      return mappedResponse;
    }

    return NextResponse.json({ error: "Fehler bei der Preisberechnung", requestId }, { status: 500 });
  }
}
