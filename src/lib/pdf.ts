import fs from "fs";
import path from "path";
import jsPDF from "jspdf";
import sharp from "sharp";
import { COMPANY_BANK, COMPANY_LEGAL, CONTACT } from "@/config/contact";
import {
  SEEL_AGB_SECTIONS,
  SEEL_AGB_VERSION,
  SEEL_CANCELLATION_RULES,
  SEEL_CONTRACT_HIGHLIGHTS,
} from "@/lib/legal";

interface BookingPDFData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  service: string;
  date: string;
  time?: string;
  addressFrom?: string;
  addressTo?: string;
  distance?: string;
  notes?: string;
  extras: string[];
  breakdown: {
    totalHours: number;
    hourlyRate: number;
    weekendSurcharge: number;
    movingSurcharges: number;
    netto: number;
    mwst: number;
    total: number;
    discountAmount?: number;
  };
  paymentMethod: string;
}

interface OfferPDFData {
  offerNumber: string;
  validUntil: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  serviceSummary: string;
  routeDistanceKm?: number | null;
  serviceDate?: string | null;
  timeSlot?: string | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  items: Array<{
    title: string;
    description?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  discountAmount: number;
  extraFees: number;
  netto: number;
  mwst: number;
  totalPrice: number;
  notes?: string | null;
  agbText?: string;
  trackingNumber?: string;
  statusNote?: string;
  jobDetails?: {
    computedDurationHours?: number | null;
    routeDurationMin?: number | null;
    floorFrom?: number | null;
    floorTo?: number | null;
    hasElevatorFrom?: boolean | null;
    hasElevatorTo?: boolean | null;
    parkingFrom?: string | null;
    parkingTo?: string | null;
    estimateNote?: string | null;
    addons?: string[];
  };
}

interface ContractPDFData {
  contractNumber: string;
  offerNumber: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string | null;
  serviceSummary: string;
  serviceDate?: string | null;
  timeSlot?: string | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  items?: Array<{ title: string; description?: string | null; quantity: number; unitPrice: number; totalPrice: number }>;
  subtotal?: number;
  discountAmount?: number;
  extraFees?: number;
  totalPrice: number;
  netto: number;
  mwst: number;
  signedByName?: string | null;
  signedAt?: string | null;
  ipAddress?: string | null;
  signatureDataUrl?: string | null;
  companyExecutedAt?: string | null;
  notes?: string | null;
}

type InvoicePDFItem = {
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
  detail?: string | null;
};

const NAVY = [15, 37, 80] as const;
const TEAL = [13, 158, 160] as const;
const WHITE = [255, 255, 255] as const;
const INK = [31, 41, 55] as const;
const MUTED = [100, 116, 139] as const;
const LIGHT = [248, 250, 252] as const;
const BORDER = [226, 232, 240] as const;
const SUCCESS = [16, 185, 129] as const;

const logoPath = path.join(process.cwd(), "public", "images", "logo.jpeg");
const signaturePath = path.join(process.cwd(), "public", "images", "sing", "WhatsApp Image 2026-03-05 at 17.06.22.jpeg");
const sealPath = path.join(process.cwd(), "public", "images", "sing", "WhatsApp Image 2026-03-05 at 17.06.24.jpeg");

let logoDataUrl: string | null = null;
const processedAssetCache = new Map<string, Promise<string | null>>();

function safeReadBase64(filePath: string) {
  try {
    return fs.readFileSync(filePath).toString("base64");
  } catch {
    return null;
  }
}

function registerBrandFonts(doc: jsPDF) {
  const regularPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
  const boldPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Bold.ttf");
  const regularB64 = safeReadBase64(regularPath);
  const boldB64 = safeReadBase64(boldPath);

  if (regularB64) {
    doc.addFileToVFS("NotoSans-Regular.ttf", regularB64);
    doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
  }
  if (boldB64) {
    doc.addFileToVFS("NotoSans-Bold.ttf", boldB64);
    doc.addFont("NotoSans-Bold.ttf", "NotoSans", "bold");
  }

}

function setBrandFont(doc: jsPDF, style: "normal" | "bold") {
  try {
    doc.setFont("NotoSans", style);
  } catch {
    doc.setFont("helvetica", style);
  }
}

function getLogoDataUrl() {
  if (logoDataUrl) return logoDataUrl;
  const logoB64 = safeReadBase64(logoPath);
  if (!logoB64) return null;
  logoDataUrl = `data:image/jpeg;base64,${logoB64}`;
  return logoDataUrl;
}

async function getProcessedAssetDataUrl(filePath: string) {
  const cached = processedAssetCache.get(filePath);
  if (cached) return cached;

  const assetPromise = (async () => {
    try {
      const base = sharp(filePath).trim({ background: { r: 238, g: 238, b: 238, alpha: 1 } }).ensureAlpha();
      const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });

      for (let i = 0; i < data.length; i += info.channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max > 225 && max - min < 24) {
          data[i + 3] = 0;
        }
      }

      const png = await sharp(data, {
        raw: {
          width: info.width,
          height: info.height,
          channels: info.channels,
        },
      })
        .png()
        .toBuffer();

      return `data:image/png;base64,${png.toString("base64")}`;
    } catch {
      return null;
    }
  })();

  processedAssetCache.set(filePath, assetPromise);
  return assetPromise;
}

function fmt(amount: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
}

function addImageIfPossible(doc: jsPDF, dataUrl: string | null | undefined, format: "JPEG" | "PNG", x: number, y: number, w: number, h: number) {
  if (!dataUrl) return;
  try {
    doc.addImage(dataUrl, format, x, y, w, h);
  } catch {
    // Ignore optional image failures.
  }
}

function drawPageBackground(doc: jsPDF) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 0, pw, ph, "F");
  doc.setFillColor(233, 244, 249);
  doc.circle(pw - 10, 18, 28, "F");
}

function drawHeader(doc: jsPDF, title: string, badgeLabel: string, badgeValue: string) {
  const pw = doc.internal.pageSize.getWidth();
  drawPageBackground(doc);

  doc.setFillColor(...NAVY);
  doc.roundedRect(10, 10, pw - 20, 34, 6, 6, "F");

  addImageIfPossible(doc, getLogoDataUrl(), "JPEG", 16, 15, 18, 18);

  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(18);
  doc.text("SEEL Transport & Reinigung", 39, 22);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.5);
  doc.text(`${CONTACT.EMAIL}  |  ${CONTACT.PRIMARY_PHONE_DISPLAY}  |  ${CONTACT.WEBSITE_DISPLAY}`, 39, 29);
  doc.text(title, 39, 35);

  doc.setFillColor(...WHITE);
  doc.roundedRect(pw - 66, 15, 50, 20, 4, 4, "F");
  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(8);
  doc.text(badgeLabel, pw - 41, 23, { align: "center" });
  doc.setFontSize(10);
  doc.text(badgeValue, pw - 41, 29.5, { align: "center" });
}

function drawFooter(doc: jsPDF, footerLeft?: string, footerRight?: string) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...BORDER);
  doc.line(14, ph - 17, pw - 14, ph - 17);
  doc.setTextColor(...MUTED);
  doc.setFontSize(7);
  setBrandFont(doc, "normal");
  doc.text(`${COMPANY_LEGAL.NAME} | ${COMPANY_LEGAL.ADDRESS_LINE_1} | USt-IdNr.: ${COMPANY_LEGAL.VAT_ID}`, 14, ph - 12);
  doc.text(`Bank: ${COMPANY_BANK.BANK_NAME} | IBAN: ${COMPANY_BANK.IBAN} | BIC: ${COMPANY_BANK.BIC}`, 14, ph - 8);
  if (footerLeft) {
    doc.text(footerLeft, 14, ph - 4);
  }
  if (footerRight) {
    doc.text(footerRight, pw - 14, ph - 4, { align: "right" });
  }
}

function sectionHeading(doc: jsPDF, label: string, x: number, y: number) {
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.8);
  doc.line(x, y + 0.8, x + 14, y + 0.8);
  setBrandFont(doc, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text(label, x + 18, y + 2);
}

function writeParagraph(doc: jsPDF, text: string, x: number, y: number, width: number, lineHeight = 4.5) {
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawMetaRow(doc: jsPDF, leftLabel: string, leftValue: string, rightLabel: string, rightValue: string, y: number) {
  const pw = doc.internal.pageSize.getWidth();
  doc.setTextColor(...MUTED);
  setBrandFont(doc, "normal");
  doc.setFontSize(8);
  doc.text(leftLabel, 20, y);
  doc.text(rightLabel, pw / 2 + 4, y);
  setBrandFont(doc, "bold");
  doc.setTextColor(...INK);
  doc.text(leftValue, 20, y + 4.6);
  doc.text(rightValue, pw / 2 + 4, y + 4.6);
}

function drawMoneySummary(doc: jsPDF, y: number, values: Array<{ label: string; value: string; accent?: "default" | "teal" | "red" }>) {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(...LIGHT);
  doc.roundedRect(pw - 78, y - 3, 58, values.length * 7.2 + 10, 4, 4, "F");
  let cursor = y + 1;
  values.forEach(({ label, value, accent }) => {
    doc.setTextColor(...MUTED);
    setBrandFont(doc, "normal");
    doc.setFontSize(8);
    doc.text(label, pw - 72, cursor);
    if (accent === "red") {
      doc.setTextColor(185, 28, 28);
    } else if (accent === "teal") {
      doc.setTextColor(...TEAL);
    } else {
      doc.setTextColor(...NAVY);
    }
    setBrandFont(doc, accent === "teal" ? "bold" : "normal");
    doc.text(value, pw - 24, cursor, { align: "right" });
    cursor += 6.8;
  });
}

function buildJobFacts(data: OfferPDFData) {
  const facts: Array<[string, string]> = [];
  facts.push(["Service", data.serviceSummary]);
  if (data.serviceDate) facts.push(["Termin", `${data.serviceDate}${data.timeSlot ? `, ${data.timeSlot}` : ""}`]);
  if (data.fromAddress) facts.push(["Start", data.fromAddress]);
  if (data.toAddress) facts.push(["Ziel", data.toAddress]);
  if (typeof data.routeDistanceKm === "number") facts.push(["Route", `${data.routeDistanceKm.toFixed(1)} km`]);
  if (data.jobDetails?.computedDurationHours) facts.push(["Dauer", `${data.jobDetails.computedDurationHours.toFixed(2)} Std.`]);
  if (data.jobDetails?.routeDurationMin) facts.push(["Fahrzeit", `${Math.round(data.jobDetails.routeDurationMin)} Min.`]);
  if (data.jobDetails?.addons?.length) facts.push(["Add-ons", data.jobDetails.addons.join(", ")]);
  return facts;
}

function maybeAddPage(doc: jsPDF, y: number, threshold = 44) {
  const ph = doc.internal.pageSize.getHeight();
  if (y <= ph - threshold) return y;
  doc.addPage();
  return 24;
}

export function generateBookingPDF(data: BookingPDFData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  let y = 0;

  registerBrandFonts(doc);
  drawHeader(doc, "Buchungsuebersicht", "AUFTRAG", data.orderNumber);

  y = 52;
  drawMetaRow(doc, "Erstellt am", new Date().toLocaleDateString("de-DE"), "Leistungsdatum", data.date, y);
  y += 15;

  sectionHeading(doc, "Kunde", 20, y);
  y += 9;
  doc.setTextColor(...INK);
  setBrandFont(doc, "bold");
  doc.setFontSize(12);
  doc.text(data.customerName, 20, y);
  y += 5;
  setBrandFont(doc, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(data.customerEmail, 20, y);
  y += 4.8;
  doc.text(data.customerPhone, 20, y);
  y += 4.8;
  if (data.customerCompany) {
    doc.text(data.customerCompany, 20, y);
    y += 5;
  }

  const serviceFacts = [
    ["Leistung", data.service],
    ["Zeit", data.time || "Nach Absprache"],
    ["Start", data.addressFrom || "-"],
    ["Ziel", data.addressTo || "-"],
    ["Distanz", data.distance || "-"],
    [
      "Zahlungsart",
      data.paymentMethod === "STRIPE"
        ? "Online-Zahlung"
        : data.paymentMethod === "PAYPAL"
          ? "PayPal"
          : data.paymentMethod === "BAR"
            ? "Barzahlung"
            : "Ueberweisung",
    ],
  ];

  doc.setFillColor(...LIGHT);
  doc.roundedRect(pw / 2, 57, pw / 2 - 20, 46, 5, 5, "F");
  let rowY = 65;
  serviceFacts.forEach(([label, value]) => {
    doc.setTextColor(...MUTED);
    setBrandFont(doc, "normal");
    doc.setFontSize(8);
    doc.text(label, pw / 2 + 6, rowY);
    doc.setTextColor(...INK);
    setBrandFont(doc, "bold");
    doc.setFontSize(8.5);
    doc.text(value, pw - 18, rowY, { align: "right" });
    rowY += 6.6;
  });

  y = 113;
  sectionHeading(doc, "Preisuebersicht", 20, y);
  y += 10;

  const bookingItems = [
    { title: data.service, detail: `${data.breakdown.totalHours} Std.`, unit: fmt(data.breakdown.hourlyRate), total: fmt(data.breakdown.totalHours * data.breakdown.hourlyRate) },
    ...(data.breakdown.weekendSurcharge > 0
      ? [{ title: "Wochenendzuschlag", detail: "1", unit: "-", total: fmt(data.breakdown.weekendSurcharge) }]
      : []),
    ...(data.breakdown.movingSurcharges > 0
      ? [{ title: "Zuschlaege", detail: "1", unit: "-", total: fmt(data.breakdown.movingSurcharges) }]
      : []),
    ...data.extras.map((extra) => ({ title: extra, detail: "1", unit: "inkl.", total: "inkl." })),
    ...(data.breakdown.discountAmount
      ? [{ title: "Rabatt", detail: "1", unit: "-", total: `-${fmt(data.breakdown.discountAmount)}` }]
      : []),
  ];

  doc.setFillColor(...NAVY);
  doc.roundedRect(16, y, pw - 32, 8, 2, 2, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(8);
  doc.text("Position", 20, y + 5.3);
  doc.text("Menge", 108, y + 5.3);
  doc.text("Einzelpreis", 133, y + 5.3);
  doc.text("Gesamt", pw - 20, y + 5.3, { align: "right" });
  y += 11;

  bookingItems.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(...LIGHT);
      doc.roundedRect(16, y - 2.2, pw - 32, 7, 1.5, 1.5, "F");
    }
    doc.setTextColor(...INK);
    setBrandFont(doc, "normal");
    doc.text(item.title, 20, y + 1);
    doc.text(item.detail, 108, y + 1);
    doc.text(item.unit, 133, y + 1);
    doc.text(item.total, pw - 20, y + 1, { align: "right" });
    y += 6.4;
  });

  drawMoneySummary(doc, y + 3, [
    { label: "Netto", value: fmt(data.breakdown.netto) },
    { label: "MwSt. (19%)", value: fmt(data.breakdown.mwst) },
    { label: "Gesamt", value: fmt(data.breakdown.total), accent: "teal" },
  ]);

  y += 28;
  if (data.notes) {
    sectionHeading(doc, "Anmerkungen", 20, y);
    y += 9;
    doc.setTextColor(...MUTED);
    setBrandFont(doc, "normal");
    doc.setFontSize(9);
    y = writeParagraph(doc, data.notes, 20, y, pw - 40);
  }

  drawFooter(doc, "Diese Uebersicht wurde digital erstellt.", `Seite ${doc.getCurrentPageInfo().pageNumber}`);
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateOfferPDF(data: OfferPDFData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  registerBrandFonts(doc);
  drawHeader(doc, "Professionelles Angebot", "ANGEBOT", data.offerNumber);

  y = 53;
  drawMetaRow(doc, "Gueltig bis", data.validUntil, "Erstellt", new Date().toLocaleDateString("de-DE"), y);
  y += 16;

  doc.setFillColor(...LIGHT);
  doc.roundedRect(14, y - 2, 88, 26, 5, 5, "F");
  sectionHeading(doc, "Kunde", 20, y);
  y += 8;
  doc.setTextColor(...INK);
  setBrandFont(doc, "bold");
  doc.setFontSize(11.5);
  doc.text(data.customerName, 20, y);
  y += 4.7;
  setBrandFont(doc, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(8.6);
  doc.text(data.customerEmail, 20, y);
  y += 4.4;
  if (data.customerPhone) {
    doc.text(data.customerPhone, 20, y);
    y += 4.4;
  }
  if (data.customerCompany) {
    doc.text(data.customerCompany, 20, y);
  }

  const facts = buildJobFacts(data).slice(0, 6);
  doc.setFillColor(...WHITE);
  doc.roundedRect(108, 67, 88, 36, 5, 5, "F");
  doc.setDrawColor(...BORDER);
  doc.roundedRect(108, 67, 88, 36, 5, 5, "S");
  let factY = 74;
  facts.forEach(([label, value]) => {
    doc.setTextColor(...MUTED);
    setBrandFont(doc, "normal");
    doc.setFontSize(7.5);
    doc.text(label, 114, factY);
    setBrandFont(doc, "bold");
    doc.setTextColor(...INK);
    doc.text(value, 192, factY, { align: "right", maxWidth: 68 });
    factY += 5.2;
  });

  y = 112;
  sectionHeading(doc, "Leistungspositionen", 20, y);
  y += 10;
  doc.setFillColor(...NAVY);
  doc.roundedRect(15, y, pw - 30, 8, 2, 2, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(8);
  doc.text("Position", 20, y + 5.2);
  doc.text("Menge", 107, y + 5.2);
  doc.text("Einzelpreis", 132, y + 5.2);
  doc.text("Gesamt", pw - 20, y + 5.2, { align: "right" });
  y += 11;

  data.items.forEach((item, index) => {
    if (y > ph - 84) {
      doc.addPage();
      drawHeader(doc, "Professionelles Angebot", "ANGEBOT", data.offerNumber);
      y = 32;
    }
    if (index % 2 === 0) {
      doc.setFillColor(...LIGHT);
      doc.roundedRect(15, y - 2.3, pw - 30, item.description ? 10 : 6.8, 1.5, 1.5, "F");
    }

    doc.setTextColor(...INK);
    setBrandFont(doc, "bold");
    doc.setFontSize(8.5);
    doc.text(item.title, 20, y + 1);
    setBrandFont(doc, "normal");
    doc.text(String(item.quantity), 107, y + 1);
    doc.text(item.unitPrice === 0 && item.totalPrice === 0 ? "inklusive" : fmt(item.unitPrice), 132, y + 1);
    doc.text(item.unitPrice === 0 && item.totalPrice === 0 ? "im Paket" : fmt(item.totalPrice), pw - 20, y + 1, { align: "right" });

    y += 5.2;
    if (item.description) {
      doc.setTextColor(...MUTED);
      setBrandFont(doc, "normal");
      doc.setFontSize(7.3);
      y = writeParagraph(doc, item.description, 20, y, pw - 48, 3.6);
    }
    y += 1.8;
  });

  drawMoneySummary(doc, y + 2, [
    { label: "Zwischensumme", value: fmt(data.subtotal) },
    ...(data.discountAmount > 0 ? [{ label: "Rabatt", value: `-${fmt(data.discountAmount)}`, accent: "red" as const }] : []),
    ...(data.extraFees > 0 ? [{ label: "Zusatzkosten", value: fmt(data.extraFees) }] : []),
    { label: "Netto", value: fmt(data.netto) },
    { label: "MwSt. (19%)", value: fmt(data.mwst) },
    { label: "Gesamt", value: fmt(data.totalPrice), accent: "teal" },
  ]);

  y += 45;
  y = maybeAddPage(doc, y, 74);
  sectionHeading(doc, "Vertrags- und Servicehinweise", 20, y);
  y += 10;
  const notes = [
    "Dieses Angebot basiert auf den aktuell dokumentierten Leistungsdaten. Zusatzaufwand durch abweichende Objekt- oder Zugangssituationen wird nach Abstimmung nachberechnet.",
    `Es gelten unsere AGB in Version ${SEEL_AGB_VERSION}. Die vollstaendigen Bedingungen werden als separates PDF beigefuegt und sind online unter ${CONTACT.WEBSITE_DISPLAY}/agb abrufbar.`,
    `Stornierung: ${SEEL_CANCELLATION_RULES.map((rule) => `${rule.fee} (${rule.label})`).join(", ")}.`,
  ];

  if (data.statusNote) {
    notes.unshift(`Status: ${data.statusNote}.`);
  }
  if (data.jobDetails?.estimateNote) {
    notes.push(data.jobDetails.estimateNote);
  }
  if (data.notes) {
    notes.push(`Kundenhinweis: ${data.notes}`);
  }

  doc.setTextColor(...MUTED);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.4);
  notes.forEach((note) => {
    y = maybeAddPage(doc, y, 36);
    y = writeParagraph(doc, `- ${note}`, 20, y, pw - 40);
    y += 2;
  });

  drawFooter(doc, "Angebot digital erstellt fuer SEEL Transport & Reinigung.", `Seite ${doc.getCurrentPageInfo().pageNumber}`);
  return Buffer.from(doc.output("arraybuffer"));
}

export async function generateSignedContractPDF(data: ContractPDFData): Promise<Buffer> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  registerBrandFonts(doc);
  drawHeader(doc, "Dienstleistungsvertrag", "VERTRAG", data.contractNumber);

  const [companySignature, companySeal] = await Promise.all([
    getProcessedAssetDataUrl(signaturePath),
    getProcessedAssetDataUrl(sealPath),
  ]);

  y = 53;
  drawMetaRow(doc, "Angebot", data.offerNumber, "Signiert am", data.signedAt || "Ausstehend", y);
  y += 16;

  doc.setFillColor(...LIGHT);
  doc.roundedRect(14, y - 2, pw - 28, 30, 5, 5, "F");
  sectionHeading(doc, "Vertragsparteien", 20, y);
  y += 8;

  doc.setTextColor(...INK);
  setBrandFont(doc, "bold");
  doc.setFontSize(10.5);
  doc.text("Auftragnehmer", 20, y);
  doc.text("Auftraggeber", pw / 2 + 4, y);
  y += 5.5;
  setBrandFont(doc, "bold");
  doc.text(COMPANY_LEGAL.NAME, 20, y);
  doc.text(data.customerName, pw / 2 + 4, y);
  y += 4.8;
  setBrandFont(doc, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(8.2);
  doc.text(COMPANY_LEGAL.ADDRESS_LINE_1, 20, y);
  doc.text(data.customerEmail, pw / 2 + 4, y);
  y += 4.2;
  doc.text(`${CONTACT.EMAIL} | ${CONTACT.PRIMARY_PHONE_DISPLAY}`, 20, y);
  if (data.customerCompany) {
    doc.text(data.customerCompany, pw / 2 + 4, y);
  }

  y = 98;
  sectionHeading(doc, "Leistungsbeschreibung", 20, y);
  y += 10;
  const performanceFacts = [
    `Leistungsart: ${data.serviceSummary}`,
    data.serviceDate ? `Termin: ${data.serviceDate}${data.timeSlot ? ` (${data.timeSlot})` : ""}` : null,
    data.fromAddress ? `Startadresse: ${data.fromAddress}` : null,
    data.toAddress ? `Zieladresse: ${data.toAddress}` : null,
  ].filter(Boolean) as string[];

  doc.setTextColor(...MUTED);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.8);
  performanceFacts.forEach((line) => {
    y = writeParagraph(doc, line, 20, y, pw - 40);
    y += 1.5;
  });

  if (data.items?.length) {
    y += 3;
    doc.setFillColor(...NAVY);
    doc.roundedRect(15, y, pw - 30, 8, 2, 2, "F");
    doc.setTextColor(...WHITE);
    setBrandFont(doc, "bold");
    doc.setFontSize(8);
    doc.text("Position", 20, y + 5.2);
    doc.text("Menge", 106, y + 5.2);
    doc.text("Preis", 132, y + 5.2);
    doc.text("Gesamt", pw - 20, y + 5.2, { align: "right" });
    y += 10.8;

    data.items.forEach((item, index) => {
      if (y > ph - 110) {
        doc.addPage();
        drawHeader(doc, "Dienstleistungsvertrag", "VERTRAG", data.contractNumber);
        y = 28;
      }

      if (index % 2 === 0) {
        doc.setFillColor(...LIGHT);
        doc.roundedRect(15, y - 2.2, pw - 30, item.description ? 10 : 6.6, 1.5, 1.5, "F");
      }

      doc.setTextColor(...INK);
      setBrandFont(doc, "bold");
      doc.setFontSize(8.4);
      doc.text(item.title, 20, y + 1);
      setBrandFont(doc, "normal");
      doc.text(String(item.quantity), 106, y + 1);
      doc.text(fmt(item.unitPrice), 132, y + 1);
      doc.text(fmt(item.totalPrice), pw - 20, y + 1, { align: "right" });
      y += 5.1;

      if (item.description) {
        doc.setTextColor(...MUTED);
        doc.setFontSize(7.2);
        y = writeParagraph(doc, item.description, 20, y, pw - 45, 3.6);
      }
      y += 1.6;
    });
  }

  y += 4;
  drawMoneySummary(doc, y + 1, [
    ...(typeof data.subtotal === "number" ? [{ label: "Zwischensumme", value: fmt(data.subtotal) }] : []),
    ...(data.discountAmount ? [{ label: "Rabatt", value: `-${fmt(data.discountAmount)}`, accent: "red" as const }] : []),
    ...(data.extraFees ? [{ label: "Zusatzkosten", value: fmt(data.extraFees) }] : []),
    { label: "Netto", value: fmt(data.netto) },
    { label: "MwSt. (19%)", value: fmt(data.mwst) },
    { label: "Gesamt", value: fmt(data.totalPrice), accent: "teal" },
  ]);

  y += 46;
  y = maybeAddPage(doc, y, 98);
  sectionHeading(doc, "Vertragsbedingungen", 20, y);
  y += 10;
  doc.setTextColor(...MUTED);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.5);
  SEEL_CONTRACT_HIGHLIGHTS.forEach((line) => {
    y = writeParagraph(doc, `- ${line}`, 20, y, pw - 40);
    y += 1.8;
  });

  if (data.notes) {
    y += 2;
    y = writeParagraph(doc, `Hinweis: ${data.notes}`, 20, y, pw - 40);
    y += 2;
  }

  y += 3;
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(15, y - 2, pw - 30, 18, 4, 4, "F");
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(15, y - 2, pw - 30, 18, 4, 4, "S");
  doc.setTextColor(...INK);
  setBrandFont(doc, "bold");
  doc.setFontSize(8.7);
  doc.text(
    data.signedByName
      ? `Digitale Signatur des Auftraggebers: ${data.signedByName}`
      : "Digitale Signatur des Auftraggebers: noch ausstehend",
    20,
    y + 4
  );
  setBrandFont(doc, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(8);
  doc.text(`Zeitpunkt: ${data.signedAt || "Wird nach digitaler Unterschrift ergänzt"}`, 20, y + 9);
  if (data.ipAddress) {
    doc.text(`IP-Adresse: ${data.ipAddress}`, 20, y + 13.5);
  }

  y += 24;
  y = maybeAddPage(doc, y, 74);
  sectionHeading(doc, "Unterschriften", 20, y);
  y += 10;

  const boxY = y;
  const boxWidth = 84;
  const rightX = pw - 20 - boxWidth;
  doc.setDrawColor(...BORDER);
  doc.roundedRect(15, boxY, boxWidth, 42, 4, 4, "S");
  doc.roundedRect(rightX, boxY, boxWidth, 42, 4, 4, "S");

  setBrandFont(doc, "bold");
  doc.setFontSize(8.8);
  doc.setTextColor(...NAVY);
  doc.text("Auftraggeber", 20, boxY + 6);
  doc.text("SEEL autorisiert", rightX + 5, boxY + 6);

  setBrandFont(doc, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(7.4);
  doc.text(data.signedByName || "Digitale Kundensignatur ausstehend", 20, boxY + 11);
  doc.text(data.signedAt || "Wird nach Unterzeichnung eingetragen", 20, boxY + 15.5);
  doc.text(`Berlin, ${data.companyExecutedAt || new Date().toLocaleDateString("de-DE")}`, rightX + 5, boxY + 11);
  doc.text("Firmenunterschrift und Stempel", rightX + 5, boxY + 15.5);

  if (data.signatureDataUrl) {
    addImageIfPossible(doc, data.signatureDataUrl, "PNG", 22, boxY + 18, 70, 15);
  } else {
    setBrandFont(doc, "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED);
    doc.text("Digitale Signatur folgt nach Freigabe", 24, boxY + 27);
  }

  addImageIfPossible(doc, companySignature, "PNG", rightX + 5, boxY + 17, 56, 16);
  addImageIfPossible(doc, companySeal, "PNG", rightX + 54, boxY + 15, 22, 22);

  doc.setFillColor(...SUCCESS);
  doc.roundedRect(rightX + 4, boxY + 33, boxWidth - 8, 6, 2, 2, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(7.5);
  doc.text(
    `Ausgefuehrt am ${data.companyExecutedAt || new Date().toLocaleDateString("de-DE")}`,
    rightX + boxWidth / 2,
    boxY + 37.1,
    { align: "center" }
  );

  drawFooter(
    doc,
    `AGB Version ${SEEL_AGB_VERSION} | ${CONTACT.WEBSITE_DISPLAY}/agb`,
    `Seite ${doc.getCurrentPageInfo().pageNumber}`
  );

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateInvoicePDF(data: {
  invoiceNumber: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  customerPhone?: string;
  service: string;
  title?: string;
  date: string;
  netto: number;
  mwst: number;
  total: number;
  taxRate?: number;
  items: InvoicePDFItem[];
  dueDate: string;
  notes?: string;
}): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  let y = 0;

  registerBrandFonts(doc);
  drawHeader(doc, data.title || "Rechnung", "RECHNUNG", data.invoiceNumber);

  y = 54;
  drawMetaRow(doc, "Rechnungsdatum", data.date, "Faellig", data.dueDate, y);
  y += 16;

  sectionHeading(doc, "Rechnungsempfaenger", 20, y);
  y += 10;
  doc.setTextColor(...INK);
  setBrandFont(doc, "bold");
  doc.setFontSize(11);
  doc.text(data.customerName, 20, y);
  y += 5;
  setBrandFont(doc, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(8.8);
  if (data.customerCompany) {
    doc.text(data.customerCompany, 20, y);
    y += 4.5;
  }
  doc.text(data.customerEmail, 20, y);
  if (data.customerPhone) {
    y += 4.5;
    doc.text(data.customerPhone, 20, y);
  }
  y += 9;

  sectionHeading(doc, "Leistungen", 20, y);
  y += 10;
  doc.setFillColor(...NAVY);
  doc.roundedRect(15, y, pw - 30, 8, 2, 2, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(8);
  doc.text("Beschreibung", 20, y + 5.2);
  doc.text("Menge", 112, y + 5.2);
  doc.text("Einzelpreis", 138, y + 5.2);
  doc.text("Betrag", pw - 20, y + 5.2, { align: "right" });
  y += 10.5;

  data.items.forEach((item, index) => {
    const rowHeight = item.detail ? 10 : 6.6;
    if (index % 2 === 0) {
      doc.setFillColor(...LIGHT);
      doc.roundedRect(15, y - 2.2, pw - 30, rowHeight, 1.5, 1.5, "F");
    }
    doc.setTextColor(...INK);
    setBrandFont(doc, "normal");
    doc.text(item.description, 20, y + 1);
    doc.text(String(item.quantity ?? 1), 112, y + 1);
    doc.text(fmt(item.unitPrice ?? item.amount), 138, y + 1);
    doc.text(fmt(item.amount), pw - 20, y + 1, { align: "right" });
    y += 5.2;
    if (item.detail) {
      doc.setTextColor(...MUTED);
      doc.setFontSize(7.2);
      y = writeParagraph(doc, item.detail, 20, y, pw - 48, 3.6);
      y += 1;
    }
    y += 1;
  });

  drawMoneySummary(doc, y + 3, [
    { label: "Netto", value: fmt(data.netto) },
    { label: `MwSt. (${data.taxRate ?? 19}%)`, value: fmt(data.mwst) },
    { label: "Rechnungsbetrag", value: fmt(data.total), accent: "teal" },
  ]);

  y += 36;
  if (data.notes) {
    sectionHeading(doc, "Hinweise", 20, y);
    y += 9;
    doc.setTextColor(...MUTED);
    setBrandFont(doc, "normal");
    doc.setFontSize(8.4);
    y = writeParagraph(doc, data.notes, 20, y, pw - 40);
    y += 6;
  }
  sectionHeading(doc, "Zahlungsinformationen", 20, y);
  y += 9;
  doc.setTextColor(...MUTED);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.4);
  [
    `Zahlungsziel: ${data.dueDate}`,
    `Kontoinhaber: ${COMPANY_BANK.ACCOUNT_HOLDER}`,
    `Bank: ${COMPANY_BANK.BANK_NAME}`,
    `IBAN: ${COMPANY_BANK.IBAN}`,
    `BIC: ${COMPANY_BANK.BIC}`,
    `Verwendungszweck: ${data.invoiceNumber}`,
  ].forEach((line) => {
    doc.text(line, 20, y);
    y += 4.6;
  });

  drawFooter(doc, `Leistung: ${data.service}`, data.orderNumber ? `Auftrag ${data.orderNumber}` : data.invoiceNumber);
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateAgbPDF(): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  registerBrandFonts(doc);
  drawHeader(doc, "Allgemeine Geschaeftsbedingungen", "AGB", SEEL_AGB_VERSION);

  y = 53;
  doc.setTextColor(...MUTED);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.5);
  doc.text("Verbindliche Vertragsbedingungen fuer Transport, Reinigung und begleitende Dienstleistungen.", 20, y);

  y += 10;
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(15, y - 2.5, pw - 30, 18, 5, 5, "F");
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(15, y - 2.5, pw - 30, 18, 5, 5, "S");
  setBrandFont(doc, "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text("Stornierungsstaffel", 20, y + 2);
  setBrandFont(doc, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(7.5);
  doc.text(SEEL_CANCELLATION_RULES.map((rule) => `${rule.fee}: ${rule.label}`).join(" | "), 20, y + 8);
  y += 24;

  SEEL_AGB_SECTIONS.forEach((section) => {
    const estimatedHeight = 10 + section.paragraphs.length * 11;
    if (y > ph - estimatedHeight) {
      doc.addPage();
      drawHeader(doc, "Allgemeine Geschaeftsbedingungen", "AGB", SEEL_AGB_VERSION);
      y = 28;
    }

    doc.setFillColor(...WHITE);
    doc.roundedRect(15, y - 2, pw - 30, Math.max(18, section.paragraphs.length * 11 + 6), 4, 4, "F");
    doc.setDrawColor(...BORDER);
    doc.roundedRect(15, y - 2, pw - 30, Math.max(18, section.paragraphs.length * 11 + 6), 4, 4, "S");
    setBrandFont(doc, "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(section.title, 20, y + 3);
    y += 9;

    setBrandFont(doc, "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(...MUTED);
    section.paragraphs.forEach((paragraph) => {
      y = writeParagraph(doc, paragraph, 20, y, pw - 40, 4.2);
      y += 2.5;
    });
    y += 3;
  });

  drawFooter(doc, `${CONTACT.WEBSITE_DISPLAY}/agb`, `Seite ${doc.getCurrentPageInfo().pageNumber}`);
  return Buffer.from(doc.output("arraybuffer"));
}
