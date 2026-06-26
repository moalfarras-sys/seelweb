import { unstable_noStore as noStore } from "next/cache";
import { getPricingSettingsSnapshot } from "@/lib/pricing/settings";
import {
  ENTRUEMPELUNG_PRICE_PER_M3,
  EXPRESS_MOVE_HOURLY_PRICE,
  formatPricePerHour,
  STANDARD_MOVE_HOURLY_PRICE,
} from "@/lib/service-pricing";
import type { PublicPrices } from "@/lib/public-prices-shared";

const FALLBACK_PRICES: PublicPrices = {
  umzugStandard: STANDARD_MOVE_HOURLY_PRICE,
  umzugExpress: EXPRESS_MOVE_HOURLY_PRICE,
  reinigungWohnung: 34,
  reinigungBuero: 34,
  gewerbeUmzug: STANDARD_MOVE_HOURLY_PRICE,
  entruempelung: ENTRUEMPELUNG_PRICE_PER_M3,
  endreinigung: 34,
  minimumHoursLabel: "Mindestabnahme 2 Stunden",
};

export async function getPrices(): Promise<PublicPrices> {
  try {
    noStore();
    const settings = await getPricingSettingsSnapshot();
    return {
      umzugStandard: STANDARD_MOVE_HOURLY_PRICE,
      umzugExpress: EXPRESS_MOVE_HOURLY_PRICE,
      reinigungWohnung: settings.publicHomeCleaningEur,
      reinigungBuero: settings.publicOfficeCleaningEur,
      gewerbeUmzug: STANDARD_MOVE_HOURLY_PRICE,
      entruempelung: ENTRUEMPELUNG_PRICE_PER_M3,
      endreinigung: settings.publicMoveOutCleaningEur,
      minimumHoursLabel: "Mindestabnahme 2 Stunden",
    };
  } catch {
    return FALLBACK_PRICES;
  }
}

export { formatPricePerHour };
