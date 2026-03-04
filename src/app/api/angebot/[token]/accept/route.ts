import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createContractFromOffer } from "@/lib/workflow";

type Params = { params: Promise<{ token: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const offer = await prisma.offer.findUnique({
      where: { token },
      include: { contracts: true },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }
    if (offer.status !== "APPROVED" && offer.status !== "MODIFIED") {
      return NextResponse.json(
        { error: "Angebot ist noch nicht freigegeben." },
        { status: 409 }
      );
    }

    const contract = offer.contracts[0] || (await createContractFromOffer(offer.id));
    await prisma.offer.update({
      where: { id: offer.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        contractId: contract.id,
        channel: "INTERNAL_NOTE",
        direction: "INTERNAL",
        subject: "Angebot vom Kunden akzeptiert",
        message: `Angebot ${offer.offerNumber} wurde online akzeptiert.`,
        sentBy: "customer",
      },
    });

    return NextResponse.json({ success: true, contractToken: contract.token });
  } catch (error) {
    console.error("POST /api/angebot/[token]/accept error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
