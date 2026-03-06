import { ManualDocumentStatus, ManualDocumentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateManualDocumentTotals } from "@/lib/manual-document-utils";
import {
  ManualDocumentPayload,
  nextManualDocumentNumber,
} from "@/lib/manual-documents";

function parseOptionalDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizePayload(body: Record<string, unknown>) {
  const type = Object.values(ManualDocumentType).includes(body.type as ManualDocumentType)
    ? (body.type as ManualDocumentType)
    : ManualDocumentType.OFFER;
  const items = Array.isArray(body.items) ? body.items : [];
  const totals = calculateManualDocumentTotals(items as ManualDocumentPayload["items"], Number(body.taxRate ?? 19));

  return {
    type,
    status: Object.values(ManualDocumentStatus).includes(body.status as ManualDocumentStatus)
      ? (body.status as ManualDocumentStatus)
      : ManualDocumentStatus.DRAFT,
    documentNumber: typeof body.documentNumber === "string" ? body.documentNumber : null,
    customerId: typeof body.customerId === "string" && body.customerId ? body.customerId : null,
    sourceOrderId: typeof body.sourceOrderId === "string" && body.sourceOrderId ? body.sourceOrderId : null,
    title: typeof body.title === "string" ? body.title : "",
    introText: typeof body.introText === "string" ? body.introText : null,
    customerName: typeof body.customerName === "string" ? body.customerName : "",
    customerEmail: typeof body.customerEmail === "string" ? body.customerEmail : "",
    customerPhone: typeof body.customerPhone === "string" ? body.customerPhone : null,
    customerCompany: typeof body.customerCompany === "string" ? body.customerCompany : null,
    serviceSummary: typeof body.serviceSummary === "string" ? body.serviceSummary : "",
    serviceDate: parseOptionalDate(body.serviceDate),
    timeSlot: typeof body.timeSlot === "string" ? body.timeSlot : null,
    fromAddress: typeof body.fromAddress === "string" ? body.fromAddress : null,
    toAddress: typeof body.toAddress === "string" ? body.toAddress : null,
    routeDistanceKm: body.routeDistanceKm !== undefined && body.routeDistanceKm !== null ? Number(body.routeDistanceKm) : null,
    issueDate: parseOptionalDate(body.issueDate) ?? new Date(),
    validUntil: parseOptionalDate(body.validUntil),
    dueDate: parseOptionalDate(body.dueDate),
    taxRate: totals.taxRate,
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
    totalAmount: totals.totalAmount,
    currency: typeof body.currency === "string" && body.currency ? body.currency : "EUR",
    itemsJson: totals.items,
    notes: typeof body.notes === "string" ? body.notes : null,
    footerNote: typeof body.footerNote === "string" ? body.footerNote : null,
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const documents = await prisma.manualDocument.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET /api/admin/dokumente error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();
    const payload = normalizePayload(body);

    if (!payload.title || !payload.customerName || !payload.customerEmail || !payload.serviceSummary) {
      return NextResponse.json({ error: "Titel, Kunde, E-Mail und Leistung sind erforderlich." }, { status: 400 });
    }

    const documentNumber = payload.documentNumber || (await nextManualDocumentNumber(payload.type));

    const document = await prisma.manualDocument.create({
      data: {
        ...payload,
        documentNumber,
      },
      include: { customer: true },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/dokumente error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
