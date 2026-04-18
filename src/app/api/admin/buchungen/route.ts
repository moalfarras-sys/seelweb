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
    const view = request.nextUrl.searchParams.get("view") ?? "full";
    const where = showDeleted ? {} : { deletedAt: null };

    if (view === "dashboard") {
      const orders = await prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalPrice: true,
          scheduledAt: true,
          createdAt: true,
          customer: { select: { id: true, name: true } },
          service: { select: { nameDe: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(orders);
    }

    if (view === "invoice-create") {
      const orders = await prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          totalPrice: true,
          customer: { select: { name: true } },
          service: { select: { nameDe: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(orders);
    }

    if (view === "documents") {
      const orders = await prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          scheduledAt: true,
          timeSlot: true,
          totalPrice: true,
          distanceKm: true,
          breakdownJson: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              company: true,
            },
          },
          service: { select: { nameDe: true } },
          fromAddress: {
            select: {
              street: true,
              houseNumber: true,
              zip: true,
              city: true,
            },
          },
          toAddress: {
            select: {
              street: true,
              houseNumber: true,
              zip: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(orders);
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        scheduledAt: true,
        timeSlot: true,
        notes: true,
        deletedAt: true,
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            nameDe: true,
            category: true,
          },
        },
        offer: {
          select: {
            id: true,
            offerNumber: true,
            token: true,
            status: true,
            totalPrice: true,
            contracts: {
              select: {
                id: true,
                token: true,
                status: true,
                contractNumber: true,
                signedAt: true,
              },
            },
          },
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            contractId: true,
            totalAmount: true,
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
                invoices: order.invoices.filter((invoice) =>
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
