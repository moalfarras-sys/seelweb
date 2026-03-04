import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const customer = searchParams.get("customer");
    const dateFrom = searchParams.get("from");
    const dateTo = searchParams.get("to");

    const offers = await prisma.offer.findMany({
      where: {
        ...(status && status !== "ALLE" ? { status: status as never } : {}),
        ...(customer
          ? {
              customer: {
                OR: [
                  { name: { contains: customer, mode: "insensitive" } },
                  { email: { contains: customer, mode: "insensitive" } },
                ],
              },
            } : {}),
        ...(dateFrom || dateTo
          ? {
              createdAt: {
                ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
                ...(dateTo ? { lte: new Date(dateTo) } : {}),
              },
            } : {}),
      },
      include: {
        customer: true,
        order: { include: { service: true } },
        items: true,
        contracts: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("GET /api/admin/angebote error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
