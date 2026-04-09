import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Privatumzug Berlin – Stressfrei und termingerecht",
  description:
    "Privatumzug in Berlin mit verlässlicher Planung, transparenten Preisen, Möbelmontage und versichertem Transport. SEEL Transport organisiert Ihren Wohnungsumzug.",
  path: "/leistungen/privatumzug",
});

const benefits = [
  "Feste Zeitfenster statt unklarer Ankunft",
  "Versicherter Transport nach HGB §451e",
  "Erfahrene Teams mit Berliner Ortskenntnis",
  "Schutzverpackung für empfindliche Möbel und Glas",
  "Montage und Demontage Ihrer Möbel inklusive",
  "Kombination mit Endreinigung und Entrümpelung möglich",
];

const includedServices = [
  "Vorabberatung und individuelle Planung",
  "Be- und Entladen aller Möbel und Kartons",
  "Möbelmontage und -demontage",
  "Schutz für Böden, Türrahmen und Geländer",
  "Halteverbotszone vor beiden Adressen",
  "Fahrzeuge passend zur Wohnungsgröße",
  "Schwerlasttransport für sensible Möbelstücke",
  "Optionale Endreinigung der alten Wohnung",
];

const faqItems = [
  {
    question: "Was kostet ein Privatumzug in Berlin?",
    answer:
      "Privatumzüge starten ab einem transparenten Stundenpreis. Über den Online-Rechner erhalten Sie in wenigen Schritten eine erste Orientierung – das verbindliche Angebot folgt nach Ihrer Anfrage.",
  },
  {
    question: "Ist mein Umzugsgut versichert?",
    answer:
      "Ja. Alle Transporte werden nach HGB §451e durchgeführt. Auf Wunsch beraten wir Sie zusätzlich zu erweiterten Absicherungen.",
  },
  {
    question: "Kann ich Endreinigung und Umzug kombinieren?",
    answer:
      "Ja. Viele Kundinnen und Kunden kombinieren Privatumzug, Endreinigung und Entrümpelung in einem abgestimmten Ablauf, damit die alte Wohnung sauber und übergabefertig bleibt.",
  },
  {
    question: "Wie kurzfristig können Sie einen Umzug übernehmen?",
    answer:
      "Reguläre Umzüge planen wir mit festen Zeitfenstern. Für besonders dringende Fälle bieten wir einen Expressumzug mit kurzfristiger Disposition innerhalb von 24–48 Stunden an.",
  },
  {
    question: "Muss ich Kartons selbst besorgen?",
    answer:
      "Auf Wunsch stellen wir Umzugskartons, Kleiderkisten und Schutzmaterial bereit. Sprechen Sie uns bei der Buchung einfach darauf an.",
  },
];

const internalLinks = [
  { href: "/leistungen/umzug-berlin", label: "Umzug Berlin" },
  { href: "/leistungen/firmenumzug", label: "Firmenumzug" },
  { href: "/leistungen/gewerbe", label: "Gewerbeumzug" },
  { href: "/leistungen/schulumzug", label: "Schulumzug" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/endreinigung", label: "Endreinigung" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
  { href: "/leistungen/umzug-brandenburg", label: "Umzug Brandenburg" },
];

export default async function PrivatumzugPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="privatumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Für Privathaushalte"
          title="Privatumzug Berlin – stressfrei und termingerecht"
          intro="SEEL Transport organisiert Wohnungsumzüge in Berlin mit klarer Taktung, festen Zeitfenstern und sauberer Kommunikation. Vom ersten Karton bis zur letzten Montage behalten Sie den Überblick und wissen jederzeit, was als Nächstes passiert."
          highlights={["Feste Zeitfenster", "Versichert nach HGB §451e", "Berlin und Brandenburg"]}
          benefitsTitle="Ihre Vorteile beim Privatumzug"
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.umzugStandard)}
          priceHint={`Mindestabnahme 2 Stunden. Für besonders dringende Fälle planen wir Expressumzüge ab ${formatPricePerHour(prices.umzugExpress).replace("ab ", "")}.`}
          primaryCta={{ href: "/buchen?service=MOVING", label: "Privatumzug buchen" }}
          secondaryCta={{ href: "/kontakt?subject=Festpreisanfrage%20-%20Privatumzug", label: "Festpreis anfragen" }}
          closingTitle="Privatumzug jetzt sauber planen"
          closingText="Senden Sie uns Wohnfläche, Etage und Wunschdatum. Wir melden uns mit einem strukturierten Ablauf und einem klaren Preisrahmen zurück."
          faqItems={faqItems}
          relatedLinks={internalLinks}
        />
      </main>
    </>
  );
}
