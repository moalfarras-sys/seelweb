import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { removeAccountingUploadCopies } from "@/lib/accounting-storage";
import {
  calculateExpenseAmounts,
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_DOCUMENT_TYPE_OPTIONS,
  EXPENSE_PAYMENT_METHOD_OPTIONS,
  EXPENSE_PAYMENT_STATUS_OPTIONS,
} from "@/lib/accounting-expenses";

type Params = { params: Promise<{ id: string }> };

function parseOptionalDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sanitizeOption(
  value: string | null | undefined,
  allowed: readonly { value: string }[],
  fallback: string,
) {
  return allowed.some((option) => option.value === value) ? String(value) : fallback;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const amounts = calculateExpenseAmounts({
      grossAmount: body.amount,
      netAmount: body.netAmount,
      taxAmount: body.taxAmount,
      taxRate: body.taxRate,
    });

    const expense = await prisma.manualExpense.update({
      where: { id },
      data: {
        category: sanitizeOption(String(body.category || ""), EXPENSE_CATEGORY_OPTIONS, "other"),
        documentType: sanitizeOption(String(body.documentType || ""), EXPENSE_DOCUMENT_TYPE_OPTIONS, "RECHNUNG"),
        description: String(body.description || "").trim(),
        supplierName: body.supplierName ? String(body.supplierName).trim() : null,
        documentNumber: body.documentNumber ? String(body.documentNumber).trim() : null,
        accountCode: body.accountCode ? String(body.accountCode).trim() : null,
        amount: amounts.amount,
        netAmount: amounts.netAmount,
        taxAmount: amounts.taxAmount,
        taxRate: amounts.taxRate,
        currency: body.currency ? String(body.currency).trim().toUpperCase() : "EUR",
        date: parseOptionalDate(body.date) ?? new Date(),
        issueDate: parseOptionalDate(body.issueDate),
        serviceDate: parseOptionalDate(body.serviceDate),
        paymentMethod: sanitizeOption(
          body.paymentMethod ? String(body.paymentMethod) : null,
          EXPENSE_PAYMENT_METHOD_OPTIONS,
          "BANK_TRANSFER",
        ),
        paymentStatus: sanitizeOption(
          body.paymentStatus ? String(body.paymentStatus) : null,
          EXPENSE_PAYMENT_STATUS_OPTIONS,
          "PAID",
        ),
        notes: body.notes ? String(body.notes).trim() : null,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("PATCH /api/admin/buchhaltung/ausgabe/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.manualExpense.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Ausgabe nicht gefunden" }, { status: 404 });
    }

    await prisma.manualExpense.delete({ where: { id } });
    await removeAccountingUploadCopies(existing.attachmentUrl, existing.storagePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/buchhaltung/ausgabe/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
