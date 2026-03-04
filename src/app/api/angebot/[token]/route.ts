import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ token: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const offer = await prisma.offer.findUnique({
      where: { token },
      include: {
        customer: true,
        order: { include: { fromAddress: true, toAddress: true, service: true } },
        items: { orderBy: { position: "asc" } },
        contracts: true,
      },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    const isExpired = offer.validUntil.getTime() < Date.now();
    return NextResponse.json({
      id: offer.id,
      offerNumber: offer.offerNumber,
      status: isExpired && offer.status === "PENDING" ? "EXPIRED" : offer.status,
      validUntil: offer.validUntil,
      subtotal: offer.subtotal,
      discountAmount: offer.discountAmount,
      extraFees: offer.extraFees,
      netto: offer.netto,
      mwst: offer.mwst,
      totalPrice: offer.totalPrice,
      customer: {
        name: offer.customer.name,
        email: offer.customer.email,
        phone: offer.customer.phone,
        company: offer.customer.company,
      },
      order: {
        serviceName: offer.order.service.nameDe,
        scheduledAt: offer.order.scheduledAt,
        timeSlot: offer.order.timeSlot,
        fromAddress: offer.order.fromAddress?.street ?? null,
        toAddress: offer.order.toAddress?.street ?? null,
      },
      items: offer.items,
      contractToken: offer.contracts[0]?.token ?? null,
    });
  } catch (error) {
    console.error("GET /api/angebot/[token] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

