import { ManualDocumentType } from "@prisma/client";
import { CONTACT } from "@/config/contact";
import { calculateManualDocumentTotals, ManualDocumentItem, normalizeManualItems } from "@/lib/manual-document-utils";
import { nextContractNumber, nextInvoiceNumber, nextOfferNumber } from "@/lib/workflow";

export type ManualDocumentPayload = {
  type: ManualDocumentType;
  status?: string;
  documentNumber?: string;
  customerId?: string | null;
  sourceOrderId?: string | null;
  title: string;
  introText?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerCompany?: string | null;
  serviceSummary: string;
  serviceDate?: string | Date | null;
  timeSlot?: string | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  routeDistanceKm?: number | null;
  issueDate?: string | Date | null;
  validUntil?: string | Date | null;
  dueDate?: string | Date | null;
  taxRate?: number | null;
  currency?: string | null;
  items: ManualDocumentItem[];
  notes?: string | null;
  footerNote?: string | null;
};

export async function nextManualDocumentNumber(type: ManualDocumentType) {
  if (type === "CONTRACT") return nextContractNumber();
  if (type === "INVOICE") return nextInvoiceNumber();
  return nextOfferNumber();
}

export function getManualDocumentLabel(type: ManualDocumentType) {
  if (type === "CONTRACT") return "Vertrag";
  if (type === "INVOICE") return "Rechnung";
  return "Angebot";
}

export function getManualDocumentEmailSubject(type: ManualDocumentType, documentNumber: string, title: string) {
  const label = getManualDocumentLabel(type);
  return `${label} ${documentNumber} - ${title}`;
}

export function buildManualDocumentEmail(options: {
  type: ManualDocumentType;
  customerName: string;
  documentNumber: string;
  title: string;
  totalAmount: number;
  serviceSummary: string;
}) {
  const label = getManualDocumentLabel(options.type);
  const amount = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(options.totalAmount);

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#edf3f7;font-family:Segoe UI,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:28px 14px;">
    <div style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(15,37,80,0.12);">
      <div style="background:linear-gradient(135deg,#0f2550,#0d9ea0);padding:32px 36px;">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.72);margin-bottom:10px;">SEEL Transport & Reinigung</div>
        <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">${label} bereit</h1>
        <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6;">${options.title}</p>
      </div>
      <div style="padding:34px 36px;">
        <p style="margin:0 0 18px;color:#526173;font-size:15px;line-height:1.7;">
          Guten Tag <strong style="color:#0f2550;">${options.customerName}</strong>,<br><br>
          anbei erhalten Sie Ihr ${label.toLowerCase()} <strong>${options.documentNumber}</strong> für <strong>${options.serviceSummary}</strong>.
        </p>
        <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:18px;padding:20px 22px;margin:0 0 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 8px;color:#7b8794;font-size:12px;">Dokument</td>
              <td style="padding:0 0 8px;color:#0f2550;font-size:13px;font-weight:700;text-align:right;">${options.documentNumber}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#7b8794;font-size:12px;">Leistung</td>
              <td style="padding:8px 0;color:#0f2550;font-size:13px;font-weight:700;text-align:right;">${options.serviceSummary}</td>
            </tr>
            <tr>
              <td style="padding:8px 0 0;color:#7b8794;font-size:12px;">Gesamt</td>
              <td style="padding:8px 0 0;color:#0d9ea0;font-size:20px;font-weight:800;text-align:right;">${amount}</td>
            </tr>
          </table>
        </div>
        <p style="margin:0;color:#6b7787;font-size:14px;line-height:1.6;">
          Das PDF finden Sie im Anhang. Bei Fragen erreichen Sie uns unter
          <a href="mailto:${CONTACT.EMAIL}" style="color:#0d9ea0;text-decoration:none;">${CONTACT.EMAIL}</a>
          oder telefonisch unter
          <a href="tel:${CONTACT.PRIMARY_PHONE}" style="color:#0d9ea0;text-decoration:none;">${CONTACT.PRIMARY_PHONE_DISPLAY}</a>.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
