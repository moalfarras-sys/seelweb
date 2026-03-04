import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { CONTACT } from "@/config/contact";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const adminHtml = `<!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f5f6f8;padding:24px;margin:0;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
        <div style="background:#0f2550;padding:18px;text-align:center;color:#fff;font-weight:700;">Neue Kontaktanfrage</div>
        <div style="padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;width:100px;">Name</td><td style="padding:8px 0;color:#0f2550;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">E-Mail</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#0d9ea0;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Telefon</td><td style="padding:8px 0;"><a href="tel:${phone}" style="color:#0d9ea0;">${phone}</a></td></tr>` : ""}
            ${subject ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Betreff</td><td style="padding:8px 0;color:#0f2550;">${subject}</td></tr>` : ""}
          </table>
          <div style="margin-top:16px;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e5e7eb;">
            <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;">Nachricht:</p>
            <p style="margin:0;color:#0f2550;white-space:pre-wrap;line-height:1.6;">${message}</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

    const confirmHtml = `<!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f5f6f8;padding:32px;margin:0;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#0f2550;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;">SEEL Transport & Reinigung</h1>
        </div>
        <div style="padding:26px;">
          <h2 style="margin:0 0 12px;color:#0f2550;">Vielen Dank für Ihre Nachricht</h2>
          <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">Sehr geehrte/r ${name}, wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          <p style="margin:0;color:#6b7280;font-size:13px;">Ihr Team von SEEL Transport & Reinigung</p>
        </div>
      </div>
    </body>
    </html>`;

    await sendEmail({
      to: CONTACT.EMAIL,
      subject: `Kontaktanfrage: ${subject || "Allgemeine Anfrage"} – ${name}`,
      html: adminHtml,
    });

    await sendEmail({
      to: email,
      subject: "Ihre Anfrage bei SEEL Transport & Reinigung",
      html: confirmHtml,
    });

    return NextResponse.json({ success: true, message: "Nachricht erhalten und versendet" });
  } catch (error) {
    console.error("[kontakt] error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
