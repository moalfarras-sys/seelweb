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
    const body = await req.json();
    const subject = String(body.subject || "Rückfrage zu Ihrem Angebot");
    const message = String(body.message || "").trim();
    const sendEmailFlag = body.sendEmail !== false;
    if (!message) {
      return NextResponse.json({ error: "Nachricht ist erforderlich" }, { status: 400 });
    }

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    if (sendEmailFlag) {
      await sendEmail({
        to: offer.customer.email,
        subject,
        html: `<p>Sehr geehrte/r ${offer.customer.name},</p><p>${message.replace(/\\n/g, "<br/>")}</p>`,
      });
    }

    const row = await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        channel: sendEmailFlag ? "EMAIL" : "INTERNAL_NOTE",
        direction: sendEmailFlag ? "OUTBOUND" : "INTERNAL",
        subject,
        message,
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json({ success: true, communication: row });
  } catch (error) {
    console.error("POST /api/admin/angebote/[id]/contact error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

