import { COMPANY_LEGAL, CONTACT } from "@/config/contact";

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export function buildContractSignatureEmail(data: {
  customerName: string;
  offerNumber: string;
  contractNumber: string;
  totalPrice: number;
  signUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#edf2f7;">
  <div style="max-width:640px;margin:0 auto;padding:28px 16px;">
    <div style="background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 60px rgba(15,37,80,0.14);border:1px solid #dbe4ef;">
      <div style="background:radial-gradient(circle at top right,#25bcc0 0%,rgba(37,188,192,0.2) 18%,transparent 19%),linear-gradient(135deg,#0f2550 0%,#173664 52%,#0d9ea0 100%);padding:40px 38px 34px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
          <div>
            <p style="margin:0 0 10px;color:#9fd8da;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;">Digitale Vertragsfreigabe</p>
            <h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.1;font-weight:800;">Ihr Vertrag ist zur Unterschrift bereit</h1>
            <p style="margin:14px 0 0;color:#dbeafe;font-size:14px;line-height:1.7;max-width:420px;">
              Wir haben Ihren Auftrag vorbereitet. Sie koennen den Vertrag jetzt sicher online pruefen und rechtsverbindlich unterzeichnen.
            </p>
          </div>
          <div style="min-width:150px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);border-radius:18px;padding:16px 18px;text-align:right;">
            <p style="margin:0 0 6px;color:#d9f9f8;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Vertrag</p>
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;">${data.contractNumber}</p>
          </div>
        </div>
      </div>

      <div style="padding:34px 38px;">
        <p style="margin:0 0 18px;color:#46556b;font-size:15px;line-height:1.8;">
          Sehr geehrte/r <strong style="color:#0f2550;">${data.customerName}</strong>,
          Ihr Auftrag zu Angebot <strong style="color:#0d9ea0;">${data.offerNumber}</strong> wurde intern freigegeben.
          Bitte pruefen Sie den Vertragsinhalt und leisten Sie Ihre digitale Unterschrift ueber den folgenden Button.
        </p>

        <div style="background:linear-gradient(180deg,#f8fbfd 0%,#f1f5f9 100%);border:1px solid #d9e3ee;border-radius:22px;padding:22px 24px;margin:0 0 28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6b7c93;font-size:13px;">Angebotsnummer</td>
              <td style="padding:8px 0;color:#0f2550;font-weight:700;text-align:right;font-size:14px;">${data.offerNumber}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7c93;font-size:13px;">Vertragsnummer</td>
              <td style="padding:8px 0;color:#0f2550;font-weight:700;text-align:right;font-size:14px;">${data.contractNumber}</td>
            </tr>
            <tr>
              <td style="padding:14px 0 0;color:#6b7c93;font-size:13px;border-top:1px solid #dbe4ef;">Gesamtbetrag</td>
              <td style="padding:14px 0 0;color:#0d9ea0;font-weight:900;text-align:right;font-size:28px;border-top:1px solid #dbe4ef;">${fmt.format(data.totalPrice)}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin:0 0 26px;">
          <a href="${data.signUrl}" style="display:inline-block;background:linear-gradient(135deg,#0d9ea0 0%,#0f9ea0 35%,#0f2550 100%);color:#ffffff;text-decoration:none;padding:18px 44px;border-radius:16px;font-weight:800;font-size:17px;letter-spacing:0.02em;box-shadow:0 16px 30px rgba(13,158,160,0.28);">
            Vertrag jetzt online unterschreiben
          </a>
        </div>

        <div style="display:grid;grid-template-columns:1fr;gap:12px;">
          <div style="background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;padding:16px 18px;">
            <p style="margin:0;color:#0f2550;font-size:14px;font-weight:700;">Was passiert danach?</p>
            <p style="margin:8px 0 0;color:#5a6b80;font-size:13px;line-height:1.7;">
              Nach erfolgreicher Unterschrift erhalten Sie den final signierten Vertrag automatisch per E-Mail als PDF fuer Ihre Unterlagen.
            </p>
          </div>
          <div style="background:#fff8e8;border-radius:16px;border:1px solid #f0ddb1;padding:16px 18px;">
            <p style="margin:0;color:#7a6520;font-size:13px;line-height:1.7;">
              <strong>Sicher und nachvollziehbar:</strong> Die digitale Unterzeichnung wird mit Zeitstempel dokumentiert und dem Vertragsdokument eindeutig zugeordnet.
            </p>
          </div>
        </div>
      </div>

      <div style="padding:22px 38px;background:#f8fafc;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#64748b;font-size:12px;line-height:1.7;">
          Rueckfragen:
          <a href="tel:${CONTACT.PRIMARY_PHONE}" style="color:#0d9ea0;font-weight:700;text-decoration:none;">${CONTACT.PRIMARY_PHONE_DISPLAY}</a>
          &nbsp;|&nbsp;
          <a href="mailto:${CONTACT.EMAIL}" style="color:#0d9ea0;font-weight:700;text-decoration:none;">${CONTACT.EMAIL}</a>
          <br />
          ${COMPANY_LEGAL.NAME} | ${CONTACT.WEBSITE_DISPLAY}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function getContractSignatureSubject(offerNumber: string) {
  return `Vertrag zur Online-Unterschrift - ${offerNumber} | SEEL Transport`;
}
