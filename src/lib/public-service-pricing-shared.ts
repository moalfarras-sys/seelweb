import type { PublicPrices } from "@/lib/public-prices-shared";
import {
  ENTRUEMPELUNG_SHORT_DETAILS,
  EXPRESS_MOVE_DETAILS,
  EXPRESS_MOVE_PLANNING,
  STANDARD_MOVE_DETAILS,
  formatPricePerCubicMeter,
  formatPricePerHour,
} from "@/lib/service-pricing";

export function getMovingPublicRate(
  prices: PublicPrices,
  options?: { businessMove?: boolean; express24h?: boolean; express48h?: boolean }
) {
  if (options?.businessMove) return prices.gewerbeUmzug;
  if (options?.express24h || options?.express48h) return prices.umzugExpress;
  return prices.umzugStandard;
}

export function getBookingMarketingPriceLabel(
  prices: PublicPrices,
  serviceType: "HOME_CLEANING" | "MOVE_OUT_CLEANING" | "OFFICE_CLEANING" | "MOVING" | "EXPRESS_MOVING" | "DISPOSAL",
  options?: { businessMove?: boolean; express24h?: boolean; express48h?: boolean }
) {
  if (serviceType === "EXPRESS_MOVING") {
    return `${formatPricePerHour(prices.umzugExpress)} - ${EXPRESS_MOVE_DETAILS} · ${EXPRESS_MOVE_PLANNING}`;
  }
  if (serviceType === "MOVING") {
    return `${formatPricePerHour(getMovingPublicRate(prices, options))} - ${STANDARD_MOVE_DETAILS}`;
  }
  if (serviceType === "HOME_CLEANING") {
    return `${formatPricePerHour(prices.reinigungWohnung)} - ${prices.minimumHoursLabel}`;
  }
  if (serviceType === "MOVE_OUT_CLEANING") {
    return `${formatPricePerHour(prices.endreinigung)} - ${prices.minimumHoursLabel}`;
  }
  if (serviceType === "OFFICE_CLEANING") {
    return `${formatPricePerHour(prices.reinigungBuero)} - ${prices.minimumHoursLabel}`;
  }
  return `${formatPricePerCubicMeter(prices.entruempelung)} - ${ENTRUEMPELUNG_SHORT_DETAILS}`;
}
