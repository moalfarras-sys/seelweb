import { ManualDocumentStatus, ManualDocumentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateManualDocumentTotals } from "@/lib/manual-document-utils";
import { ManualDocumentPayload } from "@/lib/manual-documents";

type Params = { params: Promise<{ id: string }> };

function parseOptionalDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizePayload(body: Record<string, unknown>) {
  const type = Object.values(ManualDocumentType).includes(body.type as ManualDocumentType)
    ? (body.type as ManualDocumentType)
    : undefined;
  const items = Array.isArray(body.items) ? body.items : [];
  const totals = items.length > 0
    ? calculateManualDocumentTotals(items as ManualDocumentPayload["items"], Number(body.taxRate ?? 19))
    : null;

  return {
    ...(type ? { type } : {}),
    ...(Object.values(ManualDocumentStatus).includes(body.status as ManualDocumentStatus)
      ? { status: body.status as ManualDocumentStatus }
      : {}),
    ...(body.customerId !== undefined ? { customerId: typeof body.customerId === "string" && body.customerId ? body.customerId : null } : {}),
    ...(body.sourceOrderId !== undefined ? { sourceOrderId: typeof body.sourceOrderId === "string" && body.sourceOrderId ? body.sourceOrderId : null } : {}),
    ...(body.title !== undefined ? { title: String(body.title || "") } : {}),
    ...(body.introText !== undefined ? { introText: body.introText ? String(body.introText) : null } : {}),
    ...(body.customerName !== undefined ? { customerName: String(body.customerName || "") } : {}),
    ...(body.customerEmail !== undefined ? { customerEmail: String(body.customerEmail || "") } : {}),
    ...(body.customerPhone !== undefined ? { customerPhone: body.customerPhone ? String(body.customerPhone) : null } : {}),
    ...(body.customerCompany !== undefined ? { customerCompany: body.customerCompany ? String(body.customerCompany) : null } : {}),
    ...(body.serviceSummary !== undefined ? { serviceSummary: String(body.serviceSummary || "") } : {}),
    ...(body.serviceDate !== undefined ? { serviceDate: parseOptionalDate(body.serviceDate) } : {}),
    ...(body.timeSlot !== undefined ? { timeSlot: body.timeSlot ? String(body.timeSlot) : null } : {}),
    ...(body.fromAddress !== undefined ? { fromAddress: body.fromAddress ? String(body.fromAddress) : null } : {}),
    ...(body.toAddress !== undefined ? { toAddress: body.toAddress ? String(body.toAddress) : null } : {}),
    ...(body.routeDistanceKm !== undefined ? { routeDistanceKm: body.routeDistanceKm !== null ? Number(body.routeDistanceKm) : null } : {}),
    ...(body.issueDate !== undefined ? { issueDate: parseOptionalDate(body.issueDate) ?? new Date() } : {}),
    ...(body.validUntil !== undefined ? { validUntil: parseOptionalDate(body.validUntil) } : {}),
    ...(body.dueDate !== undefined ? { dueDate: parseOptionalDate(body.dueDate) } : {}),
    ...(body.currency !== undefined ? { currency: body.currency ? String(body.currency) : "EUR" } : {}),
    ...(body.notes !== undefined ? { notes: body.notes ? String(body.notes) : null } : {}),
    ...(body.footerNote !== undefined ? { footerNote: body.footerNote ? String(body.footerNote) : null } : {}),
    ...(totals
      ? {
          taxRate: totals.taxRate,
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          totalAmount: totals.totalAmount,
          itemsJson: totals.items,
        }
      : body.taxRate !== undefined
        ? { taxRate: Number(body.taxRate) }
        : {}),
  };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const document = await prisma.manualDocument.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!document) {
      return NextResponse.json({ error: "Dokument nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("GET /api/admin/dokumente/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = normalizePayload(body);

    const document = await prisma.manualDocument.update({
      where: { id },
      data,
      include: { customer: true },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("PATCH /api/admin/dokumente/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
