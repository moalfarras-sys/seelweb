import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const data = await prisma.priceRule.findMany({ include: { service: true, region: true }, orderBy: [{ priority: "asc" }] });
  return NextResponse.json(data);
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const body = await req.json();
  const created = await prisma.priceRule.create({
    data: {
      serviceId: body.serviceId,
      regionId: body.regionId,
      baseFee: Number(body.baseFee || 0),
      unitType: body.unitType,
      unitPrice: Number(body.unitPrice || 0),
      minUnits: Number(body.minUnits || 0),
      enabled: body.enabled ?? true,
      priority: Number(body.priority || 100),
    },
  });
  return NextResponse.json(created, { status: 201 });
}