import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOfferPDF } from "@/lib/pdf";

type Params = { params: Promise<{ token: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const download = req.nextUrl.searchParams.get("download") === "1";
    const offer = await prisma.offer.findUnique({
      where: { token },
      include: {
        customer: true,
        order: { include: { fromAddress: true, toAddress: true, service: true } },
        items: { orderBy: { position: "asc" } },
      },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    const pdf = generateOfferPDF({
      offerNumber: offer.offerNumber,
      validUntil: offer.validUntil.toLocaleDateString("de-DE"),
      customerName: offer.customer.name,
      customerEmail: offer.customer.email,
      customerPhone: offer.customer.phone,
      customerCompany: offer.customer.company ?? undefined,
      serviceSummary: offer.order.service.nameDe,
      routeDistanceKm: offer.order.distanceKm,
      serviceDate: offer.order.scheduledAt?.toLocaleDateString("de-DE") || null,
      timeSlot: offer.order.timeSlot,
      fromAddress: offer.order.fromAddress?.street || null,
      toAddress: offer.order.toAddress?.street || null,
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
      trackingNumber: offer.order.trackingNumber || undefined,
      statusNote: offer.status === "PENDING" ? "Anfrage eingegangen - wartet auf Bestätigung" : undefined,
      agbText: "Es gelten unsere AGB.",
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename=\"Angebot-${offer.offerNumber}.pdf\"`,
      },
    });
  } catch (error) {
    console.error("GET /api/angebot/[token]/pdf error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
