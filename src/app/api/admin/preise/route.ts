import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const [pricing, extras, discounts, discountAssignments, priceRules, surcharges, serviceAreas, serviceDefinitions] = await Promise.all([
      prisma.servicePricing.findMany({
        include: { service: true },
        orderBy: { service: { sortOrder: "asc" } },
      }),
      prisma.extra.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.discount.findMany({ orderBy: { validFrom: "desc" } }),
      prisma.discountAssignment.findMany({ include: { discount: true, customer: true }, orderBy: { createdAt: "desc" } }),
      prisma.priceRule.findMany({ include: { service: true, region: true }, orderBy: [{ priority: "asc" }] }),
      prisma.surcharge.findMany({ include: { service: true }, orderBy: [{ priority: "asc" }] }),
      prisma.serviceArea.findMany({ orderBy: { regionName: "asc" } }),
      prisma.serviceDefinition.findMany({ include: { service: true }, orderBy: { slug: "asc" } }),
    ]);

    return NextResponse.json({ pricing, extras, discounts, discountAssignments, priceRules, surcharges, serviceAreas, serviceDefinitions });
  } catch (error) {
    console.error("GET /api/admin/preise error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
