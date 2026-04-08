import { NextRequest, NextResponse } from "next/server";
import { readOfferToken, toOfferResponse } from "@/lib/fallback-booking";

type Params = { params: Promise<{ token: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const payload = readOfferToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json(toOfferResponse(payload));
}
