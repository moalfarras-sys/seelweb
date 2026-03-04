import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const data = await prisma.surcharge.findMany({ include: { service: true }, orderBy: [{ priority: "asc" }] });
  return NextResponse.json(data);
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const body = await req.json();
  const created = await prisma.surcharge.create({
    data: {
      serviceId: body.serviceId,
      nameDe: body.nameDe,
      triggerJson: body.triggerJson || {},
      formulaJson: body.formulaJson || {},
      enabled: body.enabled ?? true,
      priority: Number(body.priority || 100),
    },
  });
  return NextResponse.json(created, { status: 201 });
}