import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      "hourlyRate", "minimumHours", "weekendMultiplier",
      "holidayMultiplier", "isActive", "zone", "validFrom", "validTo",
    ];
    const data: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    if (data.validFrom && typeof data.validFrom === "string") {
      data.validFrom = new Date(data.validFrom as string);
    }
    if (data.validTo && typeof data.validTo === "string") {
      data.validTo = new Date(data.validTo as string);
    }

    const pricing = await prisma.servicePricing.update({
      where: { id },
      data,
      include: { service: true },
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error("PUT /api/admin/preise/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
