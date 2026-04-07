import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        orderId: true,
        contractId: true,
        invoiceNumber: true,
        amount: true,
        tax: true,
        totalAmount: true,
        pdfUrl: true,
        paidAt: true,
        dueDate: true,
        createdAt: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            service: {
              select: {
                nameDe: true,
              },
            },
          },
        },
        contract: {
          select: {
            id: true,
            contractNumber: true,
            status: true,
            signedAt: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            paidAt: true,
            reference: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("GET /api/admin/rechnungen error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId ist erforderlich" }, { status: 400 });
    };

const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
    }

    const year = new Date().getFullYear();
    const lastInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: `R-${year}-` } },
      orderBy: { invoiceNumber: "desc" },
    });

    let seq = 1;
    if (lastInvoice) {
      const lastSeq = parseInt(lastInvoice.invoiceNumber.split("-").pop() || "0", 10);
      seq = lastSeq + 1;
    }
    const invoiceNumber = `R-${year}-${String(seq).padStart(4, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        orderId,
        invoiceNumber,
        amount: order.netto,
        tax: order.mwst,
        totalAmount: order.totalPrice,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      include: { order: { include: { customer: true } }, contract: true, payments: true },
    });

    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.totalAmount,
        method: order.paymentMethod === "UEBERWEISUNG" || order.paymentMethod === "RECHNUNG" ? "BANK_TRANSFER" : order.paymentMethod,
        status: "OPEN",
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/rechnungen error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
