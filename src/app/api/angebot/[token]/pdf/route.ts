import { NextRequest, NextResponse } from "next/server";
import { buildOfferPdf, readOfferToken } from "@/lib/fallback-booking";

type Params = { params: Promise<{ token: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { token } = await params;
  const payload = readOfferToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
  }

  const pdf = buildOfferPdf(payload);
  const download = req.nextUrl.searchParams.get("download") === "1";

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Angebot-${payload.offerNumber}.pdf"`,
    },
  });
}
