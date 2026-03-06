import { ManualDocumentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateInvoicePDF, generateOfferPDF, generateSignedContractPDF } from "@/lib/pdf";

type Params = { params: Promise<{ id: string }> };

type ManualItem = {
  title: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

function toDateLabel(value: Date | null | undefined) {
  return value ? value.toLocaleDateString("de-DE") : null;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const download = req.nextUrl.searchParams.get("download") === "1";
    const document = await prisma.manualDocument.findUnique({ where: { id } });

    if (!document) {
      return NextResponse.json({ error: "Dokument nicht gefunden" }, { status: 404 });
    }

    const items = Array.isArray(document.itemsJson) ? (document.itemsJson as unknown as ManualItem[]) : [];
    let pdf: Buffer;

    if (document.type === ManualDocumentType.CONTRACT) {
      pdf = await generateSignedContractPDF({
        contractNumber: document.documentNumber,
        offerNumber: document.sourceOrderId || "MANUELL",
        customerName: document.customerName,
        customerEmail: document.customerEmail,
        customerCompany: document.customerCompany,
        serviceSummary: document.serviceSummary,
        serviceDate: toDateLabel(document.serviceDate),
        timeSlot: document.timeSlot,
        fromAddress: document.fromAddress,
        toAddress: document.toAddress,
        items,
        subtotal: document.subtotal,
        totalPrice: document.totalAmount,
        netto: document.subtotal,
        mwst: document.taxAmount,
        signedByName: document.status === "SIGNED" ? document.customerName : null,
        signedAt: document.status === "SIGNED" ? toDateLabel(document.issueDate) : null,
        companyExecutedAt: toDateLabel(document.issueDate),
        notes: document.notes,
      });
    } else if (document.type === ManualDocumentType.INVOICE) {
      pdf = generateInvoicePDF({
        invoiceNumber: document.documentNumber,
        customerName: document.customerName,
        customerEmail: document.customerEmail,
        customerPhone: document.customerPhone || undefined,
        customerCompany: document.customerCompany || undefined,
        service: document.serviceSummary,
        title: document.title,
        date: document.issueDate.toLocaleDateString("de-DE"),
        netto: document.subtotal,
        mwst: document.taxAmount,
        total: document.totalAmount,
        taxRate: document.taxRate,
        dueDate: toDateLabel(document.dueDate) || document.issueDate.toLocaleDateString("de-DE"),
        notes: document.notes || undefined,
        items: items.map((item) => ({
          description: item.title,
          detail: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.totalPrice,
        })),
      });
    } else {
      pdf = generateOfferPDF({
        offerNumber: document.documentNumber,
        validUntil: toDateLabel(document.validUntil) || document.issueDate.toLocaleDateString("de-DE"),
        customerName: document.customerName,
        customerEmail: document.customerEmail,
        customerPhone: document.customerPhone || undefined,
        customerCompany: document.customerCompany || undefined,
        serviceSummary: document.serviceSummary,
        routeDistanceKm: document.routeDistanceKm,
        serviceDate: toDateLabel(document.serviceDate),
        timeSlot: document.timeSlot,
        fromAddress: document.fromAddress,
        toAddress: document.toAddress,
        items,
        subtotal: document.subtotal,
        discountAmount: 0,
        extraFees: 0,
        netto: document.subtotal,
        mwst: document.taxAmount,
        totalPrice: document.totalAmount,
        notes: document.notes,
        statusNote: document.status,
      });
    }

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${document.documentNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/dokumente/[id]/pdf error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
