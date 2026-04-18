import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  calculateExpenseAmounts,
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_DOCUMENT_TYPE_OPTIONS,
  EXPENSE_PAYMENT_METHOD_OPTIONS,
  EXPENSE_PAYMENT_STATUS_OPTIONS,
} from "@/lib/accounting-expenses";
import { getAccountingMediaUrl, persistAccountingUpload } from "@/lib/accounting-storage";
import { createUploadFileName } from "@/lib/site-content";

export const dynamic = "force-dynamic";

function parseOptionalDate(value: FormDataEntryValue | string | null | undefined) {
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

function normalizeBasePayload(body: Record<string, unknown>) {
  const amounts = calculateExpenseAmounts({
    grossAmount: body.amount,
    netAmount: body.netAmount,
    taxAmount: body.taxAmount,
    taxRate: body.taxRate,
  });

  return {
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
    date: parseOptionalDate(String(body.date || "")),
    issueDate: parseOptionalDate(body.issueDate ? String(body.issueDate) : null),
    serviceDate: parseOptionalDate(body.serviceDate ? String(body.serviceDate) : null),
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
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const quarter = request.nextUrl.searchParams.get("quarter");
    const year = request.nextUrl.searchParams.get("year");
    const category = request.nextUrl.searchParams.get("category");

    const where: Record<string, unknown> = {};

    if (category && category !== "alle") {
      where.category = category;
    }

    if (quarter && year) {
      const q = Number(quarter);
      const y = Number(year);
      if (Number.isFinite(q) && q >= 1 && q <= 4 && Number.isFinite(y)) {
        const from = new Date(y, (q - 1) * 3, 1);
        const to = new Date(y, q * 3, 0, 23, 59, 59, 999);
        where.date = { gte: from, lte: to };
      }
    }

    const expenses = await prisma.manualExpense.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/admin/buchhaltung/ausgabe error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");
    let attachmentMeta: {
      attachmentUrl?: string | null;
      attachmentName?: string | null;
      attachmentMimeType?: string | null;
      storagePath?: string | null;
    } = {};

    let payload: ReturnType<typeof normalizeBasePayload>;

    if (isFormData) {
      const formData = await request.formData();
      const rawPayload = {
        category: formData.get("category"),
        documentType: formData.get("documentType"),
        description: formData.get("description"),
        supplierName: formData.get("supplierName"),
        documentNumber: formData.get("documentNumber"),
        accountCode: formData.get("accountCode"),
        amount: formData.get("amount"),
        netAmount: formData.get("netAmount"),
        taxAmount: formData.get("taxAmount"),
        taxRate: formData.get("taxRate"),
        currency: formData.get("currency"),
        date: formData.get("date"),
        issueDate: formData.get("issueDate"),
        serviceDate: formData.get("serviceDate"),
        paymentMethod: formData.get("paymentMethod"),
        paymentStatus: formData.get("paymentStatus"),
        notes: formData.get("notes"),
      };
      payload = normalizeBasePayload(rawPayload);

      const file = formData.get("file");
      if (file instanceof File && file.size > 0) {
        const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(file.type)) {
          return NextResponse.json(
            { error: "Nur PDF, JPG, PNG oder WEBP sind erlaubt." },
            { status: 400 },
          );
        }

        const fileName = createUploadFileName(file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await persistAccountingUpload(fileName, buffer);
        attachmentMeta = {
          attachmentUrl: getAccountingMediaUrl(uploadResult.fileName),
          attachmentName: file.name,
          attachmentMimeType: file.type,
          storagePath: uploadResult.storagePath,
        };
      }
    } else {
      payload = normalizeBasePayload((await request.json()) as Record<string, unknown>);
    }

    if (!payload.description || !payload.date || payload.amount <= 0) {
      return NextResponse.json(
        { error: "Beschreibung, Buchungsdatum und Betrag sind erforderlich." },
        { status: 400 },
      );
    }

    const date = payload.date;

    const expense = await prisma.manualExpense.create({
      data: {
        ...payload,
        date,
        ...attachmentMeta,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/buchhaltung/ausgabe error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
