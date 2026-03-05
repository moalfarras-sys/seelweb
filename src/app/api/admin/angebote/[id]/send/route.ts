import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAgbPDF, generateOfferPDF } from "@/lib/pdf";
import { sendEmail } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        customer: true,
        order: { include: { fromAddress: true, toAddress: true, service: true } },
        items: { orderBy: { position: "asc" } },
      },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    const serviceSummary = offer.order.service.nameDe;
    const offerPdf = generateOfferPDF({
      offerNumber: offer.offerNumber,
      validUntil: offer.validUntil.toLocaleDateString("de-DE"),
      customerName: offer.customer.name,
      customerEmail: offer.customer.email,
      customerPhone: offer.customer.phone,
      customerCompany: offer.customer.company ?? undefined,
      serviceSummary,
      routeDistanceKm: offer.order.distanceKm,
      serviceDate: offer.order.scheduledAt?.toLocaleDateString("de-DE") ?? null,
      timeSlot: offer.order.timeSlot,
      fromAddress: offer.order.fromAddress
        ? [offer.order.fromAddress.street, offer.order.fromAddress.houseNumber, offer.order.fromAddress.zip, offer.order.fromAddress.city]
            .filter(Boolean)
            .join(", ")
        : null,
      toAddress: offer.order.toAddress
        ? [offer.order.toAddress.street, offer.order.toAddress.houseNumber, offer.order.toAddress.zip, offer.order.toAddress.city]
            .filter(Boolean)
            .join(", ")
        : null,
      items: offer.items.map((item) => ({
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: offer.subtotal,
      discountAmount: offer.discountAmount,
      extraFees: offer.extraFees,
      netto: offer.netto,
      mwst: offer.mwst,
      totalPrice: offer.totalPrice,
      notes: offer.order.notes,
      agbText: "Es gelten unsere AGB.",
      jobDetails: {
        computedDurationHours: offer.order.totalHours || null,
        routeDurationMin: null,
        floorFrom: offer.order.fromAddress?.floor ?? null,
        floorTo: offer.order.toAddress?.floor ?? null,
        hasElevatorFrom: offer.order.fromAddress?.hasElevator ?? null,
        hasElevatorTo: offer.order.toAddress?.hasElevator ?? null,
        parkingFrom: offer.order.fromAddress ? (offer.order.fromAddress.hasParkingZone ? "Parkzone" : "Keine Parkzone") : null,
        parkingTo: offer.order.toAddress ? (offer.order.toAddress.hasParkingZone ? "Parkzone" : "Keine Parkzone") : null,
        estimateNote: "Hinweis: Distanzkosten werden als Richtwert/Schätzung berechnet, bis die finale Einsatzplanung bestätigt ist.",
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const offerUrl = `${baseUrl}/angebot/${offer.token}`;
    const agbPdf = generateAgbPDF();

    const htmlEmail = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f6f8;padding:32px;margin:0;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#0f2550;padding:24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;">SEEL Transport & Reinigung</h1>
    </div>
    <div style="padding:26px;">
      <h2 style="margin:0 0 12px;color:#0f2550;">Ihr Angebot</h2>
      <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">Sehr geehrte/r ${offer.customer.name},</p>
      <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">vielen Dank für Ihre Anfrage. Im Anhang finden Sie Ihr Angebot (${offer.offerNumber}) inklusive aller Details, Preise und Bedingungen.</p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;margin:12px 0 20px;">
        <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Angebotsnummer</td><td style="padding:10px 14px;text-align:right;font-family:monospace;color:#0d9ea0;font-weight:700;">${offer.offerNumber}</td></tr>
        <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Leistungen</td><td style="padding:10px 14px;text-align:right;color:#0f2550;">${serviceSummary}</td></tr>
        <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Termin</td><td style="padding:10px 14px;text-align:right;color:#0f2550;">${offer.order.scheduledAt?.toLocaleDateString("de-DE") || "Nach Absprache"}</td></tr>
        <tr><td style="padding:10px 14px;color:#64748b;font-size:13px;">Gesamtbetrag</td><td style="padding:10px 14px;text-align:right;color:#0f2550;font-size:20px;font-weight:800;">${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(offer.totalPrice)}</td></tr>
      </table>
      <p style="margin:0 0 16px;color:#6b7280;font-size:13px;line-height:1.6;">Bitte prüfen Sie das Angebot im Anhang. Bei Fragen erreichen Sie uns jederzeit unter +49 172 8003410 oder info@seeltransport.de.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${offerUrl}" style="display:inline-block;background:#0d9ea0;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;">Angebot online ansehen & bestätigen</a>
      </div>
    </div>
    <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;color:#94a3b8;font-size:11px;">
        SEEL Transport & Reinigung<br/>
        <a href="https://seeltransport.de/impressum" style="color:#0d9ea0;text-decoration:none;">Impressum</a> | 
        <a href="https://seeltransport.de/datenschutz" style="color:#0d9ea0;text-decoration:none;">Datenschutz</a> | 
        <a href="https://seeltransport.de/agb" style="color:#0d9ea0;text-decoration:none;">AGB</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail({
      to: offer.customer.email,
      subject: `Ihr Angebot - ${offer.offerNumber}`,
      html: htmlEmail,
      attachments: [
        {
          filename: `Angebot-${offer.offerNumber}.pdf`,
          content: offerPdf,
          contentType: "application/pdf",
        },
        {
          filename: "AGB-SEEL-Transport-Reinigung.pdf",
          content: agbPdf,
          contentType: "application/pdf",
        },
      ],
    });

    await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: `Angebot ${offer.offerNumber} erneut versendet`,
        message: "Angebot erneut per E-Mail versendet.",
        metaJson: { offerUrl },
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/angebote/[id]/send error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
