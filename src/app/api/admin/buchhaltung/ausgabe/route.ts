import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const expenses = await prisma.manualExpense.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/admin/buchhaltung/ausgabe error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await req.json();
    const { category, description, amount, date } = body;

    if (!category || !description || amount === undefined || !date) {
      return NextResponse.json(
        { error: "Pflichtfelder: category, description, amount, date" },
        { status: 400 },
      );
    }

    const expense = await prisma.manualExpense.create({
      data: {
        category,
        description,
        amount,
        date: new Date(date),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/buchhaltung/ausgabe error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
