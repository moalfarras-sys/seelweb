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
    const { code, description, amount, isPercent, validFrom, validTo, codeType, stackable, usageScope } = body;

    if (!code || amount === undefined || !validFrom || !validTo) {
      return NextResponse.json(
        { error: "Pflichtfelder: code, amount, validFrom, validTo" },
        { status: 400 },
      );
    }

    const discount = await prisma.discount.create({
      data: {
        code,
        description: description ?? null,
        amount,
        isPercent: isPercent ?? true,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        codeType: codeType ?? "PROMO",
        stackable: stackable ?? false,
        usageScope: usageScope ?? "GLOBAL",
      },
    });

    return NextResponse.json(discount, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/rabatte error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
