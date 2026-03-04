import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createContractFromOffer } from "@/lib/workflow";
import { sendEmail } from "@/lib/email";
import { CONTACT, COMPANY_LEGAL } from "@/config/contact";

type Params = { params: Promise<{ id: string }> };

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function buildSignatureEmail(data: { customerName: string; offerNumber: string; contractNumber: string; totalPrice: number; signUrl: string }) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#f0f2f5;">
  <div style="max-width:600px;margin:0 auto;padding:30px 15px;">
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0f2550 0%,#1a3a6b 100%);padding:40px 35px;text-align:center;">
        <div style="width:56px;height:56px;background:#0d9ea0;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
          <span style="color:white;font-size:24px;font-weight:900;">S</span>
        </div>
        <h1 style="color:white;margin:0 0 4px;font-size:22px;font-weight:700;">SEEL Transport & Reinigung</h1>
        <p style="color:#8b9bb5;margin:0;font-size:13px;">Professionelle Dienstleistungen in Berlin</p>
      </div>

      <!-- Content -->
      <div style="padding:35px;">
        <h2 style="color:#0f2550;margin:0 0 20px;font-size:20px;">Ihr Vertrag ist bereit</h2>
        <p style="color:#5a6b80;line-height:1.7;margin:0 0 24px;font-size:15px;">
          Sehr geehrte/r <strong style="color:#0f2550;">${data.customerName}</strong>,<br><br>
          Ihr Vertrag zum Angebot <strong style="color:#0d9ea0;">${data.offerNumber}</strong> steht zur digitalen Unterschrift bereit.
        </p>

        <!-- Contract Details Box -->
        <div style="background:#f7f8fa;border-radius:14px;padding:20px;margin:0 0 28px;border:1px solid #e8ecf1;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#8b9bb5;font-size:13px;">Vertragsnummer</td>
              <td style="padding:8px 0;color:#0f2550;font-weight:700;text-align:right;font-size:14px;">${data.contractNumber}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#8b9bb5;font-size:13px;">Angebotsnummer</td>
              <td style="padding:8px 0;color:#0f2550;font-weight:700;text-align:right;font-size:14px;">${data.offerNumber}</td>
            </tr>
            <tr style="border-top:2px solid #e8ecf1;">
              <td style="padding:14px 0 0;color:#8b9bb5;font-size:13px;">Vertragswert</td>
              <td style="padding:14px 0 0;color:#0d9ea0;font-weight:900;text-align:right;font-size:24px;">${fmt.format(data.totalPrice)}</td>
            </tr>
          </table>
        </div>

        <!-- CTA Button -->
        <div style="text-align:center;margin:0 0 28px;">
          <a href="${data.signUrl}" style="display:inline-block;background:linear-gradient(135deg,#0d9ea0 0%,#0b8b8d 100%);color:white;text-decoration:none;padding:18px 48px;border-radius:14px;font-weight:700;font-size:17px;letter-spacing:0.3px;box-shadow:0 4px 16px rgba(13,158,160,0.35);">
            ✍️&nbsp;&nbsp;Jetzt online unterschreiben
          </a>
        </div>

        <p style="color:#8b9bb5;font-size:13px;line-height:1.6;margin:0 0 8px;">
          Klicken Sie auf den Button, um den Vertrag einzusehen und digital zu unterschreiben. Der Vorgang dauert nur wenige Minuten.
        </p>

        <div style="background:#fff9e6;border-radius:10px;padding:14px 18px;margin:20px 0 0;border:1px solid #f5e6b8;">
          <p style="margin:0;color:#7a6520;font-size:12px;line-height:1.5;">
            <strong>🔒 Sicher & rechtsverbindlich:</strong> Ihre digitale Unterschrift ist rechtsgültig nach eIDAS-Verordnung. Alle Daten werden verschlüsselt übertragen.
          </p>
        </div>
      </div>

      <!-- Contact -->
      <div style="padding:24px 35px;background:#f7f8fa;border-top:1px solid #e8ecf1;">
        <p style="color:#8b9bb5;font-size:12px;line-height:1.6;margin:0;">
          Bei Fragen erreichen Sie uns unter
          <a href="tel:${CONTACT.PRIMARY_PHONE}" style="color:#0d9ea0;font-weight:600;">${CONTACT.PRIMARY_PHONE_DISPLAY}</a> oder
          <a href="mailto:${CONTACT.EMAIL}" style="color:#0d9ea0;font-weight:600;">${CONTACT.EMAIL}</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:20px 35px;text-align:center;border-top:1px solid #e8ecf1;">
        <p style="margin:0;color:#b0b8c4;font-size:11px;">
          &copy; ${new Date().getFullYear()} ${COMPANY_LEGAL.NAME} &middot; Berlin, Deutschland &middot; USt-IdNr.: ${COMPANY_LEGAL.VAT_ID}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { customer: true, contracts: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    if (offer.status !== "APPROVED" && offer.status !== "ACCEPTED") {
      return NextResponse.json({ error: "Angebot ist noch nicht freigegeben." }, { status: 409 });
    }

    const contract = offer.contracts[0] || (await createContractFromOffer(offer.id));

    if (contract.status === "SIGNED" || contract.status === "LOCKED") {
      return NextResponse.json({ error: "Vertrag ist bereits unterschrieben." }, { status: 409 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const signUrl = `${baseUrl}/vertrag/${contract.token}`;

    await sendEmail({
      to: offer.customer.email,
      subject: `Vertrag zur Online-Unterschrift – ${offer.offerNumber} | SEEL Transport`,
      html: buildSignatureEmail({
        customerName: offer.customer.name,
        offerNumber: offer.offerNumber,
        contractNumber: contract.contractNumber,
        totalPrice: offer.totalPrice,
        signUrl,
      }),
    });

    await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        contractId: contract.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: `Vertrag zur Signatur gesendet (${offer.offerNumber})`,
        message: `Signaturlink versendet: ${signUrl}`,
        metaJson: { signUrl },
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json({ success: true, contractToken: contract.token, signUrl });
  } catch (error) {
    console.error("POST /api/admin/angebote/[id]/send-contract-signature error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
