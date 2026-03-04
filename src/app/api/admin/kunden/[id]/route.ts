import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: { include: { service: true }, orderBy: { createdAt: "desc" } } },
    });

    if (!customer) {
      return NextResponse.json({ error: "Kunde nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("GET /api/admin/kunden/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
};

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const orderCount = await prisma.order.count({ where: { customerId: id } });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: `Kunde hat ${orderCount} Buchung(en) und kann nicht gelöscht werden` },
        { status: 409 },
      );
    } await prisma.customer.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/kunden/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
