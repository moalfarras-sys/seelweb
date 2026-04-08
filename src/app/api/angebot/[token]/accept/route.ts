import { NextRequest, NextResponse } from "next/server";
import { createContractToken, readOfferToken } from "@/lib/fallback-booking";

type Params = { params: Promise<{ token: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const payload = readOfferToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
  }

  const contractToken = createContractToken({
    ...payload,
    offerToken: token,
  });

  return NextResponse.json({ success: true, contractToken });
}
