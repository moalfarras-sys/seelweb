export const CONTACT = {
  PRIMARY_PHONE: "+491728003410",
  PRIMARY_PHONE_DISPLAY: "+49 172 8003410",
  PRIMARY_PHONE_INTERNATIONAL: "00491728003410",

  SECONDARY_PHONE: "+491607746966",
  SECONDARY_PHONE_DISPLAY: "+49 160 7746966",
  SECONDARY_PHONE_INTERNATIONAL: "00491607746966",

  get WHATSAPP_PHONE() {
    return this.PRIMARY_PHONE;
  },
  get WHATSAPP_PHONE_DISPLAY() {
    return this.PRIMARY_PHONE_DISPLAY;
  },
  get WHATSAPP_NUMBER() {
    return this.PRIMARY_PHONE.replace("+", "");
  },

  EMAIL: "info@seeltransport.de",

  CITY: "Berlin",
  COUNTRY: "Deutschland",
  AVAILABILITY: "24/7 für Sie erreichbar",
  SERVICE_REGION: "Berlin, Brandenburg & deutschlandweite Einsätze",

  WEBSITE_URL: "https://seeltransport.de",
  WEBSITE_DISPLAY: "www.seeltransport.de",
} as const;

export const COMPANY_LEGAL = {
  NAME: "SEEL Transport & Reinigung",
  ADDRESS_LINE_1: "Geschäftssitz in Berlin",
  ADDRESS_LINE_2: "",
  LEGAL_REPRESENTATIVE: "LISAVETA AL-SHAMAILEH",
  VAT_ID: "DE454962817",
  TAX_NO: "33/205/02397",
  REGISTER_COURT: "Berlin",
  REGISTER_NO: "",
} as const;

export const COMPANY_BANK = {
  BANK_NAME: "Postbank",
  IBAN: "DE90 1007 1324 0070 0435 00",
  BIC: "DEUTDEDBP31",
  ACCOUNT_HOLDER: "LISAVETA AL-SHAMAILEH",
} as const;

export const WHATSAPP_DEFAULT_MESSAGE = `Hallo,
ich habe Ihre Website besucht und interessiere mich für einen Einsatz.

Bitte senden Sie mir ein Angebot.

Startadresse:
Zieladresse:
Leistungsumfang:
Gewünschtes Datum:

Vielen Dank.`;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.WHATSAPP_NUMBER}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export function whatsappDefaultUrl(): string {
  return whatsappUrl(WHATSAPP_DEFAULT_MESSAGE);
}

export function whatsappBookingUrl(params: {
  service?: string;
  date?: string;
  pickup?: string;
  dropoff?: string;
  notes?: string;
}): string {
  const lines = ["Hallo, ich möchte gerne buchen:"];
  if (params.service) lines.push(`Service: ${params.service}`);
  if (params.date) lines.push(`Datum: ${params.date}`);
  if (params.pickup) lines.push(`Abholung: ${params.pickup}`);
  if (params.dropoff) lines.push(`Lieferung: ${params.dropoff}`);
  if (params.notes) lines.push(`Anmerkungen: ${params.notes}`);
  lines.push("", "Bitte um Rückmeldung. Vielen Dank!");
  return whatsappUrl(lines.join("\n"));
}
