import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createContractFromOffer } from "@/lib/workflow";
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
      include: { customer: true, order: true },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    const contract = await createContractFromOffer(offer.id);

    const updated = await prisma.offer.update({
      where: { id: offer.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        order: { update: { status: "ANGEBOT" } },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const acceptUrl = `${baseUrl}/angebot/${offer.token}`;
    await sendEmail({
      to: offer.customer.email,
      subject: "Angebot freigegeben - Seel Transport",
      html: `<p>Sehr geehrte/r ${offer.customer.name},</p><p>Ihr Angebot ${offer.offerNumber} wurde final freigegeben.</p><p><a href=\"${acceptUrl}\">Angebot annehmen</a></p><p>Nach Annahme gelangen Sie zur Vertragsunterzeichnung.</p>`,
    });

    await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        contractId: contract.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: `Angebot ${offer.offerNumber} freigegeben`,
        message: "Freigabe an Kunden versendet.",
        metaJson: { acceptUrl },
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json({ success: true, offer: updated, contract });
  } catch (error) {
    console.error("POST /api/admin/angebote/[id]/approve error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

