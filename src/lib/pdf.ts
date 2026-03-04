import jsPDF from "jspdf";
import { COMPANY_BANK, COMPANY_LEGAL, CONTACT } from "@/config/contact";
import fs from "fs";
import path from "path";

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
  signedByName: string;
  signedAt: string;
  ipAddress?: string | null;
  signatureDataUrl?: string | null;
}

const NAVY = [15, 37, 80] as const;
const TEAL = [13, 158, 160] as const;
const WHITE = [255, 255, 255] as const;
const GRAY = [107, 119, 135] as const;
const LIGHT_BG = [248, 249, 251] as const;
const BORDER = [220, 225, 232] as const;

let fontsRegistered = false;
let logoDataUrl: string | null = null;

function safeReadBase64(filePath: string) {
  try {
    return fs.readFileSync(filePath).toString("base64");
  } catch {
    return null;
  }
}

function registerBrandFonts(doc: jsPDF) {
  if (fontsRegistered) return;
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
  fontsRegistered = true;
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
  const filePath = path.join(process.cwd(), "public", "images", "logo.jpeg");
  const b64 = safeReadBase64(filePath);
  if (!b64) return null;
  logoDataUrl = `data:image/jpeg;base64,${b64}`;
  return logoDataUrl;
}

function drawBrandHeader(doc: jsPDF, title: string, rightLabel: string, rightValue: string) {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, 46, "F");

  const logo = getLogoDataUrl();
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", 14, 8, 22, 22);
    } catch {
      // continue without logo rendering
    }
  }

  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(18);
  doc.text("SEEL Transport & Reinigung", 40, 18);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.5);
  doc.text(title, 40, 26);
  doc.text(`${CONTACT.EMAIL} | ${CONTACT.PRIMARY_PHONE_DISPLAY} | ${CONTACT.WEBSITE_DISPLAY}`, 40, 33);

  doc.setFillColor(...TEAL);
  doc.roundedRect(pw - 72, 10, 56, 24, 3, 3, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(9);
  doc.text(rightLabel, pw - 58, 19);
  doc.setFontSize(10);
  doc.text(rightValue, pw - 64, 27);
}

function fmt(amount: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
}

export function generateBookingPDF(data: BookingPDFData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  registerBrandFonts(doc);

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, 48, "F");

  const logo = getLogoDataUrl();
  if (logo) {
    try { doc.addImage(logo, "JPEG", 14, 8, 22, 22); } catch { /* skip */ }
  }

  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  setBrandFont(doc, "bold");
  doc.text("SEEL Transport & Reinigung", logo ? 40 : 20, 20);

  doc.setFontSize(9);
  setBrandFont(doc, "normal");
  doc.text(`${CONTACT.PRIMARY_PHONE_DISPLAY}  |  ${CONTACT.EMAIL}  |  seeltransport.de`, logo ? 40 : 20, 30);
  doc.text(`${CONTACT.COUNTRY}`, logo ? 40 : 20, 36);

  // ANGEBOT badge
  doc.setFillColor(...TEAL);
  doc.roundedRect(pw - 68, 10, 54, 28, 3, 3, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  setBrandFont(doc, "bold");
  doc.text("ANGEBOT", pw - 55, 20);
  doc.setFontSize(11);
  doc.text(data.orderNumber, pw - 60, 29);

  y = 58;

  // Validity
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);
  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  setBrandFont(doc, "normal");
  doc.text(`Erstellt am: ${new Date().toLocaleDateString("de-DE")} |  Gültig bis: ${validUntil.toLocaleDateString("de-DE")}`, 20, y);
  y += 10;

  // Customer Info
  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  setBrandFont(doc, "bold");
  doc.text("Kundendaten", 20, y);
  y += 7;

  doc.setFontSize(9);
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  const custLines = [
    `Name: ${data.customerName}`,
    `E-Mail: ${data.customerEmail}`,
    `Telefon: ${data.customerPhone}`,
  ];
  if (data.customerCompany) custLines.push(`Firma: ${data.customerCompany}`);
  custLines.forEach(l => {
    doc.text(l, 20, y);
    y += 5;
  });
  y += 5;

  // Booking Details Box
  const boxHeight = 30 + (data.addressTo ? 10 : 0) + (data.distance ? 5 : 0);
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(15, y - 3, pw - 30, boxHeight, 3, 3, "F");

  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  setBrandFont(doc, "bold");
  doc.text("Buchungsdetails", 20, y + 5);
  y += 12;

  doc.setFontSize(9);
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);

  const details = [`Service: ${data.service}`, `Datum: ${data.date}`];
  if (data.time) details.push(`Uhrzeit: ${data.time}`);
  if (data.addressFrom) details.push(`Von: ${data.addressFrom}`);
  if (data.addressTo) details.push(`Nach: ${data.addressTo}`);
  if (data.distance) details.push(`Entfernung: ${data.distance}`);
  const paymentLabel =
    data.paymentMethod === "STRIPE" ? "Online-Zahlung" : data.paymentMethod === "PAYPAL" ? "PayPal" : data.paymentMethod === "BAR" ? "Barzahlung" : "Überweisung";
  details.push(`Zahlungsart: ${paymentLabel}`);

  details.forEach(l => {
    doc.text(l, 20, y);
    y += 5;
  });
  y += 10;

  // Line-Item Table
  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  setBrandFont(doc, "bold");
  doc.text("Leistungsübersicht", 20, y);
  y += 3;

  // Table header
  doc.setFillColor(...NAVY);
  doc.rect(15, y, pw - 30, 8, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  setBrandFont(doc, "bold");
  doc.text("Position", 20, y + 5.5);
  doc.text("Menge", 100, y + 5.5);
  doc.text("Einzelpreis", 130, y + 5.5);
  doc.text("Gesamt", pw - 20, y + 5.5, { align: "right" });
  y += 10;

  setBrandFont(doc, "normal");
  doc.setFontSize(8);
  let rowBg = false;

  const addRow = (pos: string, qty: string, unit: string, total: string) => {
    if (y > ph - 60) {
      doc.addPage();
      y = 20;
    }
    if (rowBg) {
      doc.setFillColor(248, 249, 251);
      doc.rect(15, y - 3, pw - 30, 7, "F");
    }
    doc.setTextColor(...GRAY);
    doc.text(pos, 20, y + 1);
    doc.text(qty, 100, y + 1);
    doc.text(unit, 130, y + 1);
    doc.setTextColor(...NAVY);
    doc.text(total, pw - 20, y + 1, { align: "right" });
    y += 7;
    rowBg = !rowBg;
  };

  addRow(data.service, `${data.breakdown.totalHours} Std.`, fmt(data.breakdown.hourlyRate), fmt(data.breakdown.totalHours * data.breakdown.hourlyRate));

  if (data.breakdown.weekendSurcharge > 0) {
    addRow("Wochenendzuschlag (25%)", "1", "", `+${fmt(data.breakdown.weekendSurcharge)}`);
  }
  if (data.breakdown.movingSurcharges > 0) {
    addRow("Zuschlaege (Etage, Entfernung)", "1", "", fmt(data.breakdown.movingSurcharges));
  }

  data.extras.forEach(extra => {
    addRow(`+ ${extra}`, "1", "Inkl.", "Inkl.");
  });

  if (data.breakdown.discountAmount && data.breakdown.discountAmount > 0) {
    addRow("Rabatt", "1", "", `-${fmt(data.breakdown.discountAmount)}`);
  }

  // Totals
  y += 2;
  doc.setDrawColor(...BORDER);
  doc.line(15, y, pw - 15, y);
  y += 6;

  doc.setTextColor(...GRAY);
  doc.setFontSize(9);
  doc.text("Nettobetrag", 20, y);
  doc.setTextColor(...NAVY);
  doc.text(fmt(data.breakdown.netto), pw - 20, y, { align: "right" });
  y += 6;

  doc.setTextColor(...GRAY);
  doc.text("MwSt. (19%)", 20, y);
  doc.setTextColor(...NAVY);
  doc.text(fmt(data.breakdown.mwst), pw - 20, y, { align: "right" });
  y += 8;

  // Total bar
  doc.setFillColor(...TEAL);
  doc.roundedRect(15, y - 4, pw - 30, 14, 3, 3, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(12);
  doc.text("Gesamtbetrag (brutto)", 20, y + 5);
  doc.text(fmt(data.breakdown.total), pw - 20, y + 5, { align: "right" });
  y += 22;

  // Notes
  if (data.notes) {
    doc.setTextColor(...NAVY);
    doc.setFontSize(10);
    setBrandFont(doc, "bold");
    doc.text("Anmerkungen", 20, y);
    y += 5;
    doc.setFontSize(9);
    setBrandFont(doc, "normal");
    doc.setTextColor(...GRAY);
    const noteLines = doc.splitTextToSize(data.notes, pw - 40);
    doc.text(noteLines, 20, y);
    y += noteLines.length * 4 + 8;
  }

  // Payment Terms
  if (y < ph - 60) {
    doc.setTextColor(...NAVY);
    doc.setFontSize(9);
    setBrandFont(doc, "bold");
    doc.text("Zahlungsbedingungen", 20, y);
    y += 5;
    setBrandFont(doc, "normal");
    doc.setTextColor(...GRAY);
    doc.setFontSize(8);
    const terms = [
      "Zahlungsziel: 14 Tage nach Rechnungsstellung",
      "Bankverbindung wird mit der Rechnung mitgeteilt",
      "Dieses Angebot ist 14 Tage gültig",
      "Alle Preise in EUR inkl. 19% MwSt.",
    ];
    terms.forEach(t => {
      doc.text(t, 20, y);
      y += 4;
    });
  }

  // Footer
  const fy = ph - 18;
  doc.setDrawColor(...BORDER);
  doc.line(20, fy - 5, pw - 20, fy - 5);
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text(
    `Seel Transport & Reinigung  ·  ${CONTACT.COUNTRY}  ·  ${CONTACT.EMAIL}  ·  ${CONTACT.PRIMARY_PHONE_DISPLAY}`,
    pw / 2, fy, { align: "center" }
  );
  doc.text("Dieses Angebot wurde automatisch generiert. Es gelten unsere AGB.", pw / 2, fy + 4, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateOfferPDF(data: OfferPDFData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  registerBrandFonts(doc);
  drawBrandHeader(doc, "Professionelles Angebot", "ANGEBOT", data.offerNumber);

  y = 56;
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  doc.text(`Erstellt: ${new Date().toLocaleDateString("de-DE")} | Gültig bis: ${data.validUntil}`, 20, y);
  y += 8;

  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(11);
  doc.text("Kunde", 20, y);
  y += 6;
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  doc.setFontSize(9);
  doc.text(`Name: ${data.customerName}`, 20, y);
  y += 4.5;
  doc.text(`E-Mail: ${data.customerEmail}`, 20, y);
  y += 4.5;
  if (data.customerPhone) {
    doc.text(`Telefon: ${data.customerPhone}`, 20, y);
    y += 4.5;
  }
  if (data.customerCompany) {
    doc.text(`Firma: ${data.customerCompany}`, 20, y);
    y += 4.5;
  }
  y += 3;

  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(15, y - 2.5, pw - 30, 28, 3, 3, "F");
  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(10);
  doc.text("Leistungszusammenfassung", 20, y + 3);
  y += 9;
  doc.setTextColor(...GRAY);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.5);
  if (data.trackingNumber) {
    doc.text(`Tracking: ${data.trackingNumber}`, 20, y);
    y += 4.5;
  }
  doc.text(`Services: ${data.serviceSummary}`, 20, y);
  y += 4.5;
  if (data.serviceDate) {
    doc.text(`Termin: ${data.serviceDate}${data.timeSlot ? `, ${data.timeSlot}` : ""}`, 20, y);
    y += 4.5;
  }
  if (data.fromAddress) {
    doc.text(`Von: ${data.fromAddress}`, 20, y);
    y += 4.5;
  }
  if (data.toAddress) {
    doc.text(`Nach: ${data.toAddress}`, 20, y);
    y += 4.5;
  }
  if (data.routeDistanceKm != null) {
    doc.text(`Route: ${data.routeDistanceKm.toFixed(1)} km`, 20, y);
    y += 4.5;
  }
  y += 4;

  doc.setFillColor(...NAVY);
  doc.rect(15, y, pw - 30, 8, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(8);
  doc.text("Position", 20, y + 5.2);
  doc.text("Menge", 105, y + 5.2);
  doc.text("Einzelpreis", 130, y + 5.2);
  doc.text("Gesamt", pw - 20, y + 5.2, { align: "right" });
  y += 10;

  setBrandFont(doc, "normal");
  let striped = false;
  for (const item of data.items) {
    if (y > ph - 80) {
      doc.addPage();
      y = 20;
    }
    if (striped) {
      doc.setFillColor(...LIGHT_BG);
      doc.rect(15, y - 2.8, pw - 30, 7, "F");
    }
    doc.setTextColor(...GRAY);
    doc.text(item.title, 20, y + 1);
    doc.text(String(item.quantity), 105, y + 1);

    const isZeroPrice = item.unitPrice === 0 && item.totalPrice === 0;
    doc.text(isZeroPrice ? "Inklusive" : fmt(item.unitPrice), 130, y + 1);
    doc.setTextColor(...NAVY);
    doc.text(isZeroPrice ? "Im Paket" : fmt(item.totalPrice), pw - 20, y + 1, { align: "right" });

    if (item.description) {
      doc.setTextColor(...GRAY);
      doc.setFontSize(7.5);
      doc.text(item.description, 20, y + 4.5);
      doc.setFontSize(8);
    }
    y += 7;
    striped = !striped;
  }

  y += 2;
  doc.setDrawColor(...BORDER);
  doc.line(15, y, pw - 15, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("Zwischensumme", 20, y);
  doc.setTextColor(...NAVY);
  doc.text(fmt(data.subtotal), pw - 20, y, { align: "right" });
  y += 5.5;
  if (data.discountAmount > 0) {
    doc.setTextColor(...GRAY);
    doc.text("Rabatt", 20, y);
    doc.setTextColor(180, 50, 50);
    doc.text(`-${fmt(data.discountAmount)}`, pw - 20, y, { align: "right" });
    y += 5.5;
  }
  if (data.extraFees > 0) {
    doc.setTextColor(...GRAY);
    doc.text("Manuelle Gebühren", 20, y);
    doc.setTextColor(...NAVY);
    doc.text(fmt(data.extraFees), pw - 20, y, { align: "right" });
    y += 5.5;
  }
  doc.setTextColor(...GRAY);
  doc.text("Netto", 20, y);
  doc.setTextColor(...NAVY);
  doc.text(fmt(data.netto), pw - 20, y, { align: "right" });
  y += 5.5;
  doc.setTextColor(...GRAY);
  doc.text("MwSt. (19%)", 20, y);
  doc.setTextColor(...NAVY);
  doc.text(fmt(data.mwst), pw - 20, y, { align: "right" });
  y += 7;

  doc.setFillColor(...TEAL);
  doc.roundedRect(15, y - 3.5, pw - 30, 12, 3, 3, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(11.5);
  doc.text("Gesamtbetrag", 20, y + 3.8);
  doc.text(fmt(data.totalPrice), pw - 20, y + 3.8, { align: "right" });
  y += 16;

  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(9);
  doc.text("Allgemeine Geschäftsbedingungen", 20, y);
  y += 5;

  doc.setTextColor(...GRAY);
  setBrandFont(doc, "normal");
  doc.setFontSize(8);
  doc.text("Bitte beachten Sie unsere Allgemeinen Geschäftsbedingungen (AGB),", 20, y);
  y += 4;
  doc.text("welche diesem Angebot als separates Dokument beigefügt sind.", 20, y);
  y += 4;
  doc.text("Für Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.", 20, y);
  y += 4;

  if (data.statusNote) {
    doc.setTextColor(...GRAY);
    doc.setFontSize(8);
    setBrandFont(doc, "bold");
    doc.text(`Status: ${data.statusNote}`, 20, y);
    y += 5;
  }

  const fy = ph - 18;
  doc.setDrawColor(...BORDER);
  doc.line(20, fy - 3, pw - 20, fy - 3);
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  setBrandFont(doc, "normal");
  doc.text(
    `${COMPANY_LEGAL.NAME} | ${COMPANY_LEGAL.ADDRESS_LINE_1} | USt-IdNr.: ${COMPANY_LEGAL.VAT_ID}`,
    pw / 2,
    fy, { align: "center" }
  );
  doc.text(
    `Bank: ${COMPANY_BANK.BANK_NAME} | IBAN: ${COMPANY_BANK.IBAN} | BIC: ${COMPANY_BANK.BIC}`,
    pw / 2,
    fy + 4, { align: "center" }
  );
  doc.text("Die vollständigen AGB finden Sie unter: " + CONTACT.WEBSITE_DISPLAY + "/agb", pw / 2, fy + 8, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateSignedContractPDF(data: ContractPDFData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  registerBrandFonts(doc);
  drawBrandHeader(doc, "Dienstleistungsvertrag", "VERTRAG", data.contractNumber);

  y = 56;

  doc.setTextColor(...GRAY);
  setBrandFont(doc, "normal");
  doc.setFontSize(8);
  doc.text(`Vertrag ${data.contractNumber} | Angebot ${data.offerNumber} | Datum: ${new Date().toLocaleDateString("de-DE")}`, 20, y);
  y += 8;

  // ── Vertragsparteien ──
  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(11);
  doc.text("Vertragsparteien", 20, y);
  y += 7;

  const boxH = 28;
  const halfW = (pw - 45) / 2;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(15, y - 2, halfW, boxH, 2, 2, "F");
  doc.roundedRect(20 + halfW, y - 2, halfW, boxH, 2, 2, "F");

  doc.setFontSize(7);
  doc.setTextColor(...TEAL);
  setBrandFont(doc, "bold");
  doc.text("AUFTRAGNEHMER", 19, y + 3);
  doc.text("AUFTRAGGEBER", 24 + halfW, y + 3);

  doc.setFontSize(8.5);
  doc.setTextColor(...NAVY);
  doc.text(COMPANY_LEGAL.NAME, 19, y + 9);
  doc.text(data.customerName, 24 + halfW, y + 9);

  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  doc.setFontSize(7.5);
  doc.text(COMPANY_LEGAL.ADDRESS_LINE_1, 19, y + 13.5);
  doc.text(CONTACT.EMAIL, 19, y + 17.5);
  doc.text(CONTACT.PRIMARY_PHONE_DISPLAY, 19, y + 21.5);

  doc.text(data.customerEmail, 24 + halfW, y + 13.5);
  if (data.customerCompany) doc.text(data.customerCompany, 24 + halfW, y + 17.5);

  y += boxH + 6;

  // ── Leistungsumfang ──
  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(11);
  doc.text("§1 Leistungsumfang", 20, y);
  y += 6;

  doc.setTextColor(...GRAY);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.5);
  doc.text(`Leistung: ${data.serviceSummary}`, 20, y);
  y += 4.5;
  if (data.serviceDate) { doc.text(`Termin: ${data.serviceDate}${data.timeSlot ? ` (${data.timeSlot})` : ""}`, 20, y); y += 4.5; }
  if (data.fromAddress) { doc.text(`Von: ${data.fromAddress}`, 20, y); y += 4.5; }
  if (data.toAddress) { doc.text(`Nach: ${data.toAddress}`, 20, y); y += 4.5; }
  y += 3;

  if (data.items && data.items.length > 0) {
    doc.setFillColor(...NAVY);
    doc.rect(15, y, pw - 30, 7, "F");
    doc.setTextColor(...WHITE);
    setBrandFont(doc, "bold");
    doc.setFontSize(7.5);
    doc.text("Position", 19, y + 4.8);
    doc.text("Menge", 110, y + 4.8);
    doc.text("Preis", 135, y + 4.8);
    doc.text("Gesamt", pw - 20, y + 4.8, { align: "right" });
    y += 9;

    setBrandFont(doc, "normal");
    let striped = false;
    for (const item of data.items) {
      if (y > ph - 80) { doc.addPage(); y = 20; }
      if (striped) { doc.setFillColor(...LIGHT_BG); doc.rect(15, y - 2.5, pw - 30, 6.5, "F"); }
      doc.setTextColor(...GRAY);
      doc.setFontSize(8);
      doc.text(item.title, 19, y + 1);
      doc.text(String(item.quantity), 110, y + 1);
      doc.text(fmt(item.unitPrice), 135, y + 1);
      doc.setTextColor(...NAVY);
      doc.text(fmt(item.totalPrice), pw - 20, y + 1, { align: "right" });
      y += 6.5;
      striped = !striped;
    }
    y += 2;
  }

  // ── Vergütung ──
  doc.setDrawColor(...BORDER);
  doc.line(15, y, pw - 15, y);
  y += 5;

  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(10);
  doc.text("§2 Vergütung", 20, y);
  y += 6;

  doc.setFontSize(8.5);
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  if (data.subtotal != null) { doc.text("Zwischensumme", 20, y); doc.text(fmt(data.subtotal), pw - 20, y, { align: "right" }); y += 4.5; }
  if (data.discountAmount && data.discountAmount > 0) { doc.text("Rabatt", 20, y); doc.setTextColor(180, 50, 50); doc.text(`-${fmt(data.discountAmount)}`, pw - 20, y, { align: "right" }); doc.setTextColor(...GRAY); y += 4.5; }
  doc.text("Netto", 20, y); doc.setTextColor(...NAVY); doc.text(fmt(data.netto), pw - 20, y, { align: "right" }); y += 4.5;
  doc.setTextColor(...GRAY); doc.text("MwSt. (19%)", 20, y); doc.setTextColor(...NAVY); doc.text(fmt(data.mwst), pw - 20, y, { align: "right" }); y += 6;

  doc.setFillColor(...TEAL);
  doc.roundedRect(15, y - 3, pw - 30, 11, 2, 2, "F");
  doc.setTextColor(...WHITE);
  setBrandFont(doc, "bold");
  doc.setFontSize(11);
  doc.text("Gesamtbetrag (brutto)", 20, y + 4);
  doc.text(fmt(data.totalPrice), pw - 20, y + 4, { align: "right" });
  y += 16;

  // ── Bedingungen ──
  if (y > ph - 90) { doc.addPage(); y = 20; }
  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(10);
  doc.text("§3 Vertragsbedingungen", 20, y);
  y += 5;
  doc.setTextColor(...GRAY);
  setBrandFont(doc, "normal");
  doc.setFontSize(7.5);
  const terms = [
    "Die Zahlung erfolgt gemäß den vereinbarten Zahlungsbedingungen (14 Tage nach Rechnungsstellung).",
    "Der Auftraggeber akzeptiert die AGB der SEEL Transport & Reinigung.",
    "Stornierungsgebühren: 7+ Tage: 20%, 3-6 Tage: 40%, 24-48h: 60%, unter 24h: 80% des Auftragswertes.",
    "Es gilt deutsches Recht. Gerichtsstand ist Berlin, soweit gesetzlich zulässig.",
  ];
  terms.forEach(t => { doc.text(t, 20, y); y += 4; });
  y += 6;

  // ── Digitale Signatur ──
  if (y > ph - 65) { doc.addPage(); y = 20; }
  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.setFontSize(10);
  doc.text("§4 Digitale Signatur", 20, y);
  y += 6;
  doc.setTextColor(...GRAY);
  setBrandFont(doc, "normal");
  doc.setFontSize(8.5);
  doc.text(`Unterzeichnet von: ${data.signedByName}`, 20, y); y += 4.5;
  doc.text(`Zeitpunkt: ${data.signedAt}`, 20, y); y += 4.5;
  if (data.ipAddress) { doc.text(`IP-Adresse: ${data.ipAddress}`, 20, y); y += 4.5; }
  doc.text("Rechtsverbindliche digitale Unterschrift nach eIDAS-Verordnung", 20, y); y += 6;

  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.3);
  doc.roundedRect(18, y, 100, 32, 3, 3, "S");
  doc.setFontSize(6.5);
  doc.setTextColor(...GRAY);
  doc.text("Unterschrift des Auftraggebers:", 20, y + 4);

  if (data.signatureDataUrl) {
    try { doc.addImage(data.signatureDataUrl, "PNG", 22, y + 6, 92, 22); } catch { doc.text("Unterschrift konnte nicht dargestellt werden", 30, y + 18); }
  } else {
    doc.setFontSize(14);
    doc.setTextColor(...NAVY);
    doc.text(data.signedByName, 30, y + 22);
  }

  doc.setDrawColor(...NAVY);
  doc.roundedRect(125, y, 68, 32, 3, 3, "S");
  doc.setFontSize(6.5);
  doc.setTextColor(...GRAY);
  doc.text("Auftragnehmer:", 127, y + 4);
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  setBrandFont(doc, "bold");
  doc.text(COMPANY_LEGAL.NAME, 129, y + 14);
  setBrandFont(doc, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text("Autorisierter Vertreter", 129, y + 20);
  doc.text(`Berlin, ${new Date().toLocaleDateString("de-DE")}`, 129, y + 25);

  // ── Footer ──
  const fy = ph - 22;
  doc.setDrawColor(...BORDER);
  doc.line(15, fy - 6, pw - 15, fy - 6);
  doc.setFontSize(6.5);
  doc.setTextColor(...GRAY);
  doc.text(`${COMPANY_LEGAL.NAME} | ${COMPANY_LEGAL.ADDRESS_LINE_1} | USt-IdNr.: ${COMPANY_LEGAL.VAT_ID}`, pw / 2, fy - 1, { align: "center" });
  doc.text(`Bank: ${COMPANY_BANK.BANK_NAME} | IBAN: ${COMPANY_BANK.IBAN} | BIC: ${COMPANY_BANK.BIC}`, pw / 2, fy + 3, { align: "center" });
  doc.text(`${CONTACT.EMAIL} | ${CONTACT.PRIMARY_PHONE_DISPLAY} | ${CONTACT.WEBSITE_DISPLAY}`, pw / 2, fy + 7, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateInvoicePDF(data: {
  invoiceNumber: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  service: string;
  date: string;
  netto: number;
  mwst: number;
  total: number;
  items: { description: string; amount: number }[];
  dueDate: string;
}): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  registerBrandFonts(doc);
  drawBrandHeader(doc, "Professionelle Rechnung", "RECHNUNG", data.invoiceNumber);

  y = 58;

  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  setBrandFont(doc, "normal");
  doc.text(`Rechnungsdatum: ${new Date().toLocaleDateString("de-DE")} |  Fällig: ${data.dueDate} |  Buchung: ${data.orderNumber}`, 20, y);
  y += 12;

  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  setBrandFont(doc, "bold");
  doc.text("Rechnungsempfaenger", 20, y);
  y += 7;
  doc.setFontSize(9);
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  doc.text(data.customerName, 20, y);
  y += 5;
  if (data.customerCompany) {
    doc.text(data.customerCompany, 20, y);
    y += 5;
  }
  doc.text(data.customerEmail, 20, y);
  y += 10;

  // Table
  doc.setFillColor(...NAVY);
  doc.rect(15, y, pw - 30, 8, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  setBrandFont(doc, "bold");
  doc.text("Beschreibung", 20, y + 5.5);
  doc.text("Betrag", pw - 20, y + 5.5, { align: "right" });
  y += 10;

  setBrandFont(doc, "normal");
  data.items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 249, 251);
      doc.rect(15, y - 3, pw - 30, 7, "F");
    }
    doc.setTextColor(...GRAY);
    doc.text(item.description, 20, y + 1);
    doc.setTextColor(...NAVY);
    doc.text(fmt(item.amount), pw - 20, y + 1, { align: "right" });
    y += 7;
  });

  y += 4;
  doc.setDrawColor(...BORDER);
  doc.line(15, y, pw - 15, y);
  y += 6;

  doc.setTextColor(...GRAY);
  doc.setFontSize(9);
  doc.text("Netto", 20, y);
  doc.setTextColor(...NAVY);
  doc.text(fmt(data.netto), pw - 20, y, { align: "right" });
  y += 6;
  doc.setTextColor(...GRAY);
  doc.text("MwSt. (19%)", 20, y);
  doc.setTextColor(...NAVY);
  doc.text(fmt(data.mwst), pw - 20, y, { align: "right" });
  y += 8;

  doc.setFillColor(...TEAL);
  doc.roundedRect(15, y - 4, pw - 30, 14, 3, 3, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(12);
  setBrandFont(doc, "bold");
  doc.text("Rechnungsbetrag", 20, y + 5);
  doc.text(fmt(data.total), pw - 20, y + 5, { align: "right" });
  y += 20;

  doc.setTextColor(...NAVY);
  doc.setFontSize(9);
  setBrandFont(doc, "bold");
  doc.text("Zahlungsinformationen", 20, y);
  y += 5;
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  const bankLines = [
    `Zahlungsziel: ${data.dueDate}`,
    `Kontoinhaber: ${COMPANY_BANK.ACCOUNT_HOLDER}`,
    `Bank: ${COMPANY_BANK.BANK_NAME}`,
    `IBAN: ${COMPANY_BANK.IBAN}`,
    `BIC: ${COMPANY_BANK.BIC}`,
    `Verwendungszweck: ${data.invoiceNumber}`,
  ];
  bankLines.forEach(l => {
    doc.text(l, 20, y);
    y += 4;
  });

  const fy = ph - 22;
  doc.setDrawColor(...BORDER);
  doc.line(20, fy - 5, pw - 20, fy - 5);
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text(
    `${COMPANY_LEGAL.NAME} | ${COMPANY_LEGAL.ADDRESS_LINE_1} | USt-IdNr.: ${COMPANY_LEGAL.VAT_ID}`,
    pw / 2, fy, { align: "center" }
  );
  doc.text(
    `Bank: ${COMPANY_BANK.BANK_NAME} | IBAN: ${COMPANY_BANK.IBAN} | BIC: ${COMPANY_BANK.BIC}`,
    pw / 2, fy + 4, { align: "center" }
  );
  doc.text(`${CONTACT.EMAIL} | ${CONTACT.PRIMARY_PHONE_DISPLAY}`, pw / 2, fy + 8, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateAgbPDF(): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  registerBrandFonts(doc);
  drawBrandHeader(doc, "Allgemeine Geschaeftsbedingungen", "AGB", "v1.0");

  let y = 56;

  setBrandFont(doc, "bold");
  doc.setTextColor(...NAVY);
  doc.setFontSize(14);
  doc.text("Allgemeine Geschaeftsbedingungen (AGB)", 20, y);
  y += 7;
  doc.setFontSize(10);
  setBrandFont(doc, "normal");
  doc.setTextColor(...GRAY);
  doc.text("SEEL Transport & Reinigung", 20, y);
  y += 8;

  const paragraphs = [
    "1. Geltungsbereich: Diese AGB gelten für alle Leistungen von SEEL Transport & Reinigung gegenüber Verbraucherinnen, Verbrauchern und Unternehmen.",
    "2. Vertragsschluss: Ein Vertrag kommt erst durch schriftliche Freigabe des Angebots und anschließende Vertragsbestätigung zustande.",
    "3. Leistungsumfang: Maßgeblich sind die Positionen im freigegebenen Angebot einschließlich dokumentierter Zusatzleistungen.",
    "4. Preise und Zahlung: Alle Preise verstehen sich in Euro. Sofern nicht anders ausgewiesen, enthalten sie 19 % MwSt.",
    "5. Stornierung: Stornierungsbedingungen gemäß AGB: bis 7 Tage vor Termin 20 %, 6–3 Tage 40 %, 48–24 Stunden 60 %, unter 24 Stunden 80 % des Auftragswerts.",
    "6. Haftung: Es gelten die gesetzlichen Haftungsregelungen; bei Umzügen zusätzlich die einschlägigen Bestimmungen des HGB.",
    "7. Höhere Gewalt: Bei höherer Gewalt oder behördlichen Maßnahmen können Termine angepasst werden, ohne dass Schadensersatzansprüche entstehen.",
    "8. Datenschutz: Es gelten die Datenschutzhinweise auf der Website.",
    "9. Schlussbestimmungen: Es gilt deutsches Recht. Gerichtsstand ist, soweit zulaessig, Deutschland.",
  ];

  setBrandFont(doc, "normal");
  doc.setFontSize(9);
  for (const p of paragraphs) {
    const lines = doc.splitTextToSize(p, pw - 40);
    if (y + lines.length * 4 > ph - 30) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines, 20, y);
    y += lines.length * 4 + 4;
  }

  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(
    `${COMPANY_LEGAL.NAME} | USt-IdNr.: ${COMPANY_LEGAL.VAT_ID} | ${COMPANY_BANK.BANK_NAME} | IBAN ${COMPANY_BANK.IBAN}`,
    pw / 2,
    ph - 10, { align: "center" }
  );

  return Buffer.from(doc.output("arraybuffer"));
}
