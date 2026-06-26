import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ trackingNumber: string }> };

// Best-effort in-memory rate limit (per serverless instance) to slow enumeration.
// For strong protection this should be backed by a shared store (Postgres/Redis).
const HITS = new Map<string, { count: number; ts: number }>();
const RL_WINDOW_MS = 60_000;
const RL_MAX = 20;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = HITS.get(ip);
  if (!cur || now - cur.ts > RL_WINDOW_MS) {
    HITS.set(ip, { count: 1, ts: now });
    return false;
  }
  cur.count += 1;
  return cur.count > RL_MAX;
}

const SECURE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Zu viele Anfragen. Bitte später erneut versuchen." },
        { status: 429, headers: SECURE_HEADERS }
      );
    }

    const { trackingNumber } = await params;
    const normalized = String(trackingNumber || "").trim().toUpperCase();
    if (!normalized) {
      return NextResponse.json({ success: false, error: "Trackingnummer fehlt" }, { status: 400, headers: SECURE_HEADERS });
    }

    const order = await prisma.order.findUnique({
      where: { trackingNumber: normalized },
      include: {
        customer: true,
        service: true,
        offer: { include: { contracts: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Trackingnummer nicht gefunden" }, { status: 404, headers: SECURE_HEADERS });
    }

    const offer = order.offer;
    const contract = offer?.contracts[0] || null;
    const timeline = [
      { key: "ORDER_CREATED", label: "Anfrage eingegangen", at: order.createdAt },
      ...(offer ? [{ key: "OFFER_CREATED", label: "Angebot erstellt", at: offer.createdAt }] : []),
      ...(offer?.approvedAt ? [{ key: "OFFER_APPROVED", label: "Angebot freigegeben", at: offer.approvedAt }] : []),
      ...(offer?.acceptedAt ? [{ key: "OFFER_ACCEPTED", label: "Angebot angenommen", at: offer.acceptedAt }] : []),
      ...(contract?.signedAt ? [{ key: "CONTRACT_SIGNED", label: "Vertrag unterschrieben", at: contract.signedAt }] : []),
    ];

    // Public, enumerable endpoint: expose ONLY non-sensitive status data.
    // No customer e-mail/phone, no price, no offer/contract tokens or links, no internal IDs.
    return NextResponse.json(
      {
        success: true,
        trackingNumber: order.trackingNumber,
        orderNumber: order.orderNumber,
        status: order.status,
        service: { name: order.service.nameDe },
        scheduledAt: order.scheduledAt,
        timeSlot: order.timeSlot,
        offer: offer ? { number: offer.offerNumber, status: offer.status } : null,
        contract: contract ? { number: contract.contractNumber, status: contract.status } : null,
        timeline,
        lastUpdate: order.updatedAt,
      },
      { headers: SECURE_HEADERS }
    );
  } catch (error) {
    console.error("GET /api/tracking/[trackingNumber] error:", error);
    return NextResponse.json({ success: false, error: "Interner Serverfehler" }, { status: 500, headers: SECURE_HEADERS });
  }
}
