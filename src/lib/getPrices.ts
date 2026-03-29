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

export async function getPrices(): Promise<PublicPrices> {
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
}

export function formatPricePerHour(value: number) {
  return `ab ${value.toLocaleString("de-DE")} EUR/Std.`;
}
