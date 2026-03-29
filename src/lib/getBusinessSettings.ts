import { CONTACT, COMPANY_LEGAL, COMPANY_BANK } from "@/config/contact";

export type BusinessSettings = {
  company: {
    name: string;
    address: string;
    city: string;
    country: string;
    vatId: string;
    taxNo: string;
    registerCourt: string;
    registerNo: string;
  };
  contact: {
    primaryPhone: string;
    primaryPhoneDisplay: string;
    secondaryPhone: string;
    secondaryPhoneDisplay: string;
    email: string;
    whatsappNumber: string;
    websiteUrl: string;
    websiteDisplay: string;
    availability: string;
  };
  bank: {
    name: string;
    iban: string;
    bic: string;
    accountHolder: string;
  };
  trustBadges: {
    badge1: string;
    badge2: string;
    badge3: string;
  };
};

let cachedSettings: BusinessSettings | null = null;

export function getBusinessSettings(): BusinessSettings {
  if (cachedSettings) return cachedSettings;

  cachedSettings = {
    company: {
      name: COMPANY_LEGAL.NAME,
      address: COMPANY_LEGAL.ADDRESS_LINE_1,
      city: CONTACT.CITY,
      country: CONTACT.COUNTRY,
      vatId: COMPANY_LEGAL.VAT_ID,
      taxNo: COMPANY_LEGAL.TAX_NO,
      registerCourt: COMPANY_LEGAL.REGISTER_COURT,
      registerNo: COMPANY_LEGAL.REGISTER_NO,
    },
    contact: {
      primaryPhone: CONTACT.PRIMARY_PHONE,
      primaryPhoneDisplay: CONTACT.PRIMARY_PHONE_DISPLAY,
      secondaryPhone: CONTACT.SECONDARY_PHONE,
      secondaryPhoneDisplay: CONTACT.SECONDARY_PHONE_DISPLAY,
      email: CONTACT.EMAIL,
      whatsappNumber: CONTACT.WHATSAPP_NUMBER,
      websiteUrl: CONTACT.WEBSITE_URL,
      websiteDisplay: CONTACT.WEBSITE_DISPLAY,
      availability: CONTACT.AVAILABILITY,
    },
    bank: {
      name: COMPANY_BANK.BANK_NAME,
      iban: COMPANY_BANK.IBAN,
      bic: COMPANY_BANK.BIC,
      accountHolder: COMPANY_BANK.ACCOUNT_HOLDER,
    },
    trustBadges: {
      badge1: "Zuverlässiger Service in Berlin & Brandenburg",
      badge2: "Flexible Termine auch kurzfristig",
      badge3: "Transparente Preise & schnelle Kommunikation",
    },
  };

  return cachedSettings;
}

export function invalidateBusinessSettings() {
  cachedSettings = null;
}
