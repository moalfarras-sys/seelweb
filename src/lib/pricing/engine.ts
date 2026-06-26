export type ServiceType =
  | "HOME_CLEANING"
  | "MOVE_OUT_CLEANING"
  | "OFFICE_CLEANING"
  | "MOVING"
  | "EXPRESS_MOVING"
  | "DISPOSAL";

export interface ExtraItem {
  code: string;
  name: string;
  timeAddMin: number;
  extraFee: number;
  selected: boolean;
  customMinutes?: number;
}

export interface PricingConfig {
  hourlyRate: number;
  minimumHours: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
}

export interface PricingInput {
  serviceType: ServiceType;
  hours: number;
  config: PricingConfig;
  extras: ExtraItem[];
  isWeekend: boolean;
  isHoliday: boolean;
  discountPercent?: number;
  workers?: number;
  volumeM3?: number;
  distanceKm?: number;
  floorFrom?: number;
  floorTo?: number;
  hasElevatorFrom?: boolean;
  hasElevatorTo?: boolean;
}

export interface PriceLineItem {
  label: string;
  amount: number;
  detail?: string;
}

export interface PriceBreakdown {
  baseHours: number;
  extrasTimeMin: number;
  totalHours: number;
  hourlyRate: number;
  labourCost: number;
  extrasFee: number;
  movingSurcharges: number;
  weekendSurcharge: number;
  subtotal: number;
  discount: number;
  netto: number;
  mwst: number;
  total: number;
  items: PriceLineItem[];
}

const MWST_RATE = 0.19;
const FLOOR_SURCHARGE = 30;
const KM_RATE = 1.8;
const M3_RATE = 60;

export const DEFAULT_CONFIGS: Record<ServiceType, PricingConfig> = {
  HOME_CLEANING: { hourlyRate: 36, minimumHours: 2, weekendMultiplier: 1.25, holidayMultiplier: 1.5 },
  MOVE_OUT_CLEANING: { hourlyRate: 38, minimumHours: 3, weekendMultiplier: 1.25, holidayMultiplier: 1.5 },
  OFFICE_CLEANING: { hourlyRate: 34, minimumHours: 2, weekendMultiplier: 1.0, holidayMultiplier: 1.5 },
  MOVING: { hourlyRate: 79, minimumHours: 2, weekendMultiplier: 1.3, holidayMultiplier: 1.5 },
  EXPRESS_MOVING: { hourlyRate: 99, minimumHours: 2, weekendMultiplier: 1.3, holidayMultiplier: 1.5 },
  DISPOSAL: { hourlyRate: 60, minimumHours: 1, weekendMultiplier: 1.3, holidayMultiplier: 1.5 },
};

export const DEFAULT_EXTRAS: ExtraItem[] = [
  { code: "WINDOW", name: "Fensterreinigung", timeAddMin: 30, extraFee: 0, selected: false },
  { code: "OVEN", name: "Backofen reinigen", timeAddMin: 30, extraFee: 0, selected: false },
  { code: "FRIDGE", name: "Kühlschrank reinigen", timeAddMin: 30, extraFee: 0, selected: false },
  { code: "CABINET", name: "Küchenschränke innen", timeAddMin: 45, extraFee: 0, selected: false },
  { code: "IRONING", name: "Bügeln", timeAddMin: 30, extraFee: 0, selected: false, customMinutes: 30 },
];

export function calculatePrice(input: PricingInput): PriceBreakdown {
  const items: PriceLineItem[] = [];
  const { config } = input;

  const baseHours = Math.max(input.hours, config.minimumHours);

  let extrasTimeMin = 0;
  let extrasFee = 0;
  for (const extra of input.extras) {
    if (!extra.selected) continue;
    const mins = extra.code === "IRONING" && extra.customMinutes ? extra.customMinutes : extra.timeAddMin;
    extrasTimeMin += mins;
    extrasFee += extra.extraFee;
    items.push({
      label: extra.name,
      amount: 0,
      detail: `+${mins} Min.${extra.extraFee > 0 ? ` + ${extra.extraFee.toFixed(2)} €` : ""}`,
    });
  }

  const extrasHours = Math.ceil(extrasTimeMin / 30) * 0.5;
  const totalHours = baseHours + extrasHours;

  const workers = input.workers && input.workers > 0 ? input.workers : 1;

  let multiplier = 1;
  if (input.isHoliday) {
    multiplier = config.holidayMultiplier;
  } else if (input.isWeekend) {
    multiplier = config.weekendMultiplier;
  }

  const baseRate = config.hourlyRate * workers;
  const effectiveRate = baseRate * multiplier;
  const baseLabourCost = totalHours * baseRate;
  const labourCost = totalHours * effectiveRate;

  items.unshift({
    label: workers > 1 ? `Arbeitszeit (${workers} Mitarbeiter)` : "Arbeitszeit",
    amount: baseLabourCost,
    detail:
      workers > 1
        ? `${totalHours} Std. × ${config.hourlyRate.toFixed(2)} €/Std. × ${workers}`
        : `${totalHours} Std. × ${baseRate.toFixed(2)} €/Std.`,
  });

  let weekendSurcharge = 0;
  if (multiplier > 1) {
    weekendSurcharge = labourCost - baseLabourCost;
    items.push({
      label: input.isHoliday ? "Feiertagszuschlag" : "Wochenendzuschlag",
      amount: weekendSurcharge,
      detail: `${((multiplier - 1) * 100).toFixed(0)}% auf Arbeitszeit`,
    });
  }

  let movingSurcharges = 0;
  const isDisposal = input.serviceType === "DISPOSAL";
  const isMoving = input.serviceType === "MOVING" || input.serviceType === "EXPRESS_MOVING";

  if (isDisposal) {
    const volume = Math.max(input.volumeM3 ?? 0, 1);
    movingSurcharges = volume * M3_RATE;
    items.push({
      label: "Richtpreis Entrümpelung",
      amount: movingSurcharges,
      detail: `${volume} m³ × ${M3_RATE} €`,
    });
  } else if (isMoving) {
    if (input.distanceKm && input.distanceKm > 0) {
      const dist = input.distanceKm * KM_RATE;
      movingSurcharges += dist;
      items.push({ label: "Entfernung", amount: dist, detail: `${input.distanceKm} km × ${KM_RATE} €` });
    }
    if (input.floorFrom && input.floorFrom > 0 && !input.hasElevatorFrom) {
      const surcharge = input.floorFrom * FLOOR_SURCHARGE;
      movingSurcharges += surcharge;
      items.push({
        label: "Stockwerk (Beladung)",
        amount: surcharge,
        detail: `${input.floorFrom}. OG × ${FLOOR_SURCHARGE} €`,
      });
    }
    if (input.floorTo && input.floorTo > 0 && !input.hasElevatorTo) {
      const surcharge = input.floorTo * FLOOR_SURCHARGE;
      movingSurcharges += surcharge;
      items.push({
        label: "Stockwerk (Entladung)",
        amount: surcharge,
        detail: `${input.floorTo}. OG × ${FLOOR_SURCHARGE} €`,
      });
    }
  }

  if (extrasFee > 0) {
    items.push({ label: "Extras Gebühr", amount: extrasFee });
  }

  const subtotal = isDisposal ? movingSurcharges : baseLabourCost + weekendSurcharge + extrasFee + movingSurcharges;

  let discount = 0;
  if (input.discountPercent && input.discountPercent > 0) {
    discount = subtotal * (input.discountPercent / 100);
    items.push({ label: `Rabatt (${input.discountPercent}%)`, amount: -discount });
  }

  const netto = subtotal - discount;
  const mwst = netto * MWST_RATE;
  const total = netto + mwst;

  items.push({ label: "Netto", amount: netto });
  items.push({ label: "MwSt. (19%)", amount: mwst });
  items.push({ label: "Gesamt", amount: total });

  return {
    baseHours,
    extrasTimeMin,
    totalHours,
    hourlyRate: effectiveRate,
    labourCost,
    extrasFee,
    movingSurcharges,
    weekendSurcharge,
    subtotal,
    discount,
    netto,
    mwst,
    total,
    items,
  };
}
