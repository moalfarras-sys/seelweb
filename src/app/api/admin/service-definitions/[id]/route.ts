import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.serviceDefinition.update({
    where: { id },
    data: {
      slug: body.slug,
      nameDe: body.nameDe,
      type: body.type,
      enabled: body.enabled,
      bookingFlowJson: body.bookingFlowJson,
    },
  });
  return NextResponse.json(updated);
};

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const { id } = await params;
  await prisma.serviceDefinition.delete({ where: { id } });
  return NextResponse.json({ success: true });
}