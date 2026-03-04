import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ trackingNumber: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { trackingNumber } = await params;
    const normalized = String(trackingNumber || "").trim().toUpperCase();
    if (!normalized) {
      return NextResponse.json({ success: false, error: "Trackingnummer fehlt" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { trackingNumber: normalized },
      include: {
        customer: true,
        service: true,
        offer: { include: { contracts: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Trackingnummer nicht gefunden" }, { status: 404 });
    }

    const offer = order.offer;
    const contract = offer?.contracts[0] || null;
    const timeline = [
      { key: "ORDER_CREATED", label: "Anfrage eingegangen", at: order.createdAt },
      ...(offer ? [{ key: "OFFER_CREATED", label: "Angebot erstellt", at: offer.createdAt }] : []),
      ...(offer?.approvedAt ? [{ key: "OFFER_APPROVED", label: "Angebot freigegeben", at: offer.approvedAt }] : []),
      ...(offer?.acceptedAt ? [{ key: "OFFER_ACCEPTED", label: "Angebot angenommen", at: offer.acceptedAt }] : []),
      ...(contract?.signedAt ? [{ key: "CONTRACT_SIGNED", label: "Vertrag unterschrieben", at: contract.signedAt }] : []),
    ];

    return NextResponse.json({
      success: true,
      trackingNumber: order.trackingNumber,
      orderNumber: order.orderNumber,
      status: order.status,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
      },
      service: {
        category: order.service.category,
        name: order.service.nameDe,
      },
      scheduledAt: order.scheduledAt,
      timeSlot: order.timeSlot,
      price: {
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        total: order.totalPrice,
      },
      offer: offer
        ? {
            number: offer.offerNumber,
            status: offer.status,
            token: offer.token,
            pdfUrl: `/api/angebot/${offer.token}/pdf?download=1`,
            pageUrl: `/angebot/${offer.token}`,
          }
        : null,
      contract: contract
        ? {
            number: contract.contractNumber,
            status: contract.status,
            token: contract.token,
            pageUrl: `/vertrag/${contract.token}`,
          }
        : null,
      timeline,
    });
  } catch (error) {
    console.error("GET /api/tracking/[trackingNumber] error:", error);
    return NextResponse.json({ success: false, error: "Interner Serverfehler" }, { status: 500 });
  }
}
