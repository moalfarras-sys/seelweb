import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { paidAt: new Date() },
      include: { order: { include: { customer: true } }, contract: true, payments: true },
    });

    if (invoice.payments.length > 0) {
      await prisma.payment.updateMany({
        where: { invoiceId: invoice.id },
        data: { status: "PAID", paidAt: new Date() },
      });
    } else {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: invoice.totalAmount,
          method: "BANK_TRANSFER",
          status: "PAID",
          paidAt: new Date(),
        },
      });
    }

    await prisma.order.update({
      where: { id: invoice.orderId },
      data: { paymentStatus: "BEZAHLT" },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("PATCH /api/admin/rechnungen/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
