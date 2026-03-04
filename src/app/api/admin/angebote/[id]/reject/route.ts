import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body.reason ? String(body.reason) : "Ohne Angabe";

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: { status: "REJECTED", rejectedAt: new Date() },
    });

    await sendEmail({
      to: offer.customer.email,
      subject: "Update zu Ihrem Angebot - Seel Transport",
      html: `<p>Sehr geehrte/r ${offer.customer.name},</p><p>Ihr Angebot ${offer.offerNumber} wurde aktuell nicht freigegeben.</p><p>Grund: ${reason}</p><p>Bei Rückfragen antworten Sie bitte auf diese E-Mail.</p>`,
    });

    await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: `Angebot ${offer.offerNumber} abgelehnt`,
        message: `Ablehnung versendet. Grund: ${reason}`,
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (error) {
    console.error("POST /api/admin/angebote/[id]/reject error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

