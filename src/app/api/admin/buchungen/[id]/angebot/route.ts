import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { CONTACT } from "@/config/contact";

type Params = { params: Promise<{ id: string }> };

const CATEGORY_LABELS: Record<string, string> = {
  HOME_CLEANING: "Haushaltsreinigung",
  MOVE_OUT_CLEANING: "Endreinigung",
  OFFICE_CLEANING: "Büroreinigung",
  MOVING: "Umzug",
  DISPOSAL: "Entrümpelung",
};

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true, service: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Buchung nicht gefunden" },
        { status: 404 }
      );
    }

    const signToken = crypto.randomUUID();
    const category = (order.service.category as string) || "MOVING";
    const title =
      body.title || `Vertrag – ${CATEGORY_LABELS[category] || category}`;

    const contract = await prisma.b2BContract.create({
      data: {
        customerId: order.customerId,
        category: category as "HOME_CLEANING" | "MOVE_OUT_CLEANING" | "OFFICE_CLEANING" | "MOVING" | "DISPOSAL",
        title,
        description:
          body.description ||
          `Vertrag für ${order.service.nameDe} (Buchung ${order.orderNumber})`,
        pricePerMonth: body.pricePerMonth ?? order.totalPrice,
        pricePerM2: body.pricePerM2 ?? null,
        areaM2: body.areaM2 ?? order.areaM2 ?? null,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null,
        invoiceSchedule: body.invoiceSchedule || "MONTHLY",
        status: "ENTWURF",
        signToken,
      },
      include: { customer: true },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || `https://${CONTACT.WEBSITE_DISPLAY}`;
    const signLink = `${baseUrl}/vertrag/${signToken}`;

    const priceDisplay = contract.pricePerMonth ? `${contract.pricePerMonth.toFixed(2).replace(".", ",")} €` : "nach Vereinbarung";

    await sendEmail({
      to: order.customer.email,
      subject: `Ihr Vertragsangebot – ${contract.title}`,
      html: buildContractEmail({
        customerName: order.customer.name,
        contractTitle: contract.title,
        category: CATEGORY_LABELS[category] || category,
        price: priceDisplay,
        signLink,
      }),
    });

    await prisma.order.update({
      where: { id },
      data: { status: "ANGEBOT" },
    });

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      signLink,
    });
  } catch (error) {
    console.error("POST /api/admin/buchungen/[id]/angebot error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
};

function buildContractEmail(data: {
  customerName: string;
  contractTitle: string;
  category: string;
  price: string;
  signLink: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f5f6f8; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
        <div style="background: #0f2550; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">SEEL Transport</h1>
          <p style="color: #b0b8c1; margin: 5px 0 0; font-size: 13px;">Reinigung und Dienstleistungen</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0f2550; margin: 0 0 20px;">Vertragsangebot</h2>
          <p style="color: #6b7787; line-height: 1.6;">
            Sehr geehrte/r ${data.customerName},<br><br>
            wir haben ein Vertragsangebot für Sie vorbereitet. Bitte prüfen Sie die Details und unterschreiben Sie den Vertrag online.
          </p>
          <div style="background: #f5f6f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7787; font-size: 13px;">Vertrag</td>
                <td style="padding: 8px 0; font-weight: 600; color: #0f2550; text-align: right;">${data.contractTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7787; font-size: 13px;">Leistung</td>
                <td style="padding: 8px 0; font-weight: 600; color: #0f2550; text-align: right;">${data.category}</td>
              </tr>
              <tr style="border-top: 1px solid #e0e0e0;">
                <td style="padding: 12px 0 0; color: #6b7787; font-size: 13px;">Monatspreis</td>
                <td style="padding: 12px 0 0; font-weight: 800; color: #0d9ea0; text-align: right; font-size: 20px;">${data.price}</td>
              </tr>
            </table>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.signLink}" style="display: inline-block; background: #0d9ea0; color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Vertrag ansehen & unterschreiben
            </a>
          </div>
          <p style="color: #6b7787; line-height: 1.6; font-size: 13px;">
            Bei Fragen erreichen Sie uns unter
            <a href="tel:${CONTACT.PRIMARY_PHONE}" style="color: #0d9ea0;">${CONTACT.PRIMARY_PHONE_DISPLAY}</a> oder
            <a href="mailto:${CONTACT.EMAIL}" style="color: #0d9ea0;">${CONTACT.EMAIL}</a>.
          </p>
        </div>
        <div style="background: #f5f6f8; padding: 20px; text-align: center; font-size: 11px; color: #6b7787;">
          &copy; ${new Date().getFullYear()} Seel Transport &amp; Reinigung &middot; Deutschland
        </div>
      </div>
    </body>
    </html>
  `;
}

