import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Schulumzug Berlin – Zuverlässig in den Ferien",
  description:
    "Schulumzug Berlin für Schulen, Kitas, Hochschulen und Bildungseinrichtungen mit Ferienplanung, Wochenendfenstern und präziser Taktung.",
  path: "/leistungen/schulumzug",
});

const benefits = [
  "Ferien- und Wochenendumzüge ohne unnötige Unterrichtsstörung",
  "Feste Zeitfenster für Verwaltung, Hausmeister und Schulleitung",
  "Sichere Verlagerung von IT, Whiteboards und Bibliotheksregalen",
  "Koordination von Etappen, Schlüsseln und Raumlisten",
  "Geeignet für Schulen, Kitas, Hochschulen und Bildungsträger",
  "Berlin-weit mit klarer Einsatzplanung",
];

const includedServices = [
  "Transport von Schulbänken, Tafeln und Whiteboards",
  "Verlagerung von IT-Ausstattung",
  "Bibliotheksregale, Schränke und Klassenraummobiliar",
  "Ferienfenster und Wochenendtermine",
  "Abschnittsweise Umzüge bei laufendem Betrieb",
  "Abstimmung mit Hausverwaltung und Schulleitung",
];

const faqItems = [
  {
    question: "Wann führen Sie Schulumzüge durch?",
    answer:
      "Bevorzugt in Ferienzeiten, an Wochenenden oder in abgestimmten Teilabschnitten, damit der Schulbetrieb möglichst nicht gestört wird.",
  },
  {
    question: "Was transportieren Sie typischerweise?",
    answer:
      "Unter anderem Schulbänke, Tafeln, Whiteboards, IT-Ausstattung, Bibliotheksregale, Schränke und komplette Klassenraumausstattung.",
  },
  {
    question: "In welchen Berliner Bezirken sind Sie aktiv?",
    answer:
      "Regelmäßig betreuen wir Einsätze in Mitte, Tempelhof, Neukölln, Pankow und Charlottenburg sowie weitere Standorte in Berlin und Brandenburg.",
  },
];

const relatedLinks = [
  { href: "/leistungen/firmenumzug", label: "Firmenumzug" },
  { href: "/leistungen/umzug-berlin", label: "Umzug Berlin" },
  { href: "/leistungen/reinigung", label: "Reinigung" },
];

export default async function SchulumzugPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="schulumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Für Bildungseinrichtungen"
          title="Schulumzug Berlin – zuverlässig in Ferienfenstern"
          intro="Wir organisieren Schulumzüge für Schulen, Kitas, Hochschulen und andere Bildungseinrichtungen mit präziser Taktung, festen Zeitfenstern und hoher Rücksicht auf den laufenden Betrieb."
          highlights={["Ferienfenster", "IT und Mobiliar", "Berlin und Brandenburg"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.umzugStandard)}
          priceHint="Mindestabnahme 2 Stunden. Für größere Einrichtungen planen wir Etappen, Raumlisten und feste Umzugsfenster vorab."
          primaryCta={{ href: "/buchen?service=MOVING", label: "Schulumzug anfragen" }}
          secondaryCta={{ href: "/kontakt?subject=Festpreisanfrage%20-%20Schulumzug", label: "Festpreis anfragen" }}
          closingTitle="Schulumzug ohne Chaos in der Übergangsphase"
          closingText="Wenn Ferienfenster, Raumlisten und Transport sauber zusammenspielen, bleibt der Wechsel für Teams und Lernende kontrollierbar. Schreiben Sie uns die Eckdaten Ihres Standorts."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
