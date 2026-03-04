import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ token: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { token } = await params;

    const contract = await prisma.contract.findUnique({
      where: { token },
      include: {
        customer: true,
        offer: {
          include: {
            items: { orderBy: { position: "asc" } },
            order: { include: { service: true } },
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Vertrag nicht gefunden" },
        { status: 404 }
      );
    }

    if (contract.status === "SIGNED" || contract.status === "LOCKED") {
      return NextResponse.json(
        {
          alreadySigned: true,
          signedAt: contract.signedAt,
          signedByName: contract.signedByName,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      id: contract.id,
      contractNumber: contract.contractNumber,
      offerNumber: contract.offer.offerNumber,
      offerToken: contract.offer.token,
      title: `Vertrag zu Angebot ${contract.offer.offerNumber}`,
      description: `Finaler Dienstleistungsvertrag fuer ${contract.offer.order.service.nameDe}`,
      category: contract.offer.order.service.category,
      pricePerMonth: null,
      pricePerM2: null,
      areaM2: contract.offer.order.areaM2,
      startDate: contract.createdAt,
      endDate: null,
      invoiceSchedule: "ONCE",
      status: contract.status,
      termsVersion: contract.termsVersion,
      pricing: {
        netto: contract.finalNetto,
        mwst: contract.finalMwst,
        total: contract.finalTotalPrice,
      },
      offerItems: contract.offer.items,
      customer: {
        name: contract.customer.name,
        email: contract.customer.email,
        company: contract.customer.company,
      },
    });
  } catch (error) {
    console.error("GET /api/vertrag/[token] error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
