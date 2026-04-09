import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Deutschlandweite Umzüge – Fernumzug mit klarer Planung",
  description:
    "Deutschlandweite Umzüge von Berlin in jede Region Deutschlands. Geplante Routen, verbindliche Zeitfenster und transparente Preisstruktur von SEEL Transport.",
  path: "/leistungen/deutschlandweite-umzuege",
});

const benefits = [
  "Klare Distanzkalkulation mit nachvollziehbarem Kilometeransatz",
  "Verbindliche Terminfenster mit Status-Updates",
  "Versicherung und Dokumentation inklusive",
  "Routenplanung mit realistischen Lade- und Fahrzeiten",
  "Zwischenlagerung auf Wunsch organisierbar",
  "Berlin als Startpunkt, bundesweit planbar",
];

const includedServices = [
  "Routenplanung und Streckenoptimierung",
  "Be- und Entladeservice vor Ort",
  "Zwischenlagerung auf Wunsch",
  "Möbelmontage und -demontage",
  "Sicheres Verpackungsmaterial",
  "Transportversicherung nach HGB §451e",
];

const faqItems = [
  {
    question: "Wie wird ein Fernumzug preislich kalkuliert?",
    answer:
      "Fernumzüge werden nach Distanz, geschätztem Ladevolumen und Personalaufwand kalkuliert. Sie erhalten ein verbindliches Angebot mit allen Positionen vorab.",
  },
  {
    question: "Bieten Sie auch Zwischenlagerung an?",
    answer:
      "Ja. Wenn Einzugs- und Auszugstermin nicht zusammenfallen, organisieren wir die sichere Zwischenlagerung Ihres Inventars.",
  },
  {
    question: "Wie lange dauert ein deutschlandweiter Umzug?",
    answer:
      "Die Dauer richtet sich nach Strecke und Umfang. Für die meisten innerdeutschen Strecken planen wir ein bis zwei Tage für den reinen Transport plus Be- und Entladezeiten.",
  },
];

const relatedLinks = [
  { href: "/leistungen/umzug-berlin", label: "Umzugsfirma Berlin" },
  { href: "/leistungen/umzug-brandenburg", label: "Umzug Brandenburg" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
];

export default async function DeutschlandweiteUmzuegePage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="fernumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Fernumzug ab Berlin"
          title="Deutschlandweite Umzüge – mit klarer Planung"
          intro="Von Berlin in jede Region Deutschlands: Wir planen Strecke, Ladezeiten, Zwischenstopps und Personal passend zu Ihrem Termin. Verbindliche Zeitfenster und eine transparente Preisstruktur sorgen auch über lange Distanzen für Ruhe im Ablauf."
          highlights={["Bundesweit planbar", "Klare Distanzkalkulation", "Zwischenlagerung möglich"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.umzugStandard)}
          priceHint="Mindestabnahme 2 Stunden. Fernumzüge kalkulieren wir zusätzlich nach Distanz, Ladevolumen und besonderen Zugangsbedingungen."
          primaryCta={{ href: "/buchen?service=MOVING", label: "Fernumzug anfragen" }}
          secondaryCta={{ href: "/kontakt?subject=Festpreisanfrage%20-%20Fernumzug", label: "Festpreis anfragen" }}
          closingTitle="Fernumzug mit realistischem Zeitfenster"
          closingText="Wenn Auszug, Fahrtstrecke und Einzug sauber zusammenspielen, bleibt auch ein langer Umzug planbar. Senden Sie uns Startort, Zielort und Volumen für ein klares Angebot."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
