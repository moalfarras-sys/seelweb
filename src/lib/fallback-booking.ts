import crypto from "crypto";
import { generateOfferPDF, generateSignedContractPDF } from "@/lib/pdf";

type LineItem = {
  title: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type BasePayload = {
  offerNumber: string;
  contractNumber: string;
  trackingNumber: string;
  validUntil: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string | null;
  serviceSummary: string;
  scheduledAt?: string | null;
  timeSlot?: string | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  items: LineItem[];
  subtotal: number;
  discountAmount: number;
  extraFees: number;
  netto: number;
  mwst: number;
  totalPrice: number;
  notes?: string | null;
};

export type FallbackOfferPayload = BasePayload & { kind: "offer" };
export type FallbackContractPayload = BasePayload & { kind: "contract"; offerToken: string };

type SignedState = {
  signedAt: string;
  signedByName: string;
  signedPdfBase64?: string;
};

const secret = process.env.NEXTAUTH_SECRET || "seel-fallback-secret";
const runtime = globalThis as typeof globalThis & {
  __seelFallbackSigned?: Map<string, SignedState>;
};

function signedStore() {
  if (!runtime.__seelFallbackSigned) runtime.__seelFallbackSigned = new Map();
  return runtime.__seelFallbackSigned;
}

function sign(data: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

function encode<T extends FallbackOfferPayload | FallbackContractPayload>(payload: T) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `fb_${data}.${sign(data)}`;
}

function decode<T extends FallbackOfferPayload | FallbackContractPayload>(token: string, expected: T["kind"]) {
  if (!token.startsWith("fb_")) return null;
  const body = token.slice(3);
  const [data, signature] = body.split(".");
  if (!data || !signature || sign(data) !== signature) return null;
  const parsed = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as T;
  return parsed.kind === expected ? parsed : null;
}

export function createOfferToken(payload: Omit<FallbackOfferPayload, "kind">) {
  return encode({ ...payload, kind: "offer" });
}

export function createContractToken(payload: Omit<FallbackContractPayload, "kind">) {
  return encode({ ...payload, kind: "contract" });
}

export function readOfferToken(token: string) {
  return decode<FallbackOfferPayload>(token, "offer");
}

export function readContractToken(token: string) {
  return decode<FallbackContractPayload>(token, "contract");
}

export function getSignedState(token: string) {
  return signedStore().get(token) || null;
}

export function setSignedState(token: string, state: SignedState) {
  signedStore().set(token, state);
}

export function toOfferResponse(payload: FallbackOfferPayload) {
  return {
    id: payload.offerNumber,
    offerNumber: payload.offerNumber,
    status: "APPROVED",
    validUntil: payload.validUntil,
    subtotal: payload.subtotal,
    discountAmount: payload.discountAmount,
    extraFees: payload.extraFees,
    netto: payload.netto,
    mwst: payload.mwst,
    totalPrice: payload.totalPrice,
    customer: {
      name: payload.customerName,
      email: payload.customerEmail,
      phone: payload.customerPhone,
      company: payload.customerCompany || null,
    },
    order: {
      serviceName: payload.serviceSummary,
      scheduledAt: payload.scheduledAt || null,
      timeSlot: payload.timeSlot || null,
      fromAddress: payload.fromAddress || null,
      toAddress: payload.toAddress || null,
    },
    items: payload.items.map((item, index) => ({ id: `${payload.offerNumber}-${index}`, ...item })),
    contractToken: null as string | null,
  };
}

export function toContractResponse(payload: FallbackContractPayload) {
  return {
    id: payload.contractNumber,
    contractNumber: payload.contractNumber,
    offerNumber: payload.offerNumber,
    offerToken: payload.offerToken,
    title: `Vertrag zu Angebot ${payload.offerNumber}`,
    description: `Digitaler Dienstleistungsvertrag für ${payload.serviceSummary}`,
    category: "SERVICE",
    status: "APPROVED",
    termsVersion: "2026-03",
    pricing: {
      netto: payload.netto,
      mwst: payload.mwst,
      total: payload.totalPrice,
    },
    offerItems: payload.items.map((item, index) => ({ id: `${payload.contractNumber}-${index}`, ...item })),
    customer: {
      name: payload.customerName,
      email: payload.customerEmail,
      company: payload.customerCompany || null,
    },
  };
}

export function buildOfferPdf(payload: FallbackOfferPayload) {
  return generateOfferPDF({
    offerNumber: payload.offerNumber,
    validUntil: new Date(payload.validUntil).toLocaleDateString("de-DE"),
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    customerCompany: payload.customerCompany ?? undefined,
    serviceSummary: payload.serviceSummary,
    serviceDate: payload.scheduledAt ? new Date(payload.scheduledAt).toLocaleDateString("de-DE") : null,
    timeSlot: payload.timeSlot || null,
    fromAddress: payload.fromAddress || null,
    toAddress: payload.toAddress || null,
    items: payload.items,
    subtotal: payload.subtotal,
    discountAmount: payload.discountAmount,
    extraFees: payload.extraFees,
    netto: payload.netto,
    mwst: payload.mwst,
    totalPrice: payload.totalPrice,
    notes: payload.notes || null,
    trackingNumber: payload.trackingNumber,
    statusNote: "Fallback-Angebot – digitale Vorschau",
    jobDetails: {
      computedDurationHours: null,
      routeDurationMin: null,
      floorFrom: null,
      floorTo: null,
      hasElevatorFrom: null,
      hasElevatorTo: null,
      parkingFrom: null,
      parkingTo: null,
      estimateNote: "Dieses Angebot wurde ohne aktive Datenbankverbindung erzeugt und bleibt digital nachvollziehbar.",
    },
  });
}

export async function buildContractPdf(payload: FallbackContractPayload, signature?: { signedAt?: string; signedByName?: string; signatureDataUrl?: string | null }) {
  return generateSignedContractPDF({
    contractNumber: payload.contractNumber,
    offerNumber: payload.offerNumber,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerCompany: payload.customerCompany || null,
    serviceSummary: payload.serviceSummary,
    serviceDate: payload.scheduledAt ? new Date(payload.scheduledAt).toLocaleDateString("de-DE") : null,
    timeSlot: payload.timeSlot || null,
    fromAddress: payload.fromAddress || null,
    toAddress: payload.toAddress || null,
    items: payload.items,
    subtotal: payload.subtotal,
    discountAmount: payload.discountAmount,
    extraFees: payload.extraFees,
    totalPrice: payload.totalPrice,
    netto: payload.netto,
    mwst: payload.mwst,
    signedByName: signature?.signedByName || "Nicht unterschrieben",
    signedAt: signature?.signedAt || "Nicht unterschrieben",
    ipAddress: null,
    signatureDataUrl: signature?.signatureDataUrl || null,
    notes: payload.notes || null,
  });
}
