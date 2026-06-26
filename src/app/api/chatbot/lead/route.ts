import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { CONTACT } from "@/config/contact";

export const runtime = "nodejs";

function clean(value: unknown, max = 100): string {
  return String(value || "").trim().slice(0, max);
}

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

    const name = clean(body?.name, 100);
    const phone = clean(body?.phone, 40);
    const email = clean(body?.email, 120);
    const service = clean(body?.service, 120);
    const date = clean(body?.date, 80);

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name und Telefonnummer sind erforderlich." },
        { status: 400 }
      );
    }

    console.log("[SEEL CHATBOT LEAD]", {
      name,
      phone,
      email,
      service,
      date,
      source: "chatbot",
      receivedAt: new Date().toISOString(),
    });

    try {
      const adminHtml = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f6f8;padding:24px;margin:0;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="background:#0f3460;padding:18px;text-align:center;color:#fff;font-weight:700;">Neue Chatbot-Anfrage</div>
    <div style="padding:20px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;width:100px;">Name</td><td style="padding:8px 0;color:#0f2550;font-weight:600;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Telefon</td><td style="padding:8px 0;"><a href="tel:${encodeURIComponent(phone)}" style="color:#0d9ea0;">${escapeHtml(phone)}</a></td></tr>
        ${email && email !== "keine" ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">E-Mail</td><td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(email)}" style="color:#0d9ea0;">${escapeHtml(email)}</a></td></tr>` : ""}
        ${service ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Leistung</td><td style="padding:8px 0;color:#0f2550;">${escapeHtml(service)}</td></tr>` : ""}
        ${date ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Wunschdatum</td><td style="padding:8px 0;color:#0f2550;">${escapeHtml(date)}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;">Quelle</td><td style="padding:8px 0;color:#0f3460;font-weight:600;">Chatbot-Widget</td></tr>
      </table>
      <div style="margin-top:16px;padding:12px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
        <p style="margin:0;color:#166534;font-size:13px;">💡 Diese Anfrage wurde automatisch über das Chatbot-Widget generiert.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

      await sendEmail({
        to: CONTACT.EMAIL,
        subject: `Chatbot-Anfrage: ${service || "Allgemein"} – ${name}`,
        html: adminHtml,
        throwOnFailure: false,
      });
    } catch (emailError) {
      console.error("[SEEL CHATBOT LEAD] email notification failed:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}