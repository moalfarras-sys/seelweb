import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.priceRule.update({
    where: { id },
    data: {
      baseFee: Number(body.baseFee),
      unitType: body.unitType,
      unitPrice: Number(body.unitPrice),
      minUnits: Number(body.minUnits),
      enabled: Boolean(body.enabled),
      priority: Number(body.priority),
    },
  });
  return NextResponse.json(updated);
};

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const { id } = await params;
  await prisma.priceRule.delete({ where: { id } });
  return NextResponse.json({ success: true });
}