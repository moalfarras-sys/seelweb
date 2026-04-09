import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Gewerbeumzug Berlin – Für Praxen, Läden und laufende Betriebe",
  description:
    "Gewerbeumzug in Berlin für Praxen, Studios, Läden, Kanzleien und gemischt genutzte Flächen. Etappenplanung, sensible Ausstattung und saubere Übergaben von SEEL Transport.",
  path: "/leistungen/gewerbe",
});

const benefits = [
  "Geeignet für Praxen, Studios, Einzelhandel und kleinere Betriebsflächen",
  "Abschnittsweise Verlagerung bei laufendem Tagesgeschäft möglich",
  "Sicherer Umgang mit Inventar, Technik und sensiblen Arbeitsbereichen",
  "Koordination von Zugängen, Ladezonen und Übergaben mit Hausverwaltung",
  "Kombinierbar mit Entrümpelung, Entsorgung und Abschlussreinigung",
  "Fester Ansprechpartner von Vor-Ort-Termin bis Abschluss",
];

const includedServices = [
  "Vor-Ort-Begehung mit Ablaufskizze",
  "Transport von Einrichtung, Geräten und Arbeitsmaterial",
  "Absicherung sensibler Zonen und Laufwege",
  "Teilumzüge in Etappen oder außerhalb der Stoßzeiten",
  "Demontage und Wiederaufbau ausgewählter Möbel",
  "Organisation von Ladezone und Zugängen",
  "Optionaler Abtransport alter Ausstattung",
  "Übergabe- oder Grundreinigung nach dem Umzug",
];

const faqItems = [
  {
    question: "Wie reduzieren Sie Ausfallzeiten im laufenden Betrieb?",
    answer:
      "Wir planen Etappen, Zeitfenster und Laufwege vorab, damit Empfang, Praxisräume oder Verkaufsflächen nur so kurz wie nötig betroffen sind. Auf Wunsch arbeiten wir vor Öffnung, nach Betrieb oder in einzelnen Abschnitten.",
  },
  {
    question: "Welche Gewerbeflächen betreuen Sie?",
    answer:
      "Wir betreuen unter anderem Praxen, Kanzleien, Studios, kleine Büros, Ladenflächen, Agenturen und gemischt genutzte Objekte. Der Ablauf wird an Betrieb, Inventar und Zugänge angepasst.",
  },
  {
    question: "Kann der Gewerbeumzug mit Reinigung oder Entsorgung kombiniert werden?",
    answer:
      "Ja. Gerade bei Praxis- oder Ladenflächen kombinieren wir Umzug, Entsorgung und Übergabereinigung häufig in einem abgestimmten Ablauf. Das spart Abstimmung mit mehreren Dienstleistern.",
  },
  {
    question: "Wie kurzfristig können Sie einen Gewerbeumzug übernehmen?",
    answer:
      "Planbare Gewerbeumzüge stimmen wir idealerweise frühzeitig ab. Wenn Flächen kurzfristig übergeben werden müssen, prüfen wir Express- oder Etappenlösungen und geben schnell Rückmeldung zur Machbarkeit.",
  },
  {
    question: "Was unterscheidet diese Seite vom Firmenumzug?",
    answer:
      "Der Firmenumzug fokussiert sich stärker auf klassische Büro- und Teamstrukturen mit Projektmeilensteinen. Der Gewerbeumzug ist breiter auf Praxen, Läden, Studios und kleinere Betriebsflächen mit gemischten Anforderungen ausgerichtet.",
  },
];

const internalLinks = [
  { href: "/leistungen/firmenumzug", label: "Firmenumzug" },
  { href: "/leistungen/privatumzug", label: "Privatumzug" },
  { href: "/leistungen/umzug-berlin", label: "Umzugsfirma Berlin" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
  { href: "/leistungen/reinigung", label: "Reinigung" },
];

export default async function GewerbePage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="gewerbe-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Für laufende Betriebe und sensible Flächen"
          title="Gewerbeumzug Berlin"
          intro="Für Praxen, Studios, Ladenflächen, Kanzleien und kleinere Unternehmensstandorte organisieren wir Gewerbeumzüge mit klarer Einsatzplanung, geschützten Laufwegen und möglichst kurzer Unterbrechung Ihres Tagesgeschäfts."
          highlights={["Etappenweise möglich", "Mit Entsorgung kombinierbar", "Fester Ansprechpartner"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.gewerbeUmzug)}
          priceHint="Mindestabnahme 2 Stunden. Je nach Projektumfang kalkulieren wir Anfahrt, Trageaufwand und Sonderleistungen nachvollziehbar hinzu."
          primaryCta={{ href: "/buchen?service=MOVING&variant=business", label: "Gewerbeumzug anfragen" }}
          secondaryCta={{ href: "/kontakt?subject=Festpreisanfrage%20-%20Gewerbeumzug", label: "Festpreis anfragen" }}
          closingTitle="Gewerbeumzug mit sauberem Betriebsablauf"
          closingText="Wir planen Übergabe, Transport und Anschlussarbeiten so, dass Ihr Betrieb kontrolliert weiterlaufen kann. Senden Sie uns Fläche, Inventar und Zeitfenster für ein belastbares Angebot."
          faqItems={faqItems}
          relatedLinks={internalLinks}
        />
      </main>
    </>
  );
}
