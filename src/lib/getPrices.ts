import { unstable_noStore as noStore } from "next/cache";
import { getPricingSettingsSnapshot } from "@/lib/pricing/settings";
import { formatPricePerHour, type PublicPrices } from "@/lib/public-prices-shared";

const FALLBACK_PRICES: PublicPrices = {
  umzugStandard: 59,
  umzugExpress: 79,
  umzugExpressSurchargePct: 0,
  reinigungWohnung: 34,
  reinigungBuero: 34,
  gewerbeUmzug: 59,
  entruempelung: 49,
  endreinigung: 34,
  minimumHoursLabel: "Mindestabnahme 2 Stunden",
};

function isBuildTime() {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build" ||
    (process.argv.some((arg) => /next(?:\.js)?$/i.test(arg)) && process.argv.includes("build"))
  );
}

export async function getPrices(): Promise<PublicPrices> {
  try {
    if (!isBuildTime()) {
      noStore();
    }

    if (isBuildTime()) {
      return FALLBACK_PRICES;
    }

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

export { formatPricePerHour };
