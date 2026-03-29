import { unstable_noStore as noStore } from "next/cache";
import { getPricingSettingsSnapshot } from "@/lib/pricing/settings";

export type PublicPrices = {
  umzugStandard: number;
  umzugExpress: number;
  umzugExpressSurchargePct: number;
  reinigungWohnung: number;
  reinigungBuero: number;
  gewerbeUmzug: number;
  entruempelung: number;
  endreinigung: number;
  minimumHoursLabel: string;
};

const FALLBACK_PRICES: PublicPrices = {
  umzugStandard: 59,
  umzugExpress: 79,
  umzugExpressSurchargePct: 30,
  reinigungWohnung: 34,
  reinigungBuero: 38,
  gewerbeUmzug: 59,
  entruempelung: 49,
  endreinigung: 34,
  minimumHoursLabel: "Mindestabnahme 2 Stunden",
};

export async function getPrices(): Promise<PublicPrices> {
  try {
    noStore();
    const settings = await getPricingSettingsSnapshot();
    return {
      umzugStandard: settings.publicMovingStandardEur,
      umzugExpress: settings.publicMovingExpressEur,
      umzugExpressSurchargePct: settings.publicMovingExpressSurchargePct,
      reinigungWohnung: settings.publicHomeCleaningEur,
      reinigungBuero: settings.publicOfficeCleaningEur,
      gewerbeUmzug: settings.publicOfficeMovingEur,
      entruempelung: settings.publicDisposalEur,
      endreinigung: settings.publicMoveOutCleaningEur,
      minimumHoursLabel: "Mindestabnahme 2 Stunden",
    };
  } catch {
    return FALLBACK_PRICES;
  }
}

export function formatPricePerHour(value: number) {
  return `ab ${value.toLocaleString("de-DE")} EUR/Std.`;
}
