import { NextRequest, NextResponse } from "next/server";
import { calculateAggregatePricing, type PricingInputParams, type PricingServiceInput } from "@/lib/pricing/rules";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incomingServices = Array.isArray(body.services) ? body.services : [];

    if (incomingServices.length === 0) {
      return NextResponse.json({ error: "Pflichtfeld: services[]" }, { status: 400 });
    }

    const services: PricingServiceInput[] = incomingServices.map((svc: Record<string, unknown>) => {
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
      return NextResponse.json({ error: "Ungültige services[] Daten (serviceType/zip)." }, { status: 400 });
    }

    const pricing = await calculateAggregatePricing({
      services,
      discountCode: body.discountCode,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
    });

    return NextResponse.json({ success: true, pricing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fehler bei der Preisberechnung";
    if (message === "SERVICE_AREA_NOT_SUPPORTED") {
      return NextResponse.json({ code: message, error: "Service in dieser Region derzeit nicht verfügbar." }, { status: 422 });
    }
    if (message.startsWith("DISCOUNT_")) {
      return NextResponse.json({ code: message, error: "Rabattcode ist ungültig oder nicht anwendbar." }, { status: 422 });
    }

    return NextResponse.json({ error: "Fehler bei der Preisberechnung" }, { status: 500 });
  }
}
