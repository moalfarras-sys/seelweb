import { NextRequest, NextResponse } from "next/server";
import { CONTACT } from "@/config/contact";
import { buildContractPdf, readContractToken, setSignedState } from "@/lib/fallback-booking";
import { sendEmail } from "@/lib/email";

type Params = { params: Promise<{ token: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params;
  const payload = readContractToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Vertrag nicht gefunden" }, { status: 404 });
  }

  const body = await req.json();
  const signedByName = typeof body.name === "string" ? body.name.trim() : "";
  const signatureDataUrl = typeof body.signatureDataUrl === "string" ? body.signatureDataUrl : null;
  if (!signedByName || body.agreed !== true) {
    return NextResponse.json({ error: "Name und Zustimmung sind erforderlich" }, { status: 400 });
  }

  const signedAt = new Date().toISOString();
  const pdf = await buildContractPdf(payload, { signedAt: new Date(signedAt).toLocaleString("de-DE"), signedByName, signatureDataUrl });
  setSignedState(token, { signedAt, signedByName, signedPdfBase64: Buffer.from(pdf).toString("base64") });

  await sendEmail({
    to: payload.customerEmail,
    subject: `Vertrag ${payload.contractNumber} bestätigt - SEEL Transport`,
    html: `
      <h2>Vertrag erfolgreich unterschrieben</h2>
      <p>Vielen Dank, ${payload.customerName}. Ihr Vertrag <strong>${payload.contractNumber}</strong> wurde digital bestätigt.</p>
      <p>Leistung: ${payload.serviceSummary}</p>
    `,
    attachments: [{ filename: `Vertrag-${payload.contractNumber}.pdf`, content: pdf, contentType: "application/pdf" }],
    throwOnFailure: false,
  });

  await sendEmail({
    to: CONTACT.EMAIL,
    subject: `Vertrag ${payload.contractNumber} unterschrieben`,
    html: `<p>Der Vertrag ${payload.contractNumber} wurde von ${signedByName} unterschrieben.</p>`,
    attachments: [{ filename: `Vertrag-${payload.contractNumber}.pdf`, content: pdf, contentType: "application/pdf" }],
    throwOnFailure: false,
  });

  return NextResponse.json({ success: true, emailDelivered: true });
}
