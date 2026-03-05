import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CheckResult {
  name: string;
  ok: boolean;
  message: string;
  durationMs: number;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: "Datenbank", ok: true, message: "Verbindung erfolgreich", durationMs: Date.now() - start };
  } catch (err) {
    return { name: "Datenbank", ok: false, message: (err as Error).message, durationMs: Date.now() - start };
  }
}

async function checkEmail(): Promise<CheckResult> {
  const start = Date.now();
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return { name: "E-Mail (SMTP)", ok: false, message: "SMTP-Konfiguration unvollständig", durationMs: Date.now() - start };
  }
  return { name: "E-Mail (SMTP)", ok: true, message: `SMTP konfiguriert: ${host}`, durationMs: Date.now() - start };
}

async function checkPdf(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const { generateOfferPDF } = await import("@/lib/pdf");
    const buf = generateOfferPDF({
      offerNumber: "TEST-0000",
      validUntil: "01.01.2099",
      customerName: "Test",
      customerEmail: "test@test.de",
      serviceSummary: "Test",
      items: [{ title: "Test", quantity: 1, unitPrice: 10, totalPrice: 10 }],
      subtotal: 10,
      discountAmount: 0,
      extraFees: 0,
      netto: 10,
      mwst: 1.9,
      totalPrice: 11.9,
    });
    return { name: "PDF-Generierung", ok: buf.length > 0, message: `PDF erstellt (${buf.length} Bytes)`, durationMs: Date.now() - start };
  } catch (err) {
    return { name: "PDF-Generierung", ok: false, message: (err as Error).message, durationMs: Date.now() - start };
  }
}

async function checkMaps(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch("https://nominatim.openstreetmap.org/status?format=json", {
      headers: { "User-Agent": "SeelTransport/1.0" },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return { name: "Geocoding (Nominatim)", ok: true, message: "Dienst erreichbar", durationMs: Date.now() - start };
  } catch (err) {
    return { name: "Geocoding (Nominatim)", ok: false, message: (err as Error).message, durationMs: Date.now() - start };
  }
}

async function checkServiceAreas(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const areas = await prisma.serviceArea.count({ where: { enabled: true } });
    if (areas === 0) {
      return { name: "Servicegebiet-Validierung", ok: false, message: "Keine aktiven Servicegebiete konfiguriert", durationMs: Date.now() - start };
    }
    return { name: "Servicegebiet-Validierung", ok: true, message: `${areas} aktive Servicegebiete`, durationMs: Date.now() - start };
  } catch (err) {
    return { name: "Servicegebiet-Validierung", ok: false, message: (err as Error).message, durationMs: Date.now() - start };
  }
}

async function checkPricingRules(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const rules = await prisma.priceRule.count({ where: { enabled: true } });
    if (rules === 0) {
      return { name: "Pricing-Engine-Regeln", ok: false, message: "Keine aktiven Preisregeln vorhanden", durationMs: Date.now() - start };
    }
    return { name: "Pricing-Engine-Regeln", ok: true, message: `${rules} aktive Preisregeln`, durationMs: Date.now() - start };
  } catch (err) {
    return { name: "Pricing-Engine-Regeln", ok: false, message: (err as Error).message, durationMs: Date.now() - start };
  }
}

async function checkSignatureFlow(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const pendingOrSigned = await prisma.contract.count({
      where: { status: { in: ["PENDING_SIGNATURE", "LOCKED", "SIGNED"] } },
    });
    return { name: "Signatur-Workflow", ok: true, message: `${pendingOrSigned} Verträge im Signatur-Lebenszyklus`, durationMs: Date.now() - start };
  } catch (err) {
    return { name: "Signatur-Workflow", ok: false, message: (err as Error).message, durationMs: Date.now() - start };
  }
}

async function checkEnv(): Promise<CheckResult> {
  const start = Date.now();
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET", "SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    return { name: "Umgebungsvariablen", ok: false, message: `Fehlend: ${missing.join(", ")}`, durationMs: Date.now() - start };
  }
  return { name: "Umgebungsvariablen", ok: true, message: "Alle Pflicht-Variablen gesetzt", durationMs: Date.now() - start };
}

export async function GET() {
  const checks = await Promise.all([
    checkDatabase(),
    checkEmail(),
    checkPdf(),
    checkMaps(),
    checkSignatureFlow(),
    checkPricingRules(),
    checkServiceAreas(),
    checkEnv(),
  ]);

  const allOk = checks.every((c) => c.ok);
  return NextResponse.json(
    { ok: allOk, checks, timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
  );
}
