import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const data = await prisma.serviceDefinition.findMany({ include: { service: true }, orderBy: { slug: "asc" } });
  return NextResponse.json(data);
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const body = await req.json();
  const created = await prisma.serviceDefinition.create({
    data: {
      serviceId: body.serviceId,
      slug: body.slug,
      nameDe: body.nameDe,
      type: body.type,
      enabled: body.enabled ?? true,
      bookingFlowJson: body.bookingFlowJson || {},
    },
  });
  return NextResponse.json(created, { status: 201 });
}