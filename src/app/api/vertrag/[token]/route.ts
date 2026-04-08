import { NextRequest, NextResponse } from "next/server";
import { getSignedState, readContractToken, toContractResponse } from "@/lib/fallback-booking";

type Params = { params: Promise<{ token: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const payload = readContractToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Vertrag nicht gefunden" }, { status: 404 });
  }

  const signed = getSignedState(token);
  if (signed) {
    return NextResponse.json({
      alreadySigned: true,
      signedAt: signed.signedAt,
      signedByName: signed.signedByName,
    });
  }

  return NextResponse.json(toContractResponse(payload));
}
