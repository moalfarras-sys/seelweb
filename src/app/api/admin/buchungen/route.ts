import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const showDeleted = request.nextUrl.searchParams.get("showDeleted") === "true";

    const orders = await prisma.order.findMany({
      where: showDeleted ? {} : { deletedAt: null },
      include: {
        customer: true,
        service: true,
        fromAddress: true,
        toAddress: true,
        offer: {
          include: {
            contracts: true,
          },
        },
        invoices: {
          include: {
            contract: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const payload = orders.map((order) => {
      const offer = order.offer;
      const offerContracts = offer
        ? offer.contracts.map((contract) => ({
            id: contract.id,
            token: contract.token,
            status: contract.status,
            contractNumber: contract.contractNumber,
            signedAt: contract.signedAt,
          }))
        : [];

      const offerInvoiceIds = new Set(
        offerContracts.map((contract) => contract.id)
      );

      const invoiceItems = order.invoices.map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        contractId: invoice.contractId,
        totalAmount: invoice.totalAmount,
      }));

      return {
        ...order,
        isDeleted: Boolean(order.deletedAt),
        offers: offer
          ? [
              {
                id: offer.id,
                offerNumber: offer.offerNumber,
                token: offer.token,
                status: offer.status,
                totalPrice: offer.totalPrice,
                contracts: offerContracts,
                invoices: invoiceItems.filter((invoice) =>
                  invoice.contractId ? offerInvoiceIds.has(invoice.contractId) : true
                ),
              },
            ]
          : [],
      };
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/admin/buchungen error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
