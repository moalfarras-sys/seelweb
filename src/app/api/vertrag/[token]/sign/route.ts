import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { CONTACT } from "@/config/contact";
import { prisma } from "@/lib/db";
import { getInternalNotificationBcc, sendEmail } from "@/lib/email";
import { generateSignedContractPDF } from "@/lib/pdf";
import { createInvoiceForSignedContract } from "@/lib/workflow";

type Params = { params: Promise<{ token: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const signatureType = body.signatureType === "DRAWN" ? "DRAWN" : "TYPED";
    const signatureDataUrl =
      typeof body.signatureDataUrl === "string" && body.signatureDataUrl.startsWith("data:image") ? body.signatureDataUrl : null;
    const agreed = body.agreed === true;

    if (!name) {
      return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });
    }
    if (!agreed) {
      return NextResponse.json({ error: "AGB-Zustimmung ist erforderlich" }, { status: 400 });
    }
    if (signatureType === "DRAWN" && !signatureDataUrl) {
      return NextResponse.json({ error: "Gezeichnete Signatur fehlt" }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({
      where: { token },
      include: {
        customer: true,
        offer: { include: { order: { include: { service: true } } } },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Vertrag nicht gefunden" }, { status: 404 });
    }

    if (contract.status === "SIGNED" || contract.status === "LOCKED") {
      return NextResponse.json({ error: "Vertrag wurde bereits unterschrieben" }, { status: 409 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const signedAt = new Date();

    const signatureHash = crypto
      .createHash("sha256")
      .update(`${contract.id}:${name}:${signedAt.toISOString()}:${ip}:${signatureDataUrl || ""}`)
      .digest("hex");

    await prisma.signature.create({
      data: {
        contractId: contract.id,
        method: signatureType,
        typedName: name,
        imageDataUrl: signatureDataUrl,
        ipAddress: ip,
        userAgent,
        signatureHash,
        signedAt,
      },
    });

    const offer = await prisma.offer.findUnique({
      where: { id: contract.offerId },
      include: {
        items: { orderBy: { position: "asc" } },
        order: { include: { fromAddress: true, toAddress: true } },
      },
    });

    const signedPdf = await generateSignedContractPDF({
      contractNumber: contract.contractNumber,
      offerNumber: contract.offer.offerNumber,
      customerName: contract.customer.name,
      customerEmail: contract.customer.email,
      customerCompany: contract.customer.company,
      serviceSummary: contract.offer.order.service.nameDe,
      serviceDate: contract.offer.order.scheduledAt?.toLocaleDateString("de-DE") ?? null,
      timeSlot: contract.offer.order.timeSlot,
      fromAddress: offer?.order?.fromAddress
        ? [
            offer.order.fromAddress.street,
            offer.order.fromAddress.houseNumber,
            offer.order.fromAddress.zip,
            offer.order.fromAddress.city,
          ]
            .filter(Boolean)
            .join(", ")
        : null,
      toAddress: offer?.order?.toAddress
        ? [
            offer.order.toAddress.street,
            offer.order.toAddress.houseNumber,
            offer.order.toAddress.zip,
            offer.order.toAddress.city,
          ]
            .filter(Boolean)
            .join(", ")
        : null,
      items: offer?.items.map((item) => ({
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: offer?.items.reduce((sum, item) => sum + item.totalPrice, 0),
      discountAmount: offer?.discountAmount ?? 0,
      extraFees: offer?.extraFees ?? 0,
      totalPrice: contract.finalTotalPrice,
      netto: contract.finalNetto,
      mwst: contract.finalMwst,
      signedByName: name,
      signedAt: signedAt.toLocaleString("de-DE"),
      ipAddress: ip,
      signatureDataUrl,
    });

    await prisma.$transaction([
      prisma.contract.update({
        where: { token },
        data: {
          agreedToTermsAt: signedAt,
          signedAt,
          signedByName: name,
          signedByIp: ip,
          signedByUserAgent: userAgent,
          signedPdfBase64: signedPdf.toString("base64"),
          status: "SIGNED",
        },
      }),
      prisma.offer.updateMany({
        where: { id: contract.offerId, status: "APPROVED" },
        data: { status: "ACCEPTED", acceptedAt: signedAt },
      }),
    ]);

    const invoice = await createInvoiceForSignedContract(contract.id);
    const internalBcc = getInternalNotificationBcc(contract.customer.email);
    const emailResult = await sendEmail({
      to: contract.customer.email,
      bcc: internalBcc,
      subject: `Vertrag ${contract.contractNumber} bestaetigt - SEEL Transport`,
      html: `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#f0f2f5;">
<div style="max-width:600px;margin:0 auto;padding:30px 15px;">
<div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#0f2550,#1a3a6b);padding:35px;text-align:center;">
    <div style="width:64px;height:64px;background:#10b981;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
      <span style="color:white;font-size:32px;">&#10003;</span>
    </div>
    <h1 style="color:white;margin:0;font-size:22px;">Vertrag erfolgreich unterschrieben</h1>
  </div>
  <div style="padding:30px 35px;">
    <p style="color:#5a6b80;font-size:15px;line-height:1.7;">
      Sehr geehrte/r <strong style="color:#0f2550;">${contract.customer.name}</strong>,<br><br>
      Ihr Vertrag <strong style="color:#0d9ea0;">${contract.contractNumber}</strong> wurde erfolgreich bestaetigt und digital unterschrieben.
    </p>
    <div style="background:#f7f8fa;border-radius:14px;padding:18px;margin:20px 0;border:1px solid #e8ecf1;">
      <p style="margin:0 0 6px;color:#8b9bb5;font-size:12px;">Vertragsnummer</p>
      <p style="margin:0;color:#0f2550;font-weight:700;font-size:16px;">${contract.contractNumber}</p>
    </div>
    <p style="color:#5a6b80;font-size:14px;line-height:1.6;">
      Den unterzeichneten Vertrag finden Sie als PDF im Anhang dieser E-Mail. Bitte bewahren Sie dieses Dokument fuer Ihre Unterlagen auf.
    </p>
    <p style="color:#8b9bb5;font-size:12px;margin-top:20px;">
      Bei Fragen: <a href="mailto:${CONTACT.EMAIL}" style="color:#0d9ea0;">${CONTACT.EMAIL}</a> |
      <a href="tel:${CONTACT.PRIMARY_PHONE}" style="color:#0d9ea0;">${CONTACT.PRIMARY_PHONE_DISPLAY}</a>
    </p>
  </div>
  <div style="padding:16px 35px;text-align:center;border-top:1px solid #e8ecf1;">
    <p style="margin:0;color:#b0b8c4;font-size:11px;">&copy; ${new Date().getFullYear()} SEEL Transport & Reinigung &middot; Berlin</p>
  </div>
</div>
</div>
</body></html>`,
      attachments: [
        {
          filename: `Vertrag-${contract.contractNumber}.pdf`,
          content: signedPdf,
          contentType: "application/pdf",
        },
      ],
      requestId: `contract-signed-${contract.id}`,
      throwOnFailure: false,
    });

    await prisma.communication.create({
      data: {
        customerId: contract.customerId,
        offerId: contract.offerId,
        contractId: contract.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: "Vertrag bestaetigt - SEEL Transport",
        message: emailResult.success
          ? `Vertrag unterschrieben und bestaetigt. Rechnung ${invoice.invoiceNumber} erstellt.`
          : `Vertrag unterschrieben, aber E-Mail-Versand fehlgeschlagen. Rechnung ${invoice.invoiceNumber} erstellt.`,
        metaJson: {
          invoiceNumber: invoice.invoiceNumber,
          emailDelivered: emailResult.success,
          messageId: "messageId" in emailResult ? emailResult.messageId : null,
          internalBcc,
          emailError: emailResult.success ? null : (emailResult.error as Error | undefined)?.message || "Unbekannter Fehler",
        },
        sentBy: "system",
      },
    });

    return NextResponse.json({ success: true, emailDelivered: emailResult.success });
  } catch (error) {
    console.error("POST /api/vertrag/[token]/sign error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
