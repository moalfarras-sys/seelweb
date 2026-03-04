import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();
    const { code, nameDe, descDe, timeAddMin, extraFee, appliesToCategories, serviceId, pricingType, value, unit } = body;

    if (!code || !nameDe || timeAddMin === undefined) {
      return NextResponse.json(
        { error: "Pflichtfelder: code, nameDe, timeAddMin" },
        { status: 400 },
      );
    }

    const extra = await prisma.extra.create({
      data: {
        code,
        nameDe,
        descDe: descDe ?? null,
        timeAddMin,
        extraFee: extraFee ?? 0,
        appliesToCategories: appliesToCategories ?? [],
        serviceId: serviceId ?? null,
        pricingType: pricingType ?? "flat",
        value: value ?? 0,
        unit: unit ?? null,
      },
    });

    return NextResponse.json(extra, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/extras error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
