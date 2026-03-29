import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  COMPANY_BANK,
  COMPANY_LEGAL,
  CONTACT,
} from "@/config/contact";
import type {
  GalleryCategory,
  GalleryItem,
  PublicSiteContent,
  SiteContentData,
} from "@/types/site-content";

const DATA_DIR = path.join(process.cwd(), "data");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const GALLERY_SCAN_DIRS = [
  "images/clean",
  "images",
  "gallery",
  "uploads",
  "uploads/gallery",
];
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const cleanTitles = [
  "Treppenhausreinigung",
  "Fenster- und Rahmenpflege",
  "Büroreinigung mit Sorgfalt",
  "Detailreinigung in Gewerbeflächen",
  "Grundreinigung nach Einsatz",
  "Saubere Oberflächen im Objekt",
  "Maschinelle Bodenpflege",
  "Reinigung mit professionellem Team",
  "Objektpflege im Innenbereich",
  "Endreinigung vor Übergabe",
  "Badezimmerreinigung im Detail",
  "Küchenreinigung mit System",
  "Gründliche Wohnungsreinigung",
  "Saubere Flächen für den Alltag",
  "Intensive Reinigung im Bestand",
  "Professionelle Abschlussreinigung",
];

function nowIso() {
  return new Date().toISOString();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createDefaultSettings(): PublicSiteContent {
  return {
    company: {
      name: COMPANY_LEGAL.NAME,
      addressLine1: COMPANY_LEGAL.ADDRESS_LINE_1,
      addressLine2: COMPANY_LEGAL.ADDRESS_LINE_2,
      city: CONTACT.CITY,
      country: CONTACT.COUNTRY,
      legalRepresentative: COMPANY_LEGAL.LEGAL_REPRESENTATIVE,
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
      serviceRegion: CONTACT.SERVICE_REGION,
    },
    bank: {
      name: COMPANY_BANK.BANK_NAME,
      iban: COMPANY_BANK.IBAN,
      bic: COMPANY_BANK.BIC,
      accountHolder: COMPANY_BANK.ACCOUNT_HOLDER,
    },
    homepage: {
      heroBadge: "Berlin · Brandenburg · deutschlandweite Einsätze",
      heroTitle: "Umzüge, Reinigung und Entrümpelung mit klarer Organisation.",
      heroDescription:
        "SEEL Transport & Reinigung begleitet private und gewerbliche Einsätze mit festen Ansprechpartnern, transparenten Preisen und einem ruhigen, professionellen Ablauf.",
      primaryCtaLabel: "Angebot anfragen",
      secondaryCtaLabel: "Direkt anrufen",
      finalCtaTitle: "Bereit für Ihren nächsten Einsatz?",
      finalCtaDescription:
        "Senden Sie uns Ihre Anfrage online oder sprechen Sie direkt mit uns über Termin, Umfang und Ablauf.",
      galleryEyebrow: "Echte Einsätze",
      galleryTitle: "Ein kuratierter Einblick in laufende Arbeiten und abgeschlossene Projekte.",
      galleryDescription:
        "Keine Stockfotos und keine zufällige Bilderwand. Die Galerie zeigt reale Einsätze aus Umzug, Reinigung und Objektbetreuung mit klarer Auswahl nach Leistungsart.",
    },
    trustBar: [
      { id: "region", label: CONTACT.SERVICE_REGION },
      { id: "availability", label: CONTACT.AVAILABILITY },
      { id: "pricing", label: "Transparente Preise" },
      { id: "insurance", label: "Professionelle und versicherte Abwicklung" },
    ],
    whyChooseUs: [
      "Klare Kommunikation vor, während und nach dem Einsatz.",
      "Saubere Einsatzplanung für Privatkunden, Unternehmen und Institutionen.",
      "Transparente Preisstruktur ohne unklare Standardfloskeln.",
      "Leistungen aus einer Hand: Umzug, Reinigung, Entsorgung und Expressfälle.",
    ],
  };
}

function cleanText(value: string | null | undefined) {
  return (value || "").trim();
}

function normalizeCompany(company: PublicSiteContent["company"]) {
  const rawAddressLine1 = cleanText(company.addressLine1);
  const rawAddressLine2 = cleanText(company.addressLine2);
  const isWeakBerlinPlaceholder = /^(berlin,\s*deutschland|berlin)$/i.test(rawAddressLine1);
  return {
    ...company,
    addressLine1: isWeakBerlinPlaceholder ? "Geschäftssitz in Berlin" : rawAddressLine1,
    addressLine2: /^(berlin,\s*deutschland|berlin)$/i.test(rawAddressLine2) ? "" : rawAddressLine2,
    city: cleanText(company.city) || "Berlin",
    country: cleanText(company.country) || "Deutschland",
    legalRepresentative: cleanText(company.legalRepresentative),
  };
}

function normalizeContact(contact: PublicSiteContent["contact"]) {
  return {
    ...contact,
    availability: cleanText(contact.availability) || "24/7 für Sie erreichbar",
    serviceRegion:
      cleanText(contact.serviceRegion) || "Berlin, Brandenburg & deutschlandweite Einsätze",
  };
}

function normalizeHomepage(homepage: PublicSiteContent["homepage"], contact: PublicSiteContent["contact"]) {
  const heroBadge = cleanText(homepage.heroBadge);
  return {
    ...homepage,
    heroBadge:
      !heroBadge || heroBadge === "Berlin & Brandenburg"
        ? "Berlin · Brandenburg · deutschlandweite Einsätze"
        : heroBadge,
    galleryEyebrow: cleanText(homepage.galleryEyebrow) || "Echte Einsätze",
    galleryTitle:
      cleanText(homepage.galleryTitle) ||
      "Ein kuratierter Einblick in laufende Arbeiten und abgeschlossene Projekte.",
    galleryDescription:
      cleanText(homepage.galleryDescription) ||
      "Keine Stockfotos und keine zufällige Bilderwand. Die Galerie zeigt reale Einsätze aus Umzug, Reinigung und Objektbetreuung mit klarer Auswahl nach Leistungsart.",
  };
}

function normalizeSettings(settings: PublicSiteContent): PublicSiteContent {
  const company = normalizeCompany(settings.company);
  const contact = normalizeContact(settings.contact);
  const homepage = normalizeHomepage(settings.homepage, contact);
  return {
    ...settings,
    company,
    contact,
    homepage,
    trustBar: settings.trustBar.map((item, index) => ({
      id: item.id || `trust-${index + 1}`,
      label:
        (!cleanText(item.label) || cleanText(item.label) === "Berlin & Brandenburg"
          ? [
              contact.serviceRegion,
              contact.availability,
              "Transparente Preise",
              "Professionelle und versicherte Abwicklung",
            ][index]
          : cleanText(item.label)) ||
        [
          contact.serviceRegion,
          contact.availability,
          "Transparente Preise",
          "Professionelle und versicherte Abwicklung",
        ][index] ||
        "",
    })),
    whyChooseUs: settings.whyChooseUs.map((item) => cleanText(item)).filter(Boolean),
  };
}

function inferCategory(filePath: string): GalleryCategory {
  const lower = filePath.toLowerCase();
  if (lower.includes("express")) return "express";
  if (lower.includes("waste") || lower.includes("entsorg") || lower.includes("disposal")) {
    return "entruempelung";
  }
  if (lower.includes("corporate") || lower.includes("office") || lower.includes("government")) {
    return "gewerbe";
  }
  if (lower.includes("clean")) return "reinigung";
  return "umzug";
}

async function scanLikelyGalleryImages() {
  const items: string[] = [];
  for (const dir of GALLERY_SCAN_DIRS) {
    const absoluteDir = path.join(PUBLIC_DIR, dir);
    try {
      const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        const ext = path.extname(entry.name).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) continue;
        items.push(`/${dir}/${entry.name}`.replace(/\\/g, "/"));
      }
    } catch {
      // Ignore missing folders.
    }
  }

  const unique = Array.from(new Set(items));
  unique.sort((a, b) => a.localeCompare(b));
  return unique;
}

async function createDefaultGalleryItems(): Promise<GalleryItem[]> {
  const images = await scanLikelyGalleryImages();
  const preferredClean = images
    .filter((image) => image.includes("/images/clean/"))
    .slice(0, 16);
  const chosen = preferredClean.length === 16 ? preferredClean : images.slice(0, 16);
  const timestamp = nowIso();

  return chosen.map((imageUrl, index) => {
    const category = inferCategory(imageUrl);
    const title =
      category === "reinigung"
        ? cleanTitles[index] || `Reinigung ${index + 1}`
        : category === "umzug"
          ? "Umzug im Einsatz"
          : category === "entruempelung"
            ? "Entrümpelung im Einsatz"
            : category === "express"
              ? "Expressumzug"
              : "Gewerblicher Einsatz";

    return {
      id: randomUUID(),
      title,
      alt: `${title} von SEEL Transport & Reinigung in Berlin`,
      imageUrl,
      storagePath: null,
      category,
      sortOrder: index,
      isVisible: true,
      showOnHomepage: true,
      isFeatured: index === 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}

function normalizeGalleryItems(items: GalleryItem[]) {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({
      ...item,
      sortOrder: index,
      updatedAt: item.updatedAt || nowIso(),
    }));
}

async function ensureFileContent(): Promise<SiteContentData> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await fs.readFile(SITE_CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteContentData>;
    return {
      settings: normalizeSettings({
        ...createDefaultSettings(),
        ...(parsed.settings || {}),
        company: {
          ...createDefaultSettings().company,
          ...(parsed.settings?.company || {}),
        },
        contact: {
          ...createDefaultSettings().contact,
          ...(parsed.settings?.contact || {}),
        },
        bank: {
          ...createDefaultSettings().bank,
          ...(parsed.settings?.bank || {}),
        },
        homepage: {
          ...createDefaultSettings().homepage,
          ...(parsed.settings?.homepage || {}),
        },
        trustBar: parsed.settings?.trustBar || createDefaultSettings().trustBar,
        whyChooseUs: parsed.settings?.whyChooseUs || createDefaultSettings().whyChooseUs,
      }),
      galleryItems: normalizeGalleryItems(parsed.galleryItems || []),
    };
  } catch {
    const seeded: SiteContentData = {
      settings: normalizeSettings(createDefaultSettings()),
      galleryItems: await createDefaultGalleryItems(),
    };
    await fs.writeFile(SITE_CONTENT_FILE, JSON.stringify(seeded, null, 2), "utf-8");
    return seeded;
  }
}

export async function getSiteContent(): Promise<SiteContentData> {
  return ensureFileContent();
}

export async function saveSiteContent(input: SiteContentData) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    SITE_CONTENT_FILE,
    JSON.stringify(
      {
        settings: normalizeSettings(input.settings),
        galleryItems: normalizeGalleryItems(input.galleryItems),
      },
      null,
      2,
    ),
    "utf-8",
  );
}

export async function updateSiteSettings(settings: Partial<PublicSiteContent>) {
  const current = await getSiteContent();
  const next: SiteContentData = {
    ...current,
    settings: normalizeSettings({
      ...current.settings,
      ...settings,
      company: {
        ...current.settings.company,
        ...(settings.company || {}),
      },
      contact: {
        ...current.settings.contact,
        ...(settings.contact || {}),
      },
      bank: {
        ...current.settings.bank,
        ...(settings.bank || {}),
      },
      homepage: {
        ...current.settings.homepage,
        ...(settings.homepage || {}),
      },
      trustBar: settings.trustBar || current.settings.trustBar,
      whyChooseUs: settings.whyChooseUs || current.settings.whyChooseUs,
    }),
  };
  await saveSiteContent(next);
  return next.settings;
}

export async function getPublicSiteSettings() {
  const content = await getSiteContent();
  return content.settings;
}

export async function getGalleryItems() {
  const content = await getSiteContent();
  if (content.galleryItems.length > 0) return normalizeGalleryItems(content.galleryItems);

  const seeded = await createDefaultGalleryItems();
  const next = { ...content, galleryItems: seeded };
  await saveSiteContent(next);
  return seeded;
}

export async function saveGalleryItems(items: GalleryItem[]) {
  const content = await getSiteContent();
  await saveSiteContent({
    ...content,
    galleryItems: items,
  });
}

export async function getHomepageGalleryItems() {
  const items = await getGalleryItems();
  return items.filter((item) => item.isVisible && item.showOnHomepage);
}

export async function upsertGalleryItem(
  item: Omit<GalleryItem, "updatedAt" | "createdAt"> & {
    createdAt?: string;
    updatedAt?: string;
  },
) {
  const items = await getGalleryItems();
  const existingIndex = items.findIndex((entry) => entry.id === item.id);
  const timestamp = nowIso();
  const nextItem: GalleryItem = {
    ...item,
    createdAt: item.createdAt || timestamp,
    updatedAt: timestamp,
  };

  if (existingIndex >= 0) {
    items[existingIndex] = nextItem;
  } else {
    items.push(nextItem);
  }

  await saveGalleryItems(items);
  return nextItem;
}

export async function removeGalleryItem(id: string) {
  const items = await getGalleryItems();
  const item = items.find((entry) => entry.id === id) || null;
  const filtered = items.filter((entry) => entry.id !== id);
  await saveGalleryItems(filtered);
  return item;
}

export function createUploadFileName(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const base = slugify(path.basename(originalName, ext)) || "bild";
  return `${Date.now()}-${base}${ext}`;
}
