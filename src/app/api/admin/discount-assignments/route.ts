import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const data = await prisma.discountAssignment.findMany({
    include: { discount: true, customer: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const body = await req.json();
  const discountCode = String(body.discountCode || "").trim().toUpperCase();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const customerId = body.customerId ? String(body.customerId) : null;
  const note = body.note ? String(body.note) : null;

  if (!discountCode) {
    return NextResponse.json({ error: "discountCode ist erforderlich" }, { status: 400 });
  }
  if (!email && !phone && !customerId) {
    return NextResponse.json({ error: "email, phone oder customerId erforderlich" }, { status: 400 });
  }

  const discount = await prisma.discount.findUnique({ where: { code: discountCode } });
  if (!discount) {
    return NextResponse.json({ error: "Rabattcode nicht gefunden" }, { status: 404 });
  }

  const created = await prisma.discountAssignment.create({
    data: {
      discountId: discount.id,
      customerId,
      email: email || null,
      phone: phone || null,
      note,
    },
    include: { discount: true, customer: true },
  });

  return NextResponse.json(created, { status: 201 });
}
