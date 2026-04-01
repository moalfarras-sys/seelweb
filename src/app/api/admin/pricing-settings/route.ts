import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { DEFAULT_PRICING_SETTINGS } from "@/lib/pricing/settings";
import { PUBLIC_PRICING_REVALIDATE_PATHS } from "@/lib/public-service-pricing";

async function requireAdmin() {
  const session = await getSession();
  return Boolean(session.isLoggedIn);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const settings = await prisma.pricingSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", ...DEFAULT_PRICING_SETTINGS },
  });

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const body = await req.json();
  const updated = await prisma.pricingSettings.upsert({
    where: { id: "default" },
    update: {
      kmPriceEur: Number(body.kmPriceEur ?? DEFAULT_PRICING_SETTINGS.kmPriceEur),
      roundTripMultiplier: Number(body.roundTripMultiplier ?? DEFAULT_PRICING_SETTINGS.roundTripMultiplier),
      minimumFeeEur: Number(body.minimumFeeEur ?? DEFAULT_PRICING_SETTINGS.minimumFeeEur),
      vatEnabled: Boolean(body.vatEnabled ?? DEFAULT_PRICING_SETTINGS.vatEnabled),
      estimateLabelEnabled: Boolean(body.estimateLabelEnabled ?? DEFAULT_PRICING_SETTINGS.estimateLabelEnabled),
      baseMovingEur: Number(body.baseMovingEur ?? 0),
      baseDisposalEur: Number(body.baseDisposalEur ?? 0),
      baseHomeCleaningEur: Number(body.baseHomeCleaningEur ?? 0),
      baseMoveOutCleaningEur: Number(body.baseMoveOutCleaningEur ?? 0),
      baseOfficeCleaningEur: Number(body.baseOfficeCleaningEur ?? 0),
      publicMovingStandardEur: Number(body.publicMovingStandardEur ?? DEFAULT_PRICING_SETTINGS.publicMovingStandardEur),
      publicMovingExpressEur: Number(body.publicMovingExpressEur ?? DEFAULT_PRICING_SETTINGS.publicMovingExpressEur),
      publicMovingExpressSurchargePct: Number(body.publicMovingExpressSurchargePct ?? DEFAULT_PRICING_SETTINGS.publicMovingExpressSurchargePct),
      publicHomeCleaningEur: Number(body.publicHomeCleaningEur ?? DEFAULT_PRICING_SETTINGS.publicHomeCleaningEur),
      publicOfficeMovingEur: Number(body.publicOfficeMovingEur ?? DEFAULT_PRICING_SETTINGS.publicOfficeMovingEur),
      publicOfficeCleaningEur: Number(body.publicOfficeCleaningEur ?? DEFAULT_PRICING_SETTINGS.publicOfficeCleaningEur),
      publicDisposalEur: Number(body.publicDisposalEur ?? DEFAULT_PRICING_SETTINGS.publicDisposalEur),
      publicMoveOutCleaningEur: Number(body.publicMoveOutCleaningEur ?? DEFAULT_PRICING_SETTINGS.publicMoveOutCleaningEur),
    },
    create: {
      id: "default",
      kmPriceEur: Number(body.kmPriceEur ?? DEFAULT_PRICING_SETTINGS.kmPriceEur),
      roundTripMultiplier: Number(body.roundTripMultiplier ?? DEFAULT_PRICING_SETTINGS.roundTripMultiplier),
      minimumFeeEur: Number(body.minimumFeeEur ?? DEFAULT_PRICING_SETTINGS.minimumFeeEur),
      vatEnabled: Boolean(body.vatEnabled ?? DEFAULT_PRICING_SETTINGS.vatEnabled),
      estimateLabelEnabled: Boolean(body.estimateLabelEnabled ?? DEFAULT_PRICING_SETTINGS.estimateLabelEnabled),
      baseMovingEur: Number(body.baseMovingEur ?? 0),
      baseDisposalEur: Number(body.baseDisposalEur ?? 0),
      baseHomeCleaningEur: Number(body.baseHomeCleaningEur ?? 0),
      baseMoveOutCleaningEur: Number(body.baseMoveOutCleaningEur ?? 0),
      baseOfficeCleaningEur: Number(body.baseOfficeCleaningEur ?? 0),
      publicMovingStandardEur: Number(body.publicMovingStandardEur ?? DEFAULT_PRICING_SETTINGS.publicMovingStandardEur),
      publicMovingExpressEur: Number(body.publicMovingExpressEur ?? DEFAULT_PRICING_SETTINGS.publicMovingExpressEur),
      publicMovingExpressSurchargePct: Number(body.publicMovingExpressSurchargePct ?? DEFAULT_PRICING_SETTINGS.publicMovingExpressSurchargePct),
      publicHomeCleaningEur: Number(body.publicHomeCleaningEur ?? DEFAULT_PRICING_SETTINGS.publicHomeCleaningEur),
      publicOfficeMovingEur: Number(body.publicOfficeMovingEur ?? DEFAULT_PRICING_SETTINGS.publicOfficeMovingEur),
      publicOfficeCleaningEur: Number(body.publicOfficeCleaningEur ?? DEFAULT_PRICING_SETTINGS.publicOfficeCleaningEur),
      publicDisposalEur: Number(body.publicDisposalEur ?? DEFAULT_PRICING_SETTINGS.publicDisposalEur),
      publicMoveOutCleaningEur: Number(body.publicMoveOutCleaningEur ?? DEFAULT_PRICING_SETTINGS.publicMoveOutCleaningEur),
    },
  });

  revalidatePath("/", "layout");
  for (const path of PUBLIC_PRICING_REVALIDATE_PATHS) {
    revalidatePath(path);
  }

  return NextResponse.json(updated);
}
