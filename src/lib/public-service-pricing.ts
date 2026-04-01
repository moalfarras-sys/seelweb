import { getPrices } from "@/lib/getPrices";
import { formatPricePerHour, type PublicPrices } from "@/lib/public-prices-shared";
export { getBookingMarketingPriceLabel, getMovingPublicRate } from "@/lib/public-service-pricing-shared";

export type PublicServiceSlug =
  | "privatumzug"
  | "firmenumzug"
  | "schulumzug"
  | "expressumzug"
  | "endreinigung"
  | "entruempelung"
  | "entsorgung"
  | "reinigung"
  | "wohnungsreinigung"
  | "gewerbe"
  | "umzug-berlin"
  | "umzug-brandenburg"
  | "deutschlandweite-umzuege"
  | "transport"
  | "praxisreinigung"
  | "bueroreinigung"
  | "kitareinigung"
  | "schulreinigung"
  | "gewerbereinigung"
  | "gastronomiereinigung";

type PublicPriceKey =
  | "umzugStandard"
  | "umzugExpress"
  | "reinigungWohnung"
  | "reinigungBuero"
  | "gewerbeUmzug"
  | "entruempelung"
  | "endreinigung";

const SERVICE_PRICE_KEYS: Record<PublicServiceSlug, PublicPriceKey> = {
  privatumzug: "umzugStandard",
  firmenumzug: "gewerbeUmzug",
  schulumzug: "umzugStandard",
  expressumzug: "umzugExpress",
  endreinigung: "endreinigung",
  entruempelung: "entruempelung",
  entsorgung: "entruempelung",
  reinigung: "reinigungWohnung",
  wohnungsreinigung: "reinigungWohnung",
  gewerbe: "gewerbeUmzug",
  "umzug-berlin": "umzugStandard",
  "umzug-brandenburg": "umzugStandard",
  "deutschlandweite-umzuege": "umzugStandard",
  transport: "umzugStandard",
  praxisreinigung: "reinigungBuero",
  bueroreinigung: "reinigungBuero",
  kitareinigung: "reinigungBuero",
  schulreinigung: "reinigungBuero",
  gewerbereinigung: "reinigungBuero",
  gastronomiereinigung: "reinigungBuero",
};

export const PUBLIC_PRICING_REVALIDATE_PATHS = [
  "/",
  "/leistungen",
  "/buchen",
  "/leistungen/privatumzug",
  "/leistungen/firmenumzug",
  "/leistungen/schulumzug",
  "/leistungen/expressumzug",
  "/leistungen/endreinigung",
  "/leistungen/entruempelung",
  "/leistungen/entsorgung",
  "/leistungen/reinigung",
  "/leistungen/wohnungsreinigung",
  "/leistungen/gewerbe",
  "/leistungen/umzug-berlin",
  "/leistungen/umzug-brandenburg",
  "/leistungen/deutschlandweite-umzuege",
  "/leistungen/transport",
  "/leistungen/praxisreinigung",
  "/leistungen/bueroreinigung",
  "/leistungen/kitareinigung",
  "/leistungen/schulreinigung",
  "/leistungen/gewerbereinigung",
  "/leistungen/gastronomiereinigung",
] as const;

export function getPublicServiceRate(prices: PublicPrices, slug: PublicServiceSlug) {
  return prices[SERVICE_PRICE_KEYS[slug]];
}

export function getPublicServicePriceLabel(prices: PublicPrices, slug: PublicServiceSlug) {
  return formatPricePerHour(getPublicServiceRate(prices, slug));
}

export async function getPublicServicePrices() {
  const prices = await getPrices();
  return {
    prices,
    getRate: (slug: PublicServiceSlug) => getPublicServiceRate(prices, slug),
    getLabel: (slug: PublicServiceSlug) => getPublicServicePriceLabel(prices, slug),
  };
}
