import type { PricingSettings } from "@prisma/client";
import { prisma } from "@/lib/db";

export type PricingSettingsSnapshot = {
  kmPriceEur: number;
  roundTripMultiplier: number;
  minimumFeeEur: number;
  vatEnabled: boolean;
  estimateLabelEnabled: boolean;
  baseMovingEur: number;
  baseDisposalEur: number;
  baseHomeCleaningEur: number;
  baseMoveOutCleaningEur: number;
  baseOfficeCleaningEur: number;
};

export const DEFAULT_PRICING_SETTINGS: PricingSettingsSnapshot = {
  kmPriceEur: 0.75,
  roundTripMultiplier: 1,
  minimumFeeEur: 0,
  vatEnabled: true,
  estimateLabelEnabled: true,
  baseMovingEur: 0,
  baseDisposalEur: 0,
  baseHomeCleaningEur: 0,
  baseMoveOutCleaningEur: 0,
  baseOfficeCleaningEur: 0,
};

function toSnapshot(settings: PricingSettings | null): PricingSettingsSnapshot {
  if (!settings) return DEFAULT_PRICING_SETTINGS;
  return {
    kmPriceEur: settings.kmPriceEur,
    roundTripMultiplier: settings.roundTripMultiplier,
    minimumFeeEur: settings.minimumFeeEur,
    vatEnabled: settings.vatEnabled,
    estimateLabelEnabled: settings.estimateLabelEnabled,
    baseMovingEur: settings.baseMovingEur,
    baseDisposalEur: settings.baseDisposalEur,
    baseHomeCleaningEur: settings.baseHomeCleaningEur,
    baseMoveOutCleaningEur: settings.baseMoveOutCleaningEur,
    baseOfficeCleaningEur: settings.baseOfficeCleaningEur,
  };
}

export async function getPricingSettingsSnapshot(): Promise<PricingSettingsSnapshot> {
  try {
    const settings = await prisma.pricingSettings.findUnique({ where: { id: "default" } });
    return toSnapshot(settings);
  } catch {
    return DEFAULT_PRICING_SETTINGS;
  }
}

export function getServiceBasePrice(snapshot: PricingSettingsSnapshot, serviceType: string) {
  if (serviceType === "MOVING") return snapshot.baseMovingEur;
  if (serviceType === "DISPOSAL") return snapshot.baseDisposalEur;
  if (serviceType === "HOME_CLEANING") return snapshot.baseHomeCleaningEur;
  if (serviceType === "MOVE_OUT_CLEANING") return snapshot.baseMoveOutCleaningEur;
  if (serviceType === "OFFICE_CLEANING") return snapshot.baseOfficeCleaningEur;
  return 0;
}
