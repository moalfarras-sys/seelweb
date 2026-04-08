import { NextRequest, NextResponse } from "next/server";
import { buildContractPdf, getSignedState, readContractToken } from "@/lib/fallback-booking";

type Params = { params: Promise<{ token: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { token } = await params;
  const payload = readContractToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Vertrag nicht gefunden" }, { status: 404 });
  }

  const signed = getSignedState(token);
  const pdf = signed?.signedPdfBase64
    ? Buffer.from(signed.signedPdfBase64, "base64")
    : await buildContractPdf(payload, signed ? { signedAt: new Date(signed.signedAt).toLocaleString("de-DE"), signedByName: signed.signedByName } : undefined);
  const download = req.nextUrl.searchParams.get("download") === "1";

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Vertrag-${payload.contractNumber}.pdf"`,
    },
  });
}
