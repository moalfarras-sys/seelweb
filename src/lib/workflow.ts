import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type JsonObject = Record<string, unknown>;

type BreakdownService = {
  serviceType: string;
  hours: number;
  pricing?: {
    lines?: Array<{ label: string; amount: number; detail?: string }>;
  };
};

type OrderWithPayload = {
  id: string;
  customerId: string;
  subtotal: number;
  netto: number;
  mwst: number;
  totalPrice: number;
  discountAmount: number;
  breakdownJson: unknown;
  extrasJson: unknown;
};

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue;
}

function getCurrentYear() {
  return new Date().getFullYear();
}
async function getNextSequentialCode(prefix: string, field: "offerNumber" | "contractNumber" | "invoiceNumber") {
  const year = getCurrentYear();
  const parseNumericSuffix = (value: string | null | undefined) => {
    if (!value) return 0;
    const parts = value.split("-");
    const maybe = Number(parts[parts.length - 1] ?? "0");
    return Number.isFinite(maybe) ? maybe : 0;
  };
  const formatCode = (num: number) => `${prefix}-${year}-${String(num).padStart(4, "0")}`;

  return prisma.$transaction(async (tx) => {
    if (field === "offerNumber") {
      const existingSeq = await tx.offerSequence.findUnique({ where: { year } });
      const last = await tx.offer.findFirst({
        where: { offerNumber: { startsWith: `${prefix}-${year}-` } },
        orderBy: { offerNumber: "desc" },
        select: { offerNumber: true },
      });
      const maxExisting = parseNumericSuffix(last?.offerNumber);

      if (!existingSeq) {
        const currentValue = maxExisting + 1;
        await tx.offerSequence.create({ data: { year, currentValue } });
        return formatCode(currentValue);
      }
      const nextValue = Math.max(existingSeq.currentValue, maxExisting) + 1;
      const updated = await tx.offerSequence.update({ where: { year }, data: { currentValue: nextValue } });
      return formatCode(updated.currentValue);
    }

    if (field === "contractNumber") {
      const existingSeq = await tx.contractSequence.findUnique({ where: { year } });
      const last = await tx.contract.findFirst({
        where: { contractNumber: { startsWith: `${prefix}-${year}-` } },
        orderBy: { contractNumber: "desc" },
        select: { contractNumber: true },
      });
      const maxExisting = parseNumericSuffix(last?.contractNumber);

      if (!existingSeq) {
        const currentValue = maxExisting + 1;
        await tx.contractSequence.create({ data: { year, currentValue } });
        return formatCode(currentValue);
      }
      const nextValue = Math.max(existingSeq.currentValue, maxExisting) + 1;
      const updated = await tx.contractSequence.update({ where: { year }, data: { currentValue: nextValue } });
      return formatCode(updated.currentValue);
    }

    const existingSeq = await tx.invoiceSequence.findUnique({ where: { year } });
    const last = await tx.invoice.findFirst({
      where: { invoiceNumber: { startsWith: `${prefix}-${year}-` } },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });
    const maxExisting = parseNumericSuffix(last?.invoiceNumber);

    if (!existingSeq) {
      const currentValue = maxExisting + 1;
      await tx.invoiceSequence.create({ data: { year, currentValue } });
      return formatCode(currentValue);
    }
    const nextValue = Math.max(existingSeq.currentValue, maxExisting) + 1;
    const updated = await tx.invoiceSequence.update({ where: { year }, data: { currentValue: nextValue } });
    return formatCode(updated.currentValue);
  });
}

export async function nextTrackingNumber() {
  const now = new Date();
  const yearShort = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const period = `${yearShort}${month}`;

  const value = await prisma.$transaction(async (tx) => {
    const seq = await tx.trackingSequence.findUnique({ where: { period } });
    if (!seq) {
      await tx.trackingSequence.create({
        data: {
          period,
          currentValue: 1,
        },
      });
      return 1;
    }

    const updated = await tx.trackingSequence.update({
      where: { period },
      data: { currentValue: seq.currentValue + 1 },
    });
    return updated.currentValue;
  });

  return `T-${period}-${String(value).padStart(5, "0")}`;
}

export async function nextOfferNumber() {
  return getNextSequentialCode("ANG", "offerNumber");
}

export async function nextContractNumber() {
  return getNextSequentialCode("VTR", "contractNumber");
}

export async function nextInvoiceNumber() {
  return getNextSequentialCode("SEEL", "invoiceNumber");
}

export function createPublicToken() {
  return crypto.randomBytes(24).toString("hex");
}

function parseBreakdownServices(value: unknown): BreakdownService[] {
  if (!value || typeof value !== "object") return [];
  const services = (value as JsonObject).services;
  if (!Array.isArray(services)) return [];
  return services.filter((entry) => !!entry && typeof entry === "object") as BreakdownService[];
}

function parseExtrasMap(value: unknown): Map<string, string[]> {
  if (!Array.isArray(value)) return new Map();
  const map = new Map<string, string[]>();
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const serviceType = String((row as JsonObject).serviceType || "");
    const extras = (row as JsonObject).extras;
    if (!serviceType || !Array.isArray(extras)) continue;
    const names = extras
      .filter((x) => !!x && typeof x === "object")
      .map((x) => String((x as JsonObject).name || "Zusatzleistung"))
      .filter(Boolean);
    map.set(serviceType, names);
  }
  return map;
}

const SERVICE_LABELS: Record<string, string> = {
  MOVING: "Umzug",
  EXPRESS_MOVING: "Expressumzug",
  HOME_CLEANING: "Wohnungsreinigung",
  OFFICE_CLEANING: "Büroreinigung",
  MOVE_OUT_CLEANING: "Endreinigung",
  DISPOSAL: "Entrümpelung",
};

function buildOfferItemsFromBreakdown(
  services: BreakdownService[],
  extrasByService: Map<string, string[]>
) {
  let position = 1;
  const items: Array<{
    position: number;
    type: "SERVICE" | "EXTRA";
    title: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    metaJson: { serviceType: string };
  }> = [];

  for (const svc of services) {
    const serviceLabel = SERVICE_LABELS[svc.serviceType] || svc.serviceType;
    const pricingLines = (svc.pricing?.lines || []).filter(
      (line) => line && Number.isFinite(line.amount) && line.amount !== 0
    );

    for (const line of pricingLines) {
      const label = String(line.label || "").toLowerCase();
      if (label.includes("netto") || label.includes("mwst") || label.includes("gesamt")) continue;
      const amount = Number(line.amount);
      items.push({
        position: position++,
        type: "SERVICE",
        title: `${serviceLabel}: ${line.label}`,
        description: line.detail || "",
        quantity: 1,
        unitPrice: amount,
        totalPrice: amount,
        metaJson: { serviceType: svc.serviceType },
      });
    }

    const extras = extrasByService.get(svc.serviceType) || [];
    for (const name of extras) {
      items.push({
        position: position++,
        type: "EXTRA",
        title: name,
        description: "Zusatzleistung",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        metaJson: { serviceType: svc.serviceType },
      });
    }
  }

  if (items.length === 0) {
    for (const svc of services) {
      const serviceLabel = SERVICE_LABELS[svc.serviceType] || svc.serviceType;
      items.push({
        position: position++,
        type: "SERVICE",
        title: serviceLabel,
        description: `${Number(svc.hours || 0).toFixed(2)} Std.`,
        quantity: Number(svc.hours || 0),
        unitPrice: 0,
        totalPrice: 0,
        metaJson: { serviceType: svc.serviceType },
      });
    }
  }

  return items;
}

export async function createOfferFromOrder(order: OrderWithPayload) {
  const token = createPublicToken();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);

  const services = parseBreakdownServices(order.breakdownJson);
  const extrasByService = parseExtrasMap(order.extrasJson);

  let offer: Awaited<ReturnType<typeof prisma.offer.create>> | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const offerNumber = await nextOfferNumber();
    try {
      offer = await prisma.offer.create({
        data: {
          offerNumber,
          customerId: order.customerId,
          orderId: order.id,
          status: "PENDING",
          validUntil,
          subtotal: order.subtotal,
          discountAmount: order.discountAmount,
          extraFees: 0,
          netto: order.netto,
          mwst: order.mwst,
          totalPrice: order.totalPrice,
          token,
          latestVersion: 1,
          items: {
            create: buildOfferItemsFromBreakdown(services, extrasByService),
          },
          versions: {
            create: {
              versionNo: 1,
              snapshotJson: {
                subtotal: order.subtotal,
                discountAmount: order.discountAmount,
                extraFees: 0,
                netto: order.netto,
                mwst: order.mwst,
                totalPrice: order.totalPrice,
                breakdownJson: toInputJson(order.breakdownJson),
                extrasJson: toInputJson(order.extrasJson),
              } as Prisma.InputJsonValue,
              createdBy: "system",
            },
          },
        },
        include: {
          items: true,
          order: { include: { customer: true, service: true, fromAddress: true, toAddress: true } },
          customer: true,
        },
      });
      break;
    } catch (error) {
      lastError = error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        String(error.message).includes("offer_number")
      ) {
        continue;
      }
      throw error;
    }
  }

  if (!offer) {
    throw lastError instanceof Error ? lastError : new Error("Angebot konnte nicht erstellt werden");
  }

  await prisma.communication.create({
    data: {
      customerId: order.customerId,
      offerId: offer.id,
      channel: "INTERNAL_NOTE",
      direction: "INTERNAL",
      subject: "Angebot aus Buchung erstellt",
      message: `Angebot ${offer.offerNumber} wurde automatisch aus Buchung erstellt.`,
      sentBy: "system",
    },
  });

  return offer;
}

export async function createOfferVersion(offerId: string, createdBy: string, snapshotJson: JsonObject) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { latestVersion: true },
  });
  if (!offer) throw new Error("Offer not found");

  const nextVersion = offer.latestVersion + 1;
  await prisma.offerVersion.create({
    data: {
      offerId,
      versionNo: nextVersion,
      snapshotJson: toInputJson(snapshotJson),
      createdBy,
    },
  });

  await prisma.offer.update({
    where: { id: offerId },
    data: {
      latestVersion: nextVersion,
      status: "MODIFIED",
    },
  });

  return nextVersion;
}

export async function createContractFromOffer(offerId: string) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { customer: true, order: true },
  });
  if (!offer) throw new Error("Offer not found");

  const existing = await prisma.contract.findUnique({ where: { offerId } });
  if (existing) return existing;

  const contractNumber = await nextContractNumber();
  const token = createPublicToken();

  const contract = await prisma.contract.create({
    data: {
      contractNumber,
      offerId: offer.id,
      customerId: offer.customerId,
      status: "PENDING_SIGNATURE",
      token,
      finalNetto: offer.netto,
      finalMwst: offer.mwst,
      finalTotalPrice: offer.totalPrice,
    },
  });

  await prisma.communication.create({
    data: {
      customerId: offer.customerId,
      offerId: offer.id,
      contractId: contract.id,
      channel: "INTERNAL_NOTE",
      direction: "INTERNAL",
      subject: "Vertrag aus genehmigtem Angebot erstellt",
      message: `Vertrag ${contract.contractNumber} aus Angebot ${offer.offerNumber} erstellt.`,
      sentBy: "system",
    },
  });

  return contract;
}

export async function createInvoiceForSignedContract(contractId: string) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { offer: { include: { order: true } } },
  });
  if (!contract) throw new Error("Contract not found");

  const existing = await prisma.invoice.findFirst({
    where: { contractId: contract.id },
  });
  if (existing) return existing;

  const invoiceNumber = await nextInvoiceNumber();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const invoice = await prisma.invoice.create({
    data: {
      orderId: contract.offer.orderId,
      contractId: contract.id,
      invoiceNumber,
      amount: contract.finalNetto,
      tax: contract.finalMwst,
      totalAmount: contract.finalTotalPrice,
      dueDate,
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amount: invoice.totalAmount,
      status: "OPEN",
      method: "INVOICE",
    },
  });

  return invoice;
}
