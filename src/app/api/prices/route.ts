import { NextResponse } from "next/server";
import { getPricingSettingsSnapshot } from "@/lib/pricing/settings";
import {
  ENTRUEMPELUNG_PRICE_PER_M3,
  EXPRESS_MOVE_HOURLY_PRICE,
  STANDARD_MOVE_HOURLY_PRICE,
} from "@/lib/service-pricing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const settings = await getPricingSettingsSnapshot();

  return NextResponse.json(
    {
      umzugStandard: STANDARD_MOVE_HOURLY_PRICE,
      umzugExpress: EXPRESS_MOVE_HOURLY_PRICE,
      umzugExpressSurchargePct: 0,
      reinigungWohnung: settings.publicHomeCleaningEur,
      reinigungBuero: settings.publicOfficeCleaningEur,
      gewerbeUmzug: STANDARD_MOVE_HOURLY_PRICE,
      entruempelung: ENTRUEMPELUNG_PRICE_PER_M3,
      entruempelungUnit: "m3",
      entruempelungPriceModel: "per_m3",
      endreinigung: settings.publicMoveOutCleaningEur,
      minimumHoursLabel: "Mindestabnahme 2 Stunden",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
