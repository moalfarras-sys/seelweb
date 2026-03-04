import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const data = await prisma.serviceArea.findMany({ orderBy: { regionName: "asc" } });
  return NextResponse.json(data);
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  const body = await req.json();
  const created = await prisma.serviceArea.create({
    data: {
      regionName: body.regionName,
      postalConfigJson: body.postalConfigJson || { explicit: [], ranges: [] },
      enabled: body.enabled ?? true,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
