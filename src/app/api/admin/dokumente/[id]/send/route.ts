import { ManualDocumentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import {
  buildManualDocumentEmail,
  getManualDocumentEmailSubject,
} from "@/lib/manual-documents";
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

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const explicitEmail = typeof body.email === "string" && body.email ? body.email : null;

    const document = await prisma.manualDocument.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json({ error: "Dokument nicht gefunden" }, { status: 404 });
    }

    const items = Array.isArray(document.itemsJson) ? (document.itemsJson as unknown as ManualItem[]) : [];
    let pdf: Buffer;

    if (document.type === "CONTRACT") {
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
    } else if (document.type === "INVOICE") {
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

    const recipientEmail = explicitEmail || document.customerEmail;
    const subject = getManualDocumentEmailSubject(document.type, document.documentNumber, document.title);
    const emailResult = await sendEmail({
      to: explicitEmail || document.customerEmail,
      subject: getManualDocumentEmailSubject(document.type, document.documentNumber, document.title),
      html: buildManualDocumentEmail({
        type: document.type,
        customerName: document.customerName,
        documentNumber: document.documentNumber,
        title: document.title,
        totalAmount: document.totalAmount,
        serviceSummary: document.serviceSummary,
      }),
      attachments: [
        {
          filename: `${document.documentNumber}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });

    await prisma.communication.create({
      data: {
        customerId: document.customerId,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject,
        message: `${document.type} ${document.documentNumber} wurde per E-Mail versendet.`,
        metaJson: {
          to: recipientEmail,
          manualDocumentId: document.id,
          manualDocumentType: document.type,
          documentNumber: document.documentNumber,
          messageId: emailResult.messageId,
        },
        sentBy: session.email || "admin",
      },
    });

    const nextStatus =
      document.status === ManualDocumentStatus.PAID || document.status === ManualDocumentStatus.SIGNED
        ? document.status
        : ManualDocumentStatus.SENT;

    const updated = await prisma.manualDocument.update({
      where: { id: document.id },
      data: {
        status: nextStatus,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      document: updated,
      message: `E-Mail an ${recipientEmail} wurde versendet.`,
    });
  } catch (error) {
    console.error("POST /api/admin/dokumente/[id]/send error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
