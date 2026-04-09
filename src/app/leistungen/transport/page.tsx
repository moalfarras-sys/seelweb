import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Möbeltransport Berlin – Schnell, sicher und transparent",
  description:
    "Transport-Service in Berlin für Möbel, Einzelstücke, Geräte und gewerbliche Lieferfahrten. Transparente Kilometerkalkulation und versicherter Transport.",
  path: "/leistungen/transport",
});

const benefits = [
  "Transparente Kilometerkalkulation ohne versteckte Kosten",
  "Versicherter Transport nach HGB §451e",
  "Optionale Tragehilfe und Möbelmontage",
  "Kurzfristige City-Transporte möglich",
  "Geeignet für Privat- und Gewerbekunden",
  "Klare Terminfenster statt unpräziser Zusagen",
];

const includedServices = [
  "Einzelmöbel und schwere Gegenstände",
  "Kurzfristige City-Transporte",
  "Gewerbelieferungen und Warenfahrten",
  "Schwerlast wie Waschmaschinen oder Klaviere",
  "Optionale Montage und Demontage",
  "Zwischenlagerung auf Wunsch",
];

const faqItems = [
  {
    question: "Was kann transportiert werden?",
    answer:
      "Einzelmöbel, schwere Gegenstände wie Waschmaschinen oder Klaviere, Gerätelieferungen und gewerbliche Waren. Auf Wunsch mit Montage- und Tragehilfe.",
  },
  {
    question: "Wie wird der Preis für Transporte berechnet?",
    answer:
      "Transporte kalkulieren wir nach Distanz, Zeitaufwand und optionalen Leistungen wie Tragehilfe oder Montage. Sie erhalten vorab ein transparentes Angebot.",
  },
  {
    question: "Sind kurzfristige Transporte möglich?",
    answer:
      "Ja. Für dringende City-Transporte bieten wir priorisierte Disposition, teils innerhalb von 24 Stunden, abhängig von der Verfügbarkeit.",
  },
];

const relatedLinks = [
  { href: "/leistungen/umzug-berlin", label: "Umzugsfirma Berlin" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
];

export default async function TransportPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="transport-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Transport-Service in Berlin"
          title="Möbeltransport Berlin – schnell und sicher"
          intro="Schneller und sicherer Transport für private und gewerbliche Aufträge. Ideal für Möbel, Einzeltransporte, Geräte und terminkritische Lieferungen in Berlin und Brandenburg – mit klarer Preisstruktur und sauberer Kommunikation."
          highlights={["Kurzfristige Transporte", "Mit Tragehilfe", "Privat und gewerblich"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.umzugStandard)}
          priceHint="Mindestabnahme 2 Stunden. Zusätzlich kalkulieren wir Fahrstrecke, Stockwerke, Tragewege und optionale Leistungen nachvollziehbar mit ein."
          primaryCta={{ href: "/buchen?service=MOVING", label: "Transport anfragen" }}
          secondaryCta={{ href: "/kontakt?subject=Festpreisanfrage%20-%20Transport", label: "Festpreis anfragen" }}
          closingTitle="Transport ohne unnötige Reibung"
          closingText="Teilen Sie uns Abholort, Ziel, Maße und gewünschtes Zeitfenster mit. Wir melden uns mit einem realistischen Ablauf und einem klaren Preisrahmen zurück."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
