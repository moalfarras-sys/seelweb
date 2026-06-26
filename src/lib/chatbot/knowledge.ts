import type { BotAction } from "./types";

export const PRICES = {
  privatumzug: "ab 79 €/Std. (inkl. 2 Mitarbeiter)",
  expressumzug: "ab 99 €/Std. (inkl. 2 Mitarbeiter)",
  firmenumzug: "ab 89 €/Std. (inkl. 2 Mitarbeiter)",
  reinigung: "ab 34 €/Std.",
  entruempelung: "ab 59 €/Std.",
} as const;

export const CONTACT_INFO = {
  phone: "+49 172 8003410",
  phoneLink: "tel:+491728003410",
  phone2: "+49 160 7746966",
  phone2Link: "tel:+491607746966",
  email: "info@seeltransport.de",
  emailLink: "mailto:info@seeltransport.de",
  whatsappLink: "https://wa.me/491728003410?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20Ihre%20Dienste.",
  bookingLink: "/buchen",
  pricesLink: "/preise",
  contactLink: "/kontakt",
} as const;

function action(label: string, url: string, variant: BotAction["variant"] = "secondary"): BotAction {
  return { label, url, variant };
}

function primary(label: string, url: string): BotAction {
  return { label, url, variant: "primary" };
}

function secondary(label: string, url: string): BotAction {
  return { label, url, variant: "secondary" };
}

function whatsapp(label: string, url: string): BotAction {
  return { label, url, variant: "whatsapp" };
}

interface KnowledgeEntry {
  keywords: string[];
  misspellings: string[];
  answer: string;
  actions: BotAction[];
}

const K: Record<string, KnowledgeEntry> = {
  privatumzug: {
    keywords: ["privatumzug", "privat", "wohnungsumzug", "wohnung", "umzug", "apartment", "eigentum", "einzel", "möbeltransport"],
    misspellings: ["privat umzug", "prvat", "privater", "umzg", "umzugk", "wohung", "apartmen", "einzug", "auszug", "einziehen", "ausziehen"],
    answer: `🏠 **Privatumzug** – ${PRICES.privatumzug}

Wir kümmern uns um Ihren Umzug zuverlässig und strukturiert – vom Tragen bis zum sicheren Transport. Der Endpreis hängt von Volumen, Etage, Aufzug, Entfernung und Aufwand ab.

Jetzt ein kostenloses Angebot anfragen und direkt buchen:`,
    actions: [
      primary("📋 Angebot anfragen", CONTACT_INFO.bookingLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
    ],
  },

  expressumzug: {
    keywords: ["expressumzug", "express", "schnell", "dringend", "sofort", "kurzfristig", "eilig", "notfall", "heute noch", "morgen früh"],
    misspellings: ["expres", "ekspress", "schnel", "dringen", "kurzfris", "eilige", "sofot", "express umzug"],
    answer: `⚡ **Expressumzug** – ${PRICES.expressumzug}

Für kurzfristige oder eilige Umzüge – wir sind auch heute noch für Sie da! Bitte nennen Sie uns Termin, Abholort und Zielort.

Direkt anfragen und loslegen:`,
    actions: [
      primary("🚀 Jetzt buchen", CONTACT_INFO.bookingLink),
      whatsapp("💬 WhatsApp (schnell)", CONTACT_INFO.whatsappLink),
      secondary("📞 Sofort anrufen", CONTACT_INFO.phoneLink),
    ],
  },

  firmenumzug: {
    keywords: ["firmenumzug", "firma", "firmen", "büro", "büroumzug", "office", "gewerbe", "business", "unternehmen", "geschäft", "gewerblich"],
    misspellings: ["firmen umzug", "büro umzug", "gewerb", "geschäftsumzug", "unternehmn", "offic", "büroumzg"],
    answer: `🏢 **Firmen- & Büroumzug** – ${PRICES.firmenumzug}

Wir unterstützen Firmen, Büros und Gewerbekunden bei einem ruhigen und organisierten Ablauf – inklusive Transport, Demontage und Montage nach Absprache.

Angebot für Ihr Unternehmen anfragen:`,
    actions: [
      primary("📋 Firmenangebot", CONTACT_INFO.bookingLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Geschäftskunden-Hotline", CONTACT_INFO.phoneLink),
      secondary("✉️ E-Mail", CONTACT_INFO.emailLink),
    ],
  },

  reinigung: {
    keywords: ["reinigung", "reinig", "putzen", "sauber", "endreinig", "übergabe", "kaution", "wohnungsreinigung", " büroreinigung", "kitareinigung", "praxisreinigung", "schulreinigung", "gastro"],
    misspellings: ["reinigun", "reinigug", "putz", "saubr", "endreinigung", "endreinigug", "kaution zurück", "wohnungsreinigug", "büroreinigug"],
    answer: `🧹 **Reinigung & Endreinigung** – ${PRICES.reinigung}

Professionelle Reinigung für Wohnungen, Häuser, Büros und Übergaben. Ideal vor Wohnungsabgabe oder nach einem Umzug.

Reinigung direkt anfragen:`,
    actions: [
      primary("📋 Reinigung buchen", CONTACT_INFO.bookingLink),
      secondary("🏠 Wohnungsreinigung", "/leistungen/wohnungsreinigung"),
      secondary("🏢 Büroreinigung", "/leistungen/bueroreinigung"),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
    ],
  },

  entruempelung: {
    keywords: ["entrümpelung", "entruempelung", "entsorgung", "sperrmüll", "keller", "dachboden", "räumung", "haushaltsauflösung", "ausmisten"],
    misspellings: ["entrumplung", "entrümpel", "entsorg", "sperrmuell", "keler", "dachbodenräum", "haushaltsauflös", "ausmist", "räumng", "entruempelng"],
    answer: `🗑️ **Entrümpelung & Entsorgung** – ${PRICES.entruempelung}

Wir übernehmen Entrümpelungen von Wohnungen, Kellern, Dachböden und Gewerbeflächen inklusive fachgerechter Entsorgung.

Kostenlos und unverbindlich anfragen:`,
    actions: [
      primary("📋 Entrümpelung anfragen", CONTACT_INFO.bookingLink),
      secondary("🏢 Gewerbe-Entrümpelung", "/leistungen/entruempelung"),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
    ],
  },

  preise: {
    keywords: ["preis", "preise", "kosten", "was kostet", "wie viel", "wieviel", "tarif", "stundensatz", "teuer", "günstig", "angebot", "angebot", "quote", "calcul"],
    misspellings: ["priese", "koste", "veiel", "wi viel", "teuerer", "günstigster", "ünstig", "tagebot", "angbot", "kalkul"],
    answer: `💶 **Unsere Startpreise**

• Privatumzug – ${PRICES.privatumzug}
• Expressumzug – ${PRICES.expressumzug}
• Firmen-/Büroumzug – ${PRICES.firmenumzug}
• Reinigung – ${PRICES.reinigung}
• Entrümpelung – ${PRICES.entruempelung}

Der Endpreis hängt von Volumen, Etage, Aufzug, Entfernung, Parkmöglichkeit, Datum und Aufwand ab.

Preise im Detail ansehen oder direkt Angebot anfordern:`,
    actions: [
      primary("📋 Angebot anfragen", CONTACT_INFO.bookingLink),
      secondary("💶 Alle Preise", CONTACT_INFO.pricesLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
    ],
  },

  buchen: {
    keywords: ["buchen", "booking", "reservieren", "auftrag", "termin", "bestellen", "aufgeben", "beauftragen", "buchung"],
    misspellings: ["buchn", "reservirn", "auftrg", "bestelen", "beauftreg"],
    answer: `📝 **Jetzt buchen**

Sie können direkt online Ihren Einsatz buchen – einfach, schnell und unverbindlich. Wählen Sie Leistung, Datum und Zeitfenster.

Alternativ erreichen Sie uns per Telefon, WhatsApp oder E-Mail:`,
    actions: [
      primary("📝 Jetzt online buchen", CONTACT_INFO.bookingLink),
      whatsapp("💬 WhatsApp buchen", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
      secondary("✉️ E-Mail", CONTACT_INFO.emailLink),
    ],
  },

  kontakt: {
    keywords: ["kontakt", "anrufen", "telefonnummer", "nummer", "erreichen", "email", "e-mail", "adresse", "wo", "standort", "hotline", "rufen", "anruf"],
    misspellings: ["kontat", "tel", "teleffon", "nummmer", "erreiichen", "mail", "mailadresse", "hotlin", "standrt"],
    answer: `📞 **Kontaktdaten – SEEL Transport & Reinigung**

Wir sind **24/7** für Sie erreichbar:

• 📞 **Telefon:** ${CONTACT_INFO.phone}
• 📞 **Zweitnummer:** ${CONTACT_INFO.phone2}
• ✉️ **E-Mail:** ${CONTACT_INFO.email}
• 💬 **WhatsApp:** Schnell und direkt

Schreiben Sie uns oder rufen Sie an – wir helfen sofort:`,
    actions: [
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
      secondary("✉️ E-Mail schreiben", CONTACT_INFO.emailLink),
      secondary("📋 Kontaktseite", CONTACT_INFO.contactLink),
    ],
  },

  halteverbot: {
    keywords: ["halteverbot", "parkverbot", "haltezone", "parkplatz", "parken", "sondergenehmigung", "straße", "verkehrsleitung"],
    misspellings: ["halteverb", "parkverb", "parkplaz", "parkplz"],
    answer: `🚧 **Halteverbotszone**

Auf Wunsch kann eine temporäre Halteverbotszone für den Umzug organisiert werden. Das sollte rechtzeitig vor dem Termin geplant werden.

Soll das im Angebot berücksichtigt werden?`,
    actions: [
      primary("📋 Angebot mit Halteverbot", CONTACT_INFO.bookingLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
    ],
  },

  versicherung: {
    keywords: ["versicherung", "versicher", "schaden", "haftung", "kaputt", "beschädigung", "sicherheit", "garantie", "verlässlich", "seriös"],
    misspellings: ["versicher", "schadn", "haftpfl", "kaput", "beschädig", "serios"],
    answer: `🛡️ **Versicherung & Haftung**

Unsere Transporte werden sorgfältig durchgeführt. Bei Fragen zu Versicherung oder Haftung klären wir die Details gern persönlich vor Auftragserteilung.

Rufen Sie uns an oder schreiben Sie uns:`,
    actions: [
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("✉️ E-Mail", CONTACT_INFO.emailLink),
    ],
  },

  zahlung: {
    keywords: ["zahlung", "bezahl", "überweisung", "bar", "rechnung", "paypal", "kreditkarte", "sepa", "lastschrift", "raten", "anzahlung"],
    misspellings: ["bezahl", "überweisng", "rechnug", "paypl", "kreditkart", "ratn"],
    answer: `💳 **Zahlungsarten**

Mögliche Zahlungsarten:
• Überweisung
• Barzahlung
• Rechnung
• PayPal auf Anfrage

Die genauen Zahlungsdetails werden im Angebot oder bei der Auftragsbestätigung geklärt.`,
    actions: [
      primary("📋 Angebot anfragen", CONTACT_INFO.bookingLink),
      secondary("💶 Preise ansehen", CONTACT_INFO.pricesLink),
    ],
  },

  montage: {
    keywords: ["montage", "demontage", "möbel", "moebel", "aufbau", "abbau", "schrank", "bett", "küche", "zusammenbauen", "demontieren"],
    misspellings: ["montag", "möbl", "aufbaun", "zusammenbau", "abbun", "demontiren"],
    answer: `🔧 **Möbelmontage & Demontage**

Wir übernehmen nach Absprache Demontage und Montage von Möbeln, Schränken, Betten und Küchen. Das kann direkt mit dem Umzug gebucht werden.

Bitte nennen Sie kurz, welche Möbel montiert werden sollen:`,
    actions: [
      primary("📋 Umzug mit Montage buchen", CONTACT_INFO.bookingLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
    ],
  },

  vorbereitung: {
    keywords: ["vorbereitung", "karton", "kartons", "packen", "einpacken", "vorbereiten", "tipp", "tipps", "ratgeber", "checkliste", "umzugshelfer"],
    misspellings: ["vorbereitng", "kartons packen", "umzugstip", "checklist"],
    answer: `📦 **Umzugsvorbereitung – Tipps**

Empfehlung:
• Kartons nach Zimmern beschriften
• Zerbrechliches separat sichern
• Wichtige Dokumente selbst mitnehmen
• Möbel vorher leerräumen
• Parkmöglichkeit prüfen
• Halteverbotszone organisieren

Auf Wunsch unterstützen wir auch beim Packen und der kompletten Vorbereitung.

Mehr Infos und Hilfe:`,
    actions: [
      primary("📋 Komplett-Umzug buchen", CONTACT_INFO.bookingLink),
      secondary("🏠 Privatumzug", "/leistungen/privatumzug"),
      secondary("🚧 Halteverbotszone", CONTACT_INFO.bookingLink),
    ],
  },

  servicegebiet: {
    keywords: ["berlin", "brandenburg", "potsdam", "region", "gebiet", "bereich", "umgebung", "wo tätig", "einsatzgebiet", " deutschlandweit"],
    misspellings: ["berln", "brandenbrg", "potsam", "einsatzgebit", "deutschlandwit"],
    answer: `📍 **Einsatzgebiet**

Wir sind in **Berlin und Brandenburg** tätig. Deutschlandweite Einsätze auf Anfrage möglich.

Bitte nennen Sie Abholort und Zielort, damit wir die genaue Verfügbarkeit prüfen können:`,
    actions: [
      primary("📋 Angebot anfragen", CONTACT_INFO.bookingLink),
      secondary("🇩🇪 Berlin-Umzug", "/leistungen/umzug-berlin"),
      secondary("🌲 Brandenburg", "/leistungen/umzug-brandenburg"),
      secondary("🇩🇪 Deutschlandweit", "/leistungen/deutschlandweite-umzuege"),
    ],
  },

  rueckruf: {
    keywords: ["rückruf", "rueckruf", "zurückrufen", "anrufen", "callback", "tel", "telefon", "durchwahl", "erreichbar"],
    misspellings: ["ruckruf", "rückrufn", "zurückruf", "anrufen"],
    answer: `📞 **Rückruf anfordern**

Gerne melden wir uns persönlich bei Ihnen! Sie erreichen uns auch direkt:

• 📞 **${CONTACT_INFO.phone}** – 24/7 erreichbar
• 📞 **${CONTACT_INFO.phone2}**
• ✉️ **${CONTACT_INFO.email}**

Klicken Sie hier für direkten Kontakt:`,
    actions: [
      primary("📞 Jetzt anrufen", CONTACT_INFO.phoneLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("✉️ E-Mail", CONTACT_INFO.emailLink),
      secondary("📋 Kontaktseite", CONTACT_INFO.contactLink),
    ],
  },

  reinigung_ende: {
    keywords: ["endreinigung", "endreinigung", "übergabe", "wohnungsabgabe", "kaution", "kaution zurück", "auszug", "eintrag"],
    misspellings: ["endreinigug", "endrenigung", "übergab", "kauton", "wohnungsabgab", "auzug"],
    answer: `🧹 **Endreinigung für Wohnungsübergabe**

Professionelle Endreinigung inklusive:
• Complete Reinigung aller Räume
• Bad & Küche gründlich
• Fensterreinigung auf Anfrage
• Abnahme-ready – Kautionssicher

Endreinigung direkt buchen:`,
    actions: [
      primary("📋 Endreinigung buchen", "/leistungen/endreinigung"),
      primary("📝 Online buchen", CONTACT_INFO.bookingLink),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
    ],
  },

  transport: {
    keywords: ["transport", "lieferung", "holen", "bringen", "abholung", "möbellift", "einzelteile", "schnelltransport"],
    misspellings: ["transprt", "lieferng", "abholug", "bringn", "möbel lif"],
    answer: `🚛 **Transport & Lieferung**

Einzelne Möbel oder komplette Transporte – wir kümmern uns darum. Auch für einzelne Gegenstände oder Express-Lieferungen.

Transport direkt anfragen:`,
    actions: [
      primary("📋 Transport buchen", "/leistungen/transport"),
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
    ],
  },

  oeffnungszeiten: {
    keywords: ["öffnungszeiten", "erreichbar", "wann", "uhrzeit", "öffne", "geschäftszeiten", "arbeitszeit", "wochende", "samstag", "sonntag", "feiertag"],
    misspellings: ["ofnungszeit", "erreibar", "geschäftszeitn", "arbeitzeit"],
    answer: `🕐 **Erreichbarkeit**

Wir sind **24/7** für Sie erreichbar – auch am Wochenende und an Feiertagen!

• 📞 **${CONTACT_INFO.phone}** – Rund um die Uhr
• 📞 **${CONTACT_INFO.phone2}**
• 💬 WhatsApp – schnelle Antwort
• ✉️ **${CONTACT_INFO.email}**

Einsätze nach Vereinbarung. Jetzt anfragen:`,
    actions: [
      whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
      secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
      secondary("✉️ E-Mail", CONTACT_INFO.emailLink),
    ],
  },
};

const FALLBACK_ANSWER = `Danke für Ihre Anfrage! 😊

Ich helfe Ihnen gerne weiter. Wählen Sie eine Option oder beschreiben Sie Ihr Anliegen:

• 🏠 **Umzug** – Privat, Express oder Firma
• 🧹 **Reinigung** – Endreinigung, Büro oder Wohnung
• 🗑️ **Entrümpelung** – Wohnung, Keller, Gewerbe
• 💶 **Preise** – Unsere Startpreise
• 📞 **Kontakt** – Telefon, E-Mail, WhatsApp
• 📋 **Angebot** – Kostenlos und unverbindlich`;

const FALLBACK_ACTIONS: BotAction[] = [
  primary("📋 Angebot anfragen", CONTACT_INFO.bookingLink),
  whatsapp("💬 WhatsApp", CONTACT_INFO.whatsappLink),
  secondary("📞 Anrufen", CONTACT_INFO.phoneLink),
  secondary("💶 Preise", CONTACT_INFO.pricesLink),
];

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[]);
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function fuzzyMatch(input: string, keywords: string[], misspellings: string[]): boolean {
  const terms = input
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[c] ?? c))
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 1);

  for (const term of terms) {
    for (const kw of keywords) {
      const kwNorm = kw.toLowerCase().replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[c] ?? c));
      if (term === kwNorm || kwNorm.includes(term) || term.includes(kwNorm)) {
        return true;
      }
      if (term.length >= 3 && kwNorm.length >= 3) {
        const threshold = Math.max(1, Math.floor(Math.max(term.length, kwNorm.length) * 0.35));
        if (levenshtein(term, kwNorm) <= threshold) {
          return true;
        }
      }
    }

    for (const ms of misspellings) {
      const msNorm = ms.toLowerCase().replace(/[äöüß]/g, (c) => ({ ä: "ae", Ö: "oe", ü: "ue", ß: "ss" }[c] ?? c));
      if (term === msNorm || msNorm.includes(term)) {
        return true;
      }
    }
  }

  return false;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export interface RuleAnswer {
  answer: string;
  actions: BotAction[];
}

export function getRuleAnswer(input: string): RuleAnswer {
  const lower = input.toLowerCase();

  for (const [, data] of Object.entries(K)) {
    if (lower.length === 0) continue;
    if (fuzzyMatch(lower, data.keywords, data.misspellings)) {
      return { answer: data.answer, actions: data.actions };
    }
  }

  return { answer: FALLBACK_ANSWER, actions: FALLBACK_ACTIONS };
}