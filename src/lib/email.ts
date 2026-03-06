import nodemailer from "nodemailer";
import { CONTACT } from "@/config/contact";

const port = Number(process.env.SMTP_PORT) || 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465 || process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

if (process.env.NODE_ENV !== "production") {
  transporter
    .verify()
    .then(() => {
      console.info("[email] SMTP transport verified successfully");
    }).catch((err: Error) => {
      console.error("[email] SMTP transport verification failed:", err.message);
    });
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
};

function stripHtmlToPlainText(html: string): string {
  const decoded = decodeHtmlEntities(html);
  return decoded
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, "  ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&copy;/gi, "\u00A9")
    .replace(/&euro;/gi, "\u20AC")
    .replace(/&uuml;/gi, "\u00FC")
    .replace(/&ouml;/gi, "\u00F6")
    .replace(/&auml;/gi, "\u00E4")
    .replace(/&Uuml;/gi, "\u00DC")
    .replace(/&Ouml;/gi, "\u00D6")
    .replace(/&Auml;/gi, "\u00C4")
    .replace(/&szlig;/gi, "\u00DF")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: nodemailer.SendMailOptions["attachments"];
  cc?: string | string[];
  bcc?: string | string[];
  requestId?: string;
  throwOnFailure?: boolean;
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function normalizeRecipients(value?: string | string[]) {
  if (!value) return undefined;
  const items = (Array.isArray(value) ? value : [value])
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);
  return items.length > 0 ? Array.from(new Set(items)) : undefined;
}

export function getInternalNotificationBcc(primaryRecipients: string | string[]) {
  const fallback = process.env.SMTP_USER || CONTACT.EMAIL;
  const primary = new Set((normalizeRecipients(primaryRecipients) || []).map((entry) => entry.toLowerCase()));
  return fallback && !primary.has(fallback.toLowerCase()) ? [fallback] : undefined;
}

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
  cc,
  bcc,
  requestId,
  throwOnFailure = true,
}: EmailOptions) {
  const rid = requestId || crypto.randomUUID().slice(0, 8);
  const hasAttachments = Array.isArray(attachments) && attachments.length > 0;
  const ccRecipients = normalizeRecipients(cc);
  const bccRecipients = normalizeRecipients(bcc);

  const safeAttachments = hasAttachments
    ? attachments!.map((att) => {
      const a = att as { content?: unknown; contentType?: string; filename?: string };
      return {
        ...a,
        content: Buffer.isBuffer(a.content) ? a.content : Buffer.from(a.content as Uint8Array),
        contentType: a.contentType || "application/pdf",
      };
    })
    : undefined;

  const fromAddress = process.env.SMTP_USER || CONTACT.EMAIL;

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: `"Seel Transport & Reinigung" <${fromAddress}>`,
        replyTo: CONTACT.EMAIL,
        to,
        cc: ccRecipients,
        bcc: bccRecipients,
        subject,
        html,
        text: stripHtmlToPlainText(html),
        attachments: safeAttachments,
      });

      console.info(`[email:${rid}] sent`, {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        pdfAttached: hasAttachments,
        cc: ccRecipients,
        bcc: bccRecipients,
        attempt,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error;
      console.warn(`[email:${rid}] attempt ${attempt + 1} failed`, {
        to,
        subject,
        error: (error as Error).message,
      });
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  console.error(`[email:${rid}] all retries exhausted`, {
    to,
    subject,
    pdfAttached: hasAttachments,
    cc: ccRecipients,
    bcc: bccRecipients,
    error: (lastError as Error)?.message,
  });

  if (throwOnFailure) {
    throw new Error(`E-Mail-Versand fehlgeschlagen: ${(lastError as Error)?.message || "Unbekannter SMTP-Fehler"}`);
  }

  return { success: false, error: lastError };
}
