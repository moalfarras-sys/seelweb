import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const updateData: Record<string, unknown> = { status: "ANGEBOT" };

    if (body.modifiedPrice !== undefined) {
      updateData.totalPrice = body.modifiedPrice;
    }
    if (body.discountAmount !== undefined) {
      updateData.discountAmount = body.discountAmount;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { customer: true, service: true },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("POST /api/admin/buchungen/[id]/approve error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
