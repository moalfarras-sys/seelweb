import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const args = new Set(process.argv.slice(2));
const shouldReset = args.has("--reset");
const shouldIncludeManual = args.has("--with-manual-documents");
const shouldIncludeOrders = args.has("--with-orders");

async function getCounts() {
  return {
    orders: await prisma.order.count(),
    offers: await prisma.offer.count(),
    offerVersions: await prisma.offerVersion.count(),
    contracts: await prisma.contract.count(),
    signatures: await prisma.signature.count(),
    invoices: await prisma.invoice.count(),
    payments: await prisma.payment.count(),
    communications: await prisma.communication.count(),
    manualDocuments: await prisma.manualDocument.count(),
    offerSequences: await prisma.offerSequence.count(),
    contractSequences: await prisma.contractSequence.count(),
    invoiceSequences: await prisma.invoiceSequence.count(),
  };
}

async function resetCommercialDocuments() {
  return prisma.$transaction(async (tx) => {
    const payments = await tx.payment.deleteMany({});
    const invoices = await tx.invoice.deleteMany({});
    const signatures = await tx.signature.deleteMany({});
    const communications = await tx.communication.deleteMany({
      where: {
        OR: [{ offerId: { not: null } }, { contractId: { not: null } }],
      },
    });
    const contracts = await tx.contract.deleteMany({});
    const offerVersions = await tx.offerVersion.deleteMany({});
    const offers = await tx.offer.deleteMany({});
    const offerSequences = await tx.offerSequence.deleteMany({});
    const contractSequences = await tx.contractSequence.deleteMany({});
    const invoiceSequences = await tx.invoiceSequence.deleteMany({});
    const manualDocuments = shouldIncludeManual
      ? await tx.manualDocument.deleteMany({
          where: { type: { in: ["OFFER", "CONTRACT", "INVOICE"] } },
        })
      : { count: 0 };
    const orders = shouldIncludeOrders ? await tx.order.deleteMany({}) : { count: 0 };

    return {
      payments: payments.count,
      invoices: invoices.count,
      signatures: signatures.count,
      communications: communications.count,
      contracts: contracts.count,
      offerVersions: offerVersions.count,
      offers: offers.count,
      manualDocuments: manualDocuments.count,
      orders: orders.count,
      offerSequences: offerSequences.count,
      contractSequences: contractSequences.count,
      invoiceSequences: invoiceSequences.count,
    };
  });
}

try {
  const before = await getCounts();
  console.log(JSON.stringify({ mode: shouldReset ? "reset" : "inspect", before }, null, 2));

  if (shouldReset) {
    const removed = await resetCommercialDocuments();
    const after = await getCounts();
    console.log(JSON.stringify({ removed, after }, null, 2));
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
