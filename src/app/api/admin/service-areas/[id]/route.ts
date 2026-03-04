import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.serviceArea.update({
    where: { id },
    data: {
      regionName: body.regionName,
      postalConfigJson: body.postalConfigJson,
      enabled: body.enabled,
    },
  });
  return NextResponse.json(updated);
};

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const { id } = await params;
  await prisma.serviceArea.delete({ where: { id } });
  return NextResponse.json({ success: true });
}