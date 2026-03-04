import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const defaultArea = await prisma.serviceArea.upsert({
    where: { id: "area_de_default" },
    update: {
      regionName: "Deutschland",
      enabled: true,
      postalConfigJson: { ranges: [{ from: "01000", to: "99999" }], explicit: [] },
    },
    create: {
      id: "area_de_default",
      regionName: "Deutschland",
      enabled: true,
      postalConfigJson: { ranges: [{ from: "01000", to: "99999" }], explicit: [] },
    },
  });

  await prisma.servicePricing.updateMany({
    where: { zone: { in: ["BERLIN", "BRANDENBURG"] } },
    data: { zone: "DE_DEFAULT" },
  });

  await prisma.pricingZone.updateMany({
    where: { zone: { in: ["BERLIN", "BRANDENBURG"] } },
    data: { zone: "DE_DEFAULT" },
  });

  await prisma.pricingZone.updateMany({
    where: { city: "Berlin" },
    data: { city: "Unbekannt" },
  });

  await prisma.priceRule.updateMany({
    where: { regionId: { in: ["area_berlin", "area_brandenburg"] } },
    data: { regionId: defaultArea.id },
  });

  const allRules = await prisma.priceRule.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, serviceId: true, unitType: true, priority: true },
  });
  const seen = new Set<string>();
  const toDelete: string[] = [];
  for (const rule of allRules) {
    const key = `${rule.serviceId}|${rule.unitType}|${rule.priority}`;
    if (seen.has(key)) {
      toDelete.push(rule.id);
      continue;
    }
    seen.add(key);
  }

  if (toDelete.length > 0) {
    await prisma.priceRule.deleteMany({ where: { id: { in: toDelete } } });
  }

  await prisma.serviceArea.deleteMany({
    where: { id: { in: ["area_berlin", "area_brandenburg"] } },
  });

  console.log("Region defaults migrated to DE_DEFAULT.");
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

