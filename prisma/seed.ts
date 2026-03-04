import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ServiceCategory, ServiceDefinitionType, UnitType } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const GERMANY_RANGES = [{ from: "01000", to: "99999" }];

async function upsertServiceCatalog() {
  const services = [
    { category: "HOME_CLEANING" as ServiceCategory, nameDe: "Wohnungsreinigung", sortOrder: 1 },
    { category: "MOVE_OUT_CLEANING" as ServiceCategory, nameDe: "Endreinigung", sortOrder: 2 },
    { category: "OFFICE_CLEANING" as ServiceCategory, nameDe: "Büro- & Gewerbereinigung", sortOrder: 3 },
    { category: "MOVING" as ServiceCategory, nameDe: "Umzug", sortOrder: 4 },
    { category: "DISPOSAL" as ServiceCategory, nameDe: "Entrümpelung & Entsorgung", sortOrder: 5 },
  ];

  const map = new Map<ServiceCategory, string>();
  for (const s of services) {
    const row = await prisma.serviceCatalog.upsert({
      where: { id: `svc_${s.category.toLowerCase()}` },
      update: {
        category: s.category,
        nameDe: s.nameDe,
        isActive: true,
        sortOrder: s.sortOrder,
      },
      create: {
        id: `svc_${s.category.toLowerCase()}`,
        category: s.category,
        nameDe: s.nameDe,
        descDe: s.nameDe,
        isActive: true,
        sortOrder: s.sortOrder,
      },
    });
    map.set(s.category, row.id);
  }
  return map;
}

async function upsertAreas() {
  const germany = await prisma.serviceArea.upsert({
    where: { id: "area_de_default" },
    update: {
      regionName: "Deutschland",
      enabled: true,
      postalConfigJson: { ranges: GERMANY_RANGES, explicit: [] },
    },
    create: {
      id: "area_de_default",
      regionName: "Deutschland",
      enabled: true,
      postalConfigJson: { ranges: GERMANY_RANGES, explicit: [] },
    },
  });

  await prisma.serviceArea.deleteMany({
    where: { id: { in: ["area_berlin", "area_brandenburg"] } },
  });

  return { germany };
}

async function seedServiceDefinitions(serviceIds: Map<ServiceCategory, string>) {
  const defs = [
    { slug: "umzug", service: "MOVING" as ServiceCategory, type: "MOVING" as ServiceDefinitionType },
    { slug: "expressumzug", service: "MOVING" as ServiceCategory, type: "EXPRESS_MOVING" as ServiceDefinitionType },
    { slug: "entruempelung", service: "DISPOSAL" as ServiceCategory, type: "DISPOSAL" as ServiceDefinitionType },
    { slug: "entsorgung", service: "DISPOSAL" as ServiceCategory, type: "DISPOSAL" as ServiceDefinitionType },
    { slug: "wohnungsreinigung", service: "HOME_CLEANING" as ServiceCategory, type: "CLEANING" as ServiceDefinitionType },
    { slug: "endreinigung", service: "MOVE_OUT_CLEANING" as ServiceCategory, type: "CLEANING" as ServiceDefinitionType },
    { slug: "gewerbe", service: "OFFICE_CLEANING" as ServiceCategory, type: "CLEANING" as ServiceDefinitionType },
  ];

  for (const d of defs) {
    await prisma.serviceDefinition.upsert({
      where: { slug: d.slug },
      update: {
        serviceId: serviceIds.get(d.service)!,
        type: d.type,
        enabled: true,
      },
      create: {
        serviceId: serviceIds.get(d.service)!,
        slug: d.slug,
        nameDe: d.slug,
        type: d.type,
        enabled: true,
        bookingFlowJson: {
          requiresZipCheck: true,
          requiresFromAddress: d.type !== "CLEANING" || d.slug !== "endreinigung" ? true: true,
          requiresToAddress: d.type === "MOVING" || d.type === "EXPRESS_MOVING",
        },
      },
    });
  }
}

async function seedPriceRules(serviceIds: Map<ServiceCategory, string>, areaIds: { germany: string }) {
  await prisma.priceRule.deleteMany({});

  const rows = [
    // Balanced baseline for Germany (adjustable from admin after seed)
    { service: "MOVING" as ServiceCategory, region: areaIds.germany, baseFee: 95, unitType: "hourly" as UnitType, unitPrice: 45, minUnits: 2, priority: 10 },
    { service: "MOVING" as ServiceCategory, region: areaIds.germany, baseFee: 0, unitType: "km" as UnitType, unitPrice: 1.6, minUnits: 0, priority: 20 },

    { service: "DISPOSAL" as ServiceCategory, region: areaIds.germany, baseFee: 85, unitType: "m3" as UnitType, unitPrice: 35, minUnits: 1, priority: 10 },

    { service: "HOME_CLEANING" as ServiceCategory, region: areaIds.germany, baseFee: 39, unitType: "hourly" as UnitType, unitPrice: 33, minUnits: 2, priority: 10 },
    { service: "MOVE_OUT_CLEANING" as ServiceCategory, region: areaIds.germany, baseFee: 55, unitType: "m2" as UnitType, unitPrice: 2.1, minUnits: 30, priority: 10 },
    { service: "OFFICE_CLEANING" as ServiceCategory, region: areaIds.germany, baseFee: 45, unitType: "hourly" as UnitType, unitPrice: 32, minUnits: 2, priority: 10 },
  ];

  for (const r of rows) {
    await prisma.priceRule.create({
      data: {
        serviceId: serviceIds.get(r.service)!,
        regionId: r.region,
        baseFee: r.baseFee,
        unitType: r.unitType,
        unitPrice: r.unitPrice,
        minUnits: r.minUnits,
        enabled: true,
        priority: r.priority,
      },
    });
  }
}

async function seedSurcharges(serviceIds: Map<ServiceCategory, string>) {
  await prisma.surcharge.deleteMany({});

  const rows = [
    { service: "MOVING" as ServiceCategory, nameDe: "Etagenzuschlag Start", triggerJson: { key: "floorFrom", op: "gt", value: 0 }, formulaJson: { type: "per_unit", unitKey: "floorFrom", multiplier: 20 }, priority: 10 },
    { service: "MOVING" as ServiceCategory, nameDe: "Etagenzuschlag Ziel", triggerJson: { key: "floorTo", op: "gt", value: 0 }, formulaJson: { type: "per_unit", unitKey: "floorTo", multiplier: 20 }, priority: 11 },
    { service: "MOVING" as ServiceCategory, nameDe: "Express 48h", triggerJson: { key: "express48h", op: "true" }, formulaJson: { type: "flat", value: 79 }, priority: 20 },
    { service: "MOVING" as ServiceCategory, nameDe: "Express 24h", triggerJson: { key: "express24h", op: "true" }, formulaJson: { type: "flat", value: 129 }, priority: 21 },
    { service: "MOVING" as ServiceCategory, nameDe: "Wochenendzuschlag", triggerJson: { key: "weekend", op: "true" }, formulaJson: { type: "flat", value: 55 }, priority: 30 },
    { service: "DISPOSAL" as ServiceCategory, nameDe: "Etagenzuschlag Entsorgung", triggerJson: { key: "floorFrom", op: "gt", value: 0 }, formulaJson: { type: "per_unit", unitKey: "floorFrom", multiplier: 18 }, priority: 10 },
    { service: "DISPOSAL" as ServiceCategory, nameDe: "Schwerteile-Zuschlag", triggerJson: { key: "heavyItems", op: "gt", value: 0 }, formulaJson: { type: "per_unit", unitKey: "heavyItems", multiplier: 18 }, priority: 15 },
  ];

  for (const s of rows) {
    await prisma.surcharge.create({
      data: {
        serviceId: serviceIds.get(s.service)!,
        nameDe: s.nameDe,
        triggerJson: s.triggerJson,
        formulaJson: s.formulaJson,
        enabled: true,
        priority: s.priority,
      },
    });
  }
}

async function seedExtras(serviceIds: Map<ServiceCategory, string>) {
  const extras = [
    { code: "WINDOW", nameDe: "Fensterreinigung", service: "HOME_CLEANING" as ServiceCategory, pricingType: "flat" as UnitType, value: 25 },
    { code: "OVEN", nameDe: "Backofen reinigen", service: "HOME_CLEANING" as ServiceCategory, pricingType: "flat" as UnitType, value: 20 },
    { code: "FRIDGE", nameDe: "Kühlschrank reinigen", service: "HOME_CLEANING" as ServiceCategory, pricingType: "flat" as UnitType, value: 18 },
    { code: "PACKING", nameDe: "Einpackservice", service: "MOVING" as ServiceCategory, pricingType: "hourly" as UnitType, value: 22 },
  ];

  for (const e of extras) {
    await prisma.extra.upsert({
      where: { code: e.code },
      update: {
        nameDe: e.nameDe,
        serviceId: serviceIds.get(e.service)!,
        pricingType: e.pricingType,
        value: e.value,
        isActive: true,
        appliesToCategories: [e.service],
      },
      create: {
        code: e.code,
        nameDe: e.nameDe,
        descDe: e.nameDe,
        timeAddMin: 0,
        extraFee: 0,
        allowCustom: false,
        sortOrder: 10,
        isActive: true,
        appliesToCategories: [e.service],
        serviceId: serviceIds.get(e.service)!,
        pricingType: e.pricingType,
        value: e.value,
      },
    });
  }
}

async function seedDiscounts() {
  await prisma.discount.upsert({
    where: { code: "NEUKUNDE10" },
    update: {
      amount: 10,
      isPercent: true,
      isActive: true,
      codeType: "PROMO",
      stackable: false,
      usageScope: "GLOBAL",
    },
    create: {
      code: "NEUKUNDE10",
      description: "10 % Neukundenrabatt",
      amount: 10,
      isPercent: true,
      validFrom: new Date("2026-01-01"),
      validTo: new Date("2026-12-31"),
      isActive: true,
      codeType: "PROMO",
      stackable: false,
      usageScope: "GLOBAL",
    },
  });
}

async function seedLegacyPricing(serviceIds: Map<ServiceCategory, string>) {
  const legacy = [
    { category: "HOME_CLEANING" as ServiceCategory, hourlyRate: 33, minimumHours: 2 },
    { category: "MOVE_OUT_CLEANING" as ServiceCategory, hourlyRate: 35, minimumHours: 3 },
    { category: "OFFICE_CLEANING" as ServiceCategory, hourlyRate: 32, minimumHours: 2 },
    { category: "MOVING" as ServiceCategory, hourlyRate: 45, minimumHours: 2 },
    { category: "DISPOSAL" as ServiceCategory, hourlyRate: 35, minimumHours: 1 },
  ];

  for (const l of legacy) {
    const exists = await prisma.servicePricing.findFirst({ where: { serviceId: serviceIds.get(l.category)!, zone: "DE_DEFAULT" } });
    if (!exists) {
      await prisma.servicePricing.create({
        data: {
          serviceId: serviceIds.get(l.category)!,
          zone: "DE_DEFAULT",
          hourlyRate: l.hourlyRate,
          minimumHours: l.minimumHours,
          weekendMultiplier: 1.25,
          holidayMultiplier: 1.5,
          isActive: true,
        },
      });
    }
  }
}

async function main() {
  console.log("Seed starte...");
  const serviceIds = await upsertServiceCatalog();
  const areas = await upsertAreas();
  await seedServiceDefinitions(serviceIds);
  await seedPriceRules(serviceIds, { germany: areas.germany.id });
  await seedSurcharges(serviceIds);
  await seedExtras(serviceIds);
  await seedDiscounts();
  await seedLegacyPricing(serviceIds);
  console.log("Seed abgeschlossen.");
}

main()
  .catch((e) => {
    console.error("Seed-Fehler:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
