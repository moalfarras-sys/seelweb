import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createOfferVersion } from "@/lib/workflow";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        customer: true,
        order: { include: { fromAddress: true, toAddress: true, service: true } },
        items: { orderBy: { position: "asc" } },
        versions: { orderBy: { versionNo: "desc" }, take: 10 },
        contracts: true,
        communications: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }
    return NextResponse.json(offer);
  } catch (error) {
    console.error("GET /api/admin/angebote/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
};

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    };

const incomingItems = Array.isArray(body.items) ? body.items : null;
    if (incomingItems) {
      await prisma.offerItem.deleteMany({ where: { offerId: id } });
      await prisma.offerItem.createMany({
        data: incomingItems.map((item: Record<string, unknown>, idx: number) => {
          const quantity = Number(item.quantity || 0);
          const unitPrice = Number(item.unitPrice || 0);
          const totalPrice =
            item.totalPrice !== undefined ? Number(item.totalPrice) : Number((quantity * unitPrice).toFixed(2));
          return {
            offerId: id,
            position: Number(item.position || idx + 1),
            type: String(item.type || "CUSTOM"),
            title: String(item.title || "Position"),
            description: item.description ? String(item.description) : null,
            quantity,
            unitPrice,
            totalPrice,
            metaJson: item.metaJson && typeof item.metaJson === "object" ? (item.metaJson as object) : undefined,
          };
        }),
      });
    }

    const freshItems = await prisma.offerItem.findMany({
      where: { offerId: id },
      orderBy: { position: "asc" },
    });

    const subtotal = freshItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = body.discountAmount !== undefined ? Number(body.discountAmount) : offer.discountAmount;
    const extraFees = body.extraFees !== undefined ? Number(body.extraFees) : offer.extraFees;
    const netto = Number((subtotal - discountAmount + extraFees).toFixed(2));
    const mwst = Number((netto * 0.19).toFixed(2));
    const totalPrice = Number((netto + mwst).toFixed(2));

    const updated = await prisma.offer.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title : String(body.title || "") } : {}),
        ...(body.introText !== undefined ? { introText : String(body.introText || "") } : {}),
        ...(body.validUntil ? { validUntil : new Date(body.validUntil) } : {}),
        subtotal,
        discountAmount,
        extraFees,
        netto,
        mwst,
        totalPrice,
        status: "MODIFIED",
        order: {
          update: {
            subtotal,
            discountAmount,
            netto,
            mwst,
            totalPrice,
          },
        },
      },
      include: {
        customer: true,
        order: true,
        items: { orderBy: { position: "asc" } },
      },
    });

    await createOfferVersion(id, session.email || "admin", {
      items: updated.items,
      subtotal,
      discountAmount,
      extraFees,
      netto,
      mwst,
      totalPrice,
      changedAt: new Date().toISOString(),
    });

    await prisma.communication.create({
      data: {
        customerId: updated.customerId,
        offerId: updated.id,
        channel: "INTERNAL_NOTE",
        direction: "INTERNAL",
        subject: "Angebot angepasst",
        message: `Angebot ${updated.offerNumber} wurde angepasst.`,
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/angebote/[id] error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
