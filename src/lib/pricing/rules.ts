import crypto from "crypto";
import { prisma } from "@/lib/db";
import type { Discount, ServiceCategory, UnitType } from "@prisma/client";
import {
  getPricingSettingsSnapshot,
  getPublicHourlyRate,
  getServiceBasePrice,
} from "@/lib/pricing/settings";

export type PricingInputParams = {
  hours?: number;
  workers?: number;
  distanceKm?: number;
  volumeM3?: number;
  areaM2?: number;
  floorFrom?: number;
  floorTo?: number;
  hasElevatorFrom?: boolean;
  hasElevatorTo?: boolean;
  heavyItems?: number;
  weekend?: boolean;
  express24h?: boolean;
  express48h?: boolean;
  businessMove?: boolean;
  evening?: boolean;
  extras?: Array<{ code: string; quantity?: number; selected?: boolean }>;
};

export type PricingServiceInput = {
  serviceType: ServiceCategory | "EXPRESS_MOVING";
  zip: string;
  params: PricingInputParams;
};

export type PricingLine = {
  label: string;
  amount: number;
  detail?: string;
};

export type PricingResult = {
  subtotal: number;
  netto: number;
  mwst: number;
  total: number;
  lines: PricingLine[];
  surchargesTotal: number;
  extrasTotal: number;
  regionId: string;
  regionName: string;
  effectiveCategory: ServiceCategory;
  estimateLabelEnabled?: boolean;
  appliedKmPriceEur?: number | null;
};

export type DiscountResolution = {
  discount: Discount;
  amount: number;
  code: string;
};

export type PricingAggregateResult = {
  services: Array<{
    serviceType: ServiceCategory;
    originalServiceType: string;
    zip: string;
    result: PricingResult;
  }>;
  subtotal: number;
  discountAmount: number;
  discountCode: string | null;
  discountMeta: { isPercent: boolean; amount: number } | null;
  netto: number;
  mwst: number;
  total: number;
  lines: PricingLine[];
  quoteFingerprint: string;
  estimateLabelEnabled: boolean;
};

const MWST = 0.19;

function toServiceCategory(serviceType: string): ServiceCategory {
  if (serviceType === "EXPRESS_MOVING") return "MOVING";
  return serviceType as ServiceCategory;
}

function getUnitsByType(unitType: UnitType, input: PricingInputParams): number {
  switch (unitType) {
    case "hourly":
      return input.hours ?? 0;
    case "km":
      return input.distanceKm ?? 0;
    case "m2":
      return input.areaM2 ?? 0;
    case "m3":
      return input.volumeM3 ?? 0;
    case "flat":
      return 1;
    default:
      return 0;
  }
}

function isZipIncluded(zip: string, postalConfig: unknown): boolean {
  if (!postalConfig || typeof postalConfig !== "object") return false;
  const config = postalConfig as { explicit?: string[]; ranges?: Array<{ from: string; to: string }> };

  if (Array.isArray(config.explicit) && config.explicit.includes(zip)) return true;
  if (!Array.isArray(config.ranges)) return false;

  const numeric = Number(zip);
  if (!Number.isFinite(numeric)) return false;

  return config.ranges.some((r) => {
    const from = Number(r.from);
    const to = Number(r.to);
    return Number.isFinite(from) && Number.isFinite(to) && numeric >= from && numeric <= to;
  });
}

export async function resolveRegionByZip(zip: string) {
  const areas = await prisma.serviceArea.findMany({
    where: { enabled: true },
    orderBy: { regionName: "asc" },
  });
  return areas.find((a) => isZipIncluded(zip, a.postalConfigJson)) ?? null;
}

function triggerMatches(trigger: Record<string, unknown>, input: PricingInputParams): boolean {
  const key = String(trigger.key ?? "");
  const op = String(trigger.op ?? "eq");
  const value = trigger.value;
  const source = (input as Record<string, unknown>)[key];

  if (op === "true") return source === true;
  if (op === "false") return source === false;
  if (op === "gt") return Number(source ?? 0) > Number(value ?? 0);
  if (op === "gte") return Number(source ?? 0) >= Number(value ?? 0);
  if (op === "lt") return Number(source ?? 0) < Number(value ?? 0);
  if (op === "lte") return Number(source ?? 0) <= Number(value ?? 0);
  if (op === "eq") return source === value;
  if (op === "in" && Array.isArray(value)) return value.includes(source);
  return false;
}

function evalFormula(formula: Record<string, unknown>, input: PricingInputParams): number {
  const type = String(formula.type ?? "flat");
  if (type === "flat") return Number(formula.value ?? 0);
  if (type === "percent_subtotal") return 0;
  if (type === "per_unit") {
    const unitKey = String(formula.unitKey ?? "");
    const multiplier = Number(formula.multiplier ?? 0);
    const units = Number((input as Record<string, unknown>)[unitKey] ?? 0);
    return Number((units * multiplier).toFixed(2));
  }
  return 0;
}

export function buildQuoteFingerprint(input: {
  services: Array<{ serviceType: string; zip: string; subtotal: number; total: number }>;
  total: number;
  discountCode: string | null;
  discountAmount: number;
}) {
  const stable = {
    services: input.services
      .map((s) => ({
        serviceType: s.serviceType,
        zip: s.zip,
        subtotal: Number(s.subtotal.toFixed(2)),
        total: Number(s.total.toFixed(2)),
      }))
      .sort((a, b) => `${a.serviceType}:${a.zip}`.localeCompare(`${b.serviceType}:${b.zip}`)),
    total: Number(input.total.toFixed(2)),
    discountCode: input.discountCode ?? null,
    discountAmount: Number(input.discountAmount.toFixed(2)),
  };

  return crypto.createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}

export async function calculatePricingFromDbRules(
  serviceCategory: ServiceCategory | "EXPRESS_MOVING",
  zip: string,
  input: PricingInputParams
): Promise<PricingResult> {
  const effectiveCategory = toServiceCategory(serviceCategory);
  const pricingSettings = await getPricingSettingsSnapshot();
  const region = await resolveRegionByZip(zip);

  if (!region) throw new Error("SERVICE_AREA_NOT_SUPPORTED");

  const candidateRules = await prisma.priceRule.findMany({
    where: {
      enabled: true,
      regionId: region.id,
      service: { category: effectiveCategory, isActive: true },
    },
    select: {
      id: true,
      serviceId: true,
      baseFee: true,
      unitType: true,
      unitPrice: true,
      minUnits: true,
      priority: true,
      createdAt: true,
    },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });

  if (candidateRules.length === 0) throw new Error("NO_PRICE_RULES");

  const rulesPerService = new Map<string, number>();
  for (const rule of candidateRules) {
    rulesPerService.set(rule.serviceId, (rulesPerService.get(rule.serviceId) ?? 0) + 1);
  }

  const selectedServiceId =
    Array.from(rulesPerService.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? candidateRules[0].serviceId;

  const service = await prisma.serviceCatalog.findUnique({
    where: { id: selectedServiceId },
    select: { id: true, nameDe: true },
  });
  if (!service) throw new Error("SERVICE_NOT_FOUND");

  const rules = candidateRules.filter((rule) => rule.serviceId === service.id);
  const lines: PricingLine[] = [];
  let subtotal = 0;
  let appliedKmPriceEur: number | null = null;

  const serviceBasePrice = Number(getServiceBasePrice(pricingSettings, effectiveCategory).toFixed(2));
  const publicHourlyRate = getPublicHourlyRate(pricingSettings, effectiveCategory, {
    businessMove: input.businessMove,
    express24h: input.express24h,
    express48h: input.express48h,
  });
  const usesHourlyAdminRate =
    effectiveCategory === "MOVING" ||
    effectiveCategory === "HOME_CLEANING" ||
    effectiveCategory === "OFFICE_CLEANING";
  const publicBaseAmount =
    !usesHourlyAdminRate && publicHourlyRate > 0
      ? Number((publicHourlyRate * Math.max(input.hours ?? 0, 1)).toFixed(2))
      : 0;
  const effectiveBasePrice = Number((serviceBasePrice + publicBaseAmount).toFixed(2));

  if (effectiveBasePrice > 0) {
    subtotal += effectiveBasePrice;
    lines.push({
      label: "Basispreis Service",
      amount: effectiveBasePrice,
      detail: serviceBasePrice > 0 ? "Admin Preisregel" : "Admin Stundensatz",
    });
  }

  for (const rule of rules) {
    const rawUnits = getUnitsByType(rule.unitType, input);
    const units = Math.max(rawUnits, rule.minUnits);
    let unitPrice = rule.unitPrice;

    if (rule.unitType === "hourly" && publicHourlyRate > 0) {
      unitPrice = publicHourlyRate;
    }

    if (effectiveCategory === "MOVING" && rule.unitType === "km") {
      unitPrice = Number((pricingSettings.kmPriceEur * pricingSettings.roundTripMultiplier).toFixed(4));
      appliedKmPriceEur = unitPrice;
    }

    const variable = Number((units * unitPrice).toFixed(2));
    const amount = Number((rule.baseFee + variable).toFixed(2));
    subtotal += amount;
    lines.push({
      label: effectiveCategory === "MOVING" && rule.unitType === "km" ? "Distanzkosten (Richtwert)" : `Regel ${rule.unitType}`,
      amount,
      detail: `Basis ${rule.baseFee.toFixed(2)} EUR + ${units.toFixed(2)} × ${unitPrice.toFixed(2)} EUR`,
    });
  }

  const activeExtras = await prisma.extra.findMany({
    where: {
      isActive: true,
      OR: [{ serviceId: service.id }, { appliesToCategories: { has: effectiveCategory } }],
    },
  });

  let extrasTotal = 0;
  for (const requested of input.extras ?? []) {
    if (!requested.selected) continue;
    const extra = activeExtras.find((e) => e.code === requested.code);
    if (!extra) continue;

    const qty = Math.max(1, requested.quantity ?? 1);
    let amount = 0;
    if (extra.pricingType === "flat") amount = extra.value * qty;
    if (extra.pricingType === "hourly") amount = (input.hours ?? 0) * extra.value * qty;
    if (extra.pricingType === "m2") amount = (input.areaM2 ?? 0) * extra.value * qty;
    if (extra.pricingType === "m3") amount = (input.volumeM3 ?? 0) * extra.value * qty;
    amount = Number(amount.toFixed(2));
    extrasTotal += amount;
    lines.push({
      label: extra.nameDe,
      amount,
      detail: `${qty} × ${extra.value.toFixed(2)} EUR (${extra.pricingType})`,
    });
  }

  const surchargeRules = await prisma.surcharge.findMany({
    where: { serviceId: service.id, enabled: true },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });

  let surchargesTotal = 0;
  for (const surcharge of surchargeRules) {
    const trigger = (surcharge.triggerJson ?? {}) as Record<string, unknown>;
    if (!triggerMatches(trigger, input)) continue;
    const formula = (surcharge.formulaJson ?? {}) as Record<string, unknown>;
    let amount = evalFormula(formula, input);
    const triggerKey = String(trigger.key ?? "");

    if (
      effectiveCategory === "MOVING" &&
      publicHourlyRate > 0 &&
      pricingSettings.publicMovingExpressSurchargePct > 0 &&
      ((triggerKey === "express24h" && input.express24h) || (triggerKey === "express48h" && input.express48h))
    ) {
      const hours = Math.max(input.hours ?? 0, 1);
      const workers = input.workers && input.workers > 0 ? input.workers : 1;
      amount = Number(
        (
          getPublicHourlyRate(pricingSettings, "MOVING") *
          hours *
          workers *
          (pricingSettings.publicMovingExpressSurchargePct / 100)
        ).toFixed(2)
      );
    }

    if (amount <= 0) continue;
    surchargesTotal += amount;
    lines.push({ label: surcharge.nameDe, amount });
  }

  subtotal = Number((subtotal + extrasTotal + surchargesTotal).toFixed(2));
  if (pricingSettings.minimumFeeEur > 0 && subtotal < pricingSettings.minimumFeeEur) {
    const minimumAdjustment = Number((pricingSettings.minimumFeeEur - subtotal).toFixed(2));
    subtotal = pricingSettings.minimumFeeEur;
    lines.push({
      label: "Mindestbetrag Anpassung",
      amount: minimumAdjustment,
      detail: `Mindestbetrag ${pricingSettings.minimumFeeEur.toFixed(2)} EUR`,
    });
  }

  const netto = subtotal;
  const mwst = pricingSettings.vatEnabled ? Number((netto * MWST).toFixed(2)) : 0;
  const total = Number((netto + mwst).toFixed(2));

  lines.push({ label: "Nettobetrag", amount: netto });
  lines.push({ label: pricingSettings.vatEnabled ? "MwSt. (19%)" : "MwSt. (deaktiviert)", amount: mwst });
  lines.push({ label: "Gesamtbetrag", amount: total });

  return {
    subtotal,
    netto,
    mwst,
    total,
    lines,
    surchargesTotal,
    extrasTotal,
    regionId: region.id,
    regionName: region.regionName,
    effectiveCategory,
    estimateLabelEnabled: pricingSettings.estimateLabelEnabled,
    appliedKmPriceEur,
  };
}

export async function resolveDiscountForCustomer(params: {
  discountCode?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerId?: string | null;
  subtotal: number;
}): Promise<DiscountResolution | null> {
  const code = String(params.discountCode || "").trim().toUpperCase();
  if (!code) return null;

  const discount = await prisma.discount.findUnique({ where: { code } });
  if (!discount || !discount.isActive) throw new Error("DISCOUNT_NOT_FOUND");

  const now = new Date();
  if (discount.validFrom > now || discount.validTo < now) throw new Error("DISCOUNT_EXPIRED");
  if (discount.maxUses != null && discount.usedCount >= discount.maxUses) throw new Error("DISCOUNT_USAGE_EXCEEDED");

  const assignments = await prisma.discountAssignment.findMany({ where: { discountId: discount.id } });

  if (assignments.length > 0) {
    const email = String(params.customerEmail || "").trim().toLowerCase();
    const phone = String(params.customerPhone || "").replace(/\s+/g, "");
    const customerId = String(params.customerId || "");

    const allowed = assignments.some((a) => {
      if (a.customerId && customerId && a.customerId === customerId) return true;
      if (a.email && email && a.email.toLowerCase() === email) return true;
      if (a.phone && phone && a.phone.replace(/\s+/g, "") === phone) return true;
      return false;
    });

    if (!allowed) throw new Error("DISCOUNT_NOT_ASSIGNED");
  }

  const rawAmount = discount.isPercent
    ? Number((params.subtotal * (discount.amount / 100)).toFixed(2))
    : Number(discount.amount.toFixed(2));
  const amount = Math.max(0, Math.min(rawAmount, params.subtotal));
  return { discount, amount, code };
}

export async function calculateAggregatePricing(params: {
  services: PricingServiceInput[];
  discountCode?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerId?: string | null;
}): Promise<PricingAggregateResult> {
  const pricingSettings = await getPricingSettingsSnapshot();
  const services = await Promise.all(
    params.services.map(async (svc) => {
      const result = await calculatePricingFromDbRules(svc.serviceType, svc.zip, svc.params);
      return {
        serviceType: result.effectiveCategory,
        originalServiceType: svc.serviceType,
        zip: svc.zip,
        result,
      };
    })
  );

  const subtotal = Number(services.reduce((sum, s) => sum + s.result.subtotal, 0).toFixed(2));
  const discountResolution = await resolveDiscountForCustomer({
    discountCode: params.discountCode,
    customerEmail: params.customerEmail,
    customerPhone: params.customerPhone,
    customerId: params.customerId,
    subtotal,
  });

  const discountAmount = discountResolution?.amount ?? 0;
  const netto = Number((subtotal - discountAmount).toFixed(2));
  const mwst = pricingSettings.vatEnabled ? Number((netto * MWST).toFixed(2)) : 0;
  const total = Number((netto + mwst).toFixed(2));

  const lines: PricingLine[] = [];
  for (const svc of services) {
    lines.push({
      label: `Service ${svc.serviceType}`,
      amount: svc.result.subtotal,
      detail: `${svc.result.regionName} (${svc.zip})`,
    });
  }
  if (discountAmount > 0) {
    lines.push({
      label: `Rabatt ${discountResolution?.code || ""}`.trim(),
      amount: -discountAmount,
    });
  }
  lines.push({ label: "Netto", amount: netto });
  lines.push({ label: pricingSettings.vatEnabled ? "MwSt. (19%)" : "MwSt. (deaktiviert)", amount: mwst });
  lines.push({ label: "Gesamt", amount: total });

  const quoteFingerprint = buildQuoteFingerprint({
    services: services.map((s) => ({
      serviceType: s.originalServiceType,
      zip: s.zip,
      subtotal: s.result.subtotal,
      total: s.result.total,
    })),
    total,
    discountCode: discountResolution?.code ?? null,
    discountAmount,
  });

  return {
    services,
    subtotal,
    discountAmount,
    discountCode: discountResolution?.code ?? null,
    discountMeta: discountResolution
      ? { isPercent: discountResolution.discount.isPercent, amount: discountResolution.discount.amount }
      : null,
    netto,
    mwst,
    total,
    lines,
    quoteFingerprint,
    estimateLabelEnabled: pricingSettings.estimateLabelEnabled,
  };
}
