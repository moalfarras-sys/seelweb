import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    if (!fromStr || !toStr) {
      return NextResponse.json(
        { error: "Query-Parameter 'from' und 'to' sind erforderlich (YYYY-MM-DD)" },
        { status: 400 },
      );
    }

    const from = new Date(fromStr);
    const to = new Date(toStr);
    to.setHours(23, 59, 59, 999);

    const [paidInvoices, expenses, orders] = await Promise.all([
      prisma.invoice.findMany({
        where: { paidAt: { gte: from, lte: to } },
        select: { totalAmount: true, paidAt: true, tax: true, amount: true },
      }),
      prisma.manualExpense.findMany({
        where: { date: { gte: from, lte: to } },
        select: { amount: true, date: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
        select: { createdAt: true },
      }),
    ]);

    const monthlyMap = new Map<string, { revenue: number; expenses: number; orders: number }>();

    const ensureMonth = (d: Date) => {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyMap.has(key)) monthlyMap.set(key, { revenue: 0, expenses: 0, orders: 0 });
      return key;
    };

    for (const inv of paidInvoices) {
      if (!inv.paidAt) continue;
      const key = ensureMonth(inv.paidAt);
      monthlyMap.get(key)!.revenue += inv.totalAmount;
    }

    for (const exp of expenses) {
      const key = ensureMonth(exp.date);
      monthlyMap.get(key)!.expenses += exp.amount;
    }

    for (const ord of orders) {
      const key = ensureMonth(ord.createdAt);
      monthlyMap.get(key)!.orders += 1;
    }

    const totalRevenue = paidInvoices.reduce((s, i) => s + i.totalAmount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalVat = paidInvoices.reduce((s, i) => s + i.tax, 0);

    const quarterlyMap = new Map<string, { revenue: number; vat: number; expenses: number }>();
    const ensureQuarter = (d: Date) => {
      const quarter = Math.floor(d.getMonth() / 3) + 1;
      const key = `${d.getFullYear()}-Q${quarter}`;
      if (!quarterlyMap.has(key)) quarterlyMap.set(key, { revenue: 0, vat: 0, expenses: 0 });
      return key;
    };

    for (const inv of paidInvoices) {
      if (!inv.paidAt) continue;
      const key = ensureQuarter(inv.paidAt);
      const row = quarterlyMap.get(key)!;
      row.revenue += inv.totalAmount;
      row.vat += inv.tax;
    }
    for (const exp of expenses) {
      const key = ensureQuarter(exp.date);
      quarterlyMap.get(key)!.expenses += exp.amount;
    }

    const monthly = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    const quarterly = Array.from(quarterlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([quarter, data]) => ({
        quarter,
        ...data,
        profit: data.revenue - data.expenses,
      }));

    return NextResponse.json({
      from: fromStr,
      to: toStr,
      totalRevenue,
      totalVat,
      totalExpenses,
      profit: totalRevenue - totalExpenses,
      totalOrders: orders.length,
      monthly,
      quarterly,
    });
  } catch (error) {
    console.error("GET /api/admin/buchhaltung/bericht error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
