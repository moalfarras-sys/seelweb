import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { CONTACT } from "@/config/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      subject,
      message,
      website,
      utm_source,
      utm_medium,
      utm_campaign,
      referrer,
      landing_page,
    } = body;

    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true, message: "Nachricht erhalten und versendet" });
    }

    const nameStr = typeof name === "string" ? name.trim() : "";
    const emailStr = typeof email === "string" ? email.trim() : "";
    const phoneStr = typeof phone === "string" ? phone.trim() : "";
    const subjectStr = typeof subject === "string" ? subject.trim() : "";
    const messageStr = typeof message === "string" ? message.trim() : "";

    if (!nameStr || !emailStr || !subjectStr || !messageStr) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(emailStr)) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const trackingLines: { label: string; value: string }[] = [];
    const pushIf = (label: string, v: unknown) => {
      if (typeof v === "string" && v.trim() !== "") trackingLines.push({ label, value: v.trim() });
    };
    pushIf("utm_source", utm_source);
    pushIf("utm_medium", utm_medium);
    pushIf("utm_campaign", utm_campaign);
    pushIf("referrer", referrer);
    pushIf("landing_page", landing_page);

    const trackingBlock =
      trackingLines.length > 0
        ? `<div style="margin-top:16px;padding:14px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
            <p style="margin:0 0 8px;color:#166534;font-size:12px;font-weight:600;">Tracking / Herkunft</p>
            <table style="width:100%;border-collapse:collapse;">
              ${trackingLines
                .map(
                  (row) =>
                    `<tr><td style="padding:4px 0;color:#64748b;font-size:12px;vertical-align:top;width:120px;">${escapeHtml(row.label)}</td><td style="padding:4px 0;color:#0f2550;font-size:12px;">${escapeHtml(row.value)}</td></tr>`,
                )
                .join("")}
            </table>
          </div>`
        : "";

    if (trackingLines.length > 0) {
      console.info("[kontakt] tracking:", Object.fromEntries(trackingLines.map((r) => [r.label, r.value])));
    }

    const adminHtml = `<!DOCTYPE html>
    <html lang="de">
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f5f6f8;padding:24px;margin:0;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
        <div style="background:#0f2550;padding:18px;text-align:center;color:#fff;font-weight:700;">Neue Kontaktanfrage</div>
        <div style="padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;width:100px;">Name</td><td style="padding:8px 0;color:#0f2550;font-weight:600;">${escapeHtml(nameStr)}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">E-Mail</td><td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(emailStr)}" style="color:#0d9ea0;">${escapeHtml(emailStr)}</a></td></tr>
            ${phoneStr ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Telefon</td><td style="padding:8px 0;"><a href="tel:${encodeURIComponent(phoneStr)}" style="color:#0d9ea0;">${escapeHtml(phoneStr)}</a></td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Betreff</td><td style="padding:8px 0;color:#0f2550;">${escapeHtml(subjectStr)}</td></tr>
          </table>
          <div style="margin-top:16px;padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #e5e7eb;">
            <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;">Nachricht:</p>
            <p style="margin:0;color:#0f2550;white-space:pre-wrap;line-height:1.6;">${escapeHtml(messageStr)}</p>
          </div>
          ${trackingBlock}
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
          <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">Sehr geehrte/r ${escapeHtml(nameStr)}, wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          <p style="margin:0;color:#6b7280;font-size:13px;">Ihr Team von SEEL Transport & Reinigung</p>
        </div>
      </div>
    </body>
    </html>`;

    await sendEmail({
      to: CONTACT.EMAIL,
      subject: `Kontaktanfrage: ${subjectStr || "Allgemeine Anfrage"} – ${nameStr}`,
      html: adminHtml,
    });

    await sendEmail({
      to: emailStr,
      subject: "Ihre Anfrage bei SEEL Transport & Reinigung",
      html: confirmHtml,
    });

    return NextResponse.json({ success: true, message: "Nachricht erhalten und versendet" });
  } catch (error) {
    console.error("[kontakt] error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
