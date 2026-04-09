import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata, buildFaqSchema } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Büroreinigung Berlin – Regelmäßige Unterhaltsreinigung",
  description:
    "Professionelle Büroreinigung in Berlin für Unternehmen jeder Größe. Regelmäßige Unterhaltsreinigung mit festen Teams, flexiblen Intervallen und transparenten Konditionen.",
  path: "/leistungen/bueroreinigung",
});

const benefits = [
  "Feste Reinigungsteams für gleichbleibende Qualität",
  "Flexible Intervalle – täglich, wöchentlich oder nach Bedarf",
  "Reinigung außerhalb der Geschäftszeiten",
  "Transparente Monatsabrechnung ohne versteckte Kosten",
  "Schlüsselverwaltung und eigenständiger Zugang möglich",
  "Persönlicher Ansprechpartner für Ihr Unternehmen",
];

const includedServices = [
  "Schreibtische und Arbeitsplätze",
  "Böden saugen, wischen und pflegen",
  "Sanitäranlagen und WC-Bereiche",
  "Küche und Teeküche",
  "Gemeinschaftsflächen und Flure",
  "Papierkörbe und Mülltrennung",
  "Kontaktflächen und Türklinken",
  "Innenfenster auf Wunsch",
];

const faqItems = [
  {
    question: "Wie oft sollte ein Büro gereinigt werden?",
    answer:
      "Das hängt von der Nutzung ab. Büros mit viel Publikumsverkehr empfehlen wir täglich. Für kleinere Teams reichen oft zwei bis drei Reinigungen pro Woche. Wir beraten Sie individuell nach Fläche und Nutzung.",
  },
  {
    question: "Können Sie auch außerhalb der Arbeitszeiten reinigen?",
    answer:
      "Ja. Unsere Teams reinigen bevorzugt frühmorgens, abends oder am Wochenende, damit Ihr Tagesgeschäft ungestört bleibt.",
  },
  {
    question: "Wie wird die monatliche Abrechnung gestaltet?",
    answer:
      "Sie erhalten eine transparente Monatsrechnung auf Basis der vereinbarten Leistung und Häufigkeit. Es gibt keine versteckten Zusatzkosten. Änderungen am Leistungsumfang sprechen wir vorab ab.",
  },
  {
    question: "Bringen Sie eigene Reinigungsmittel und Geräte mit?",
    answer:
      "Ja. Unsere Teams arbeiten mit professionellen, umweltfreundlichen Reinigungsmitteln und eigenem Equipment. Falls Sie besondere Anforderungen haben, stimmen wir das vorab ab.",
  },
];

const internalLinks = [
  { href: "/leistungen/praxisreinigung", label: "Praxisreinigung" },
  { href: "/leistungen/kitareinigung", label: "Kita-Reinigung" },
  { href: "/leistungen/schulreinigung", label: "Schulreinigung" },
  { href: "/leistungen/gewerbereinigung", label: "Gewerbereinigung" },
  { href: "/leistungen/gastronomiereinigung", label: "Gastronomiereinigung" },
  { href: "/leistungen/reinigung", label: "Alle Reinigungsleistungen" },
];

export default async function BueroreinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="bueroreinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Für Unternehmen"
          title="Büroreinigung in Berlin"
          intro="Regelmäßige Unterhaltsreinigung für Büros und Geschäftsräume in Berlin. Feste Teams, planbare Intervalle und eine transparente Monatsabrechnung geben Ihnen einen sauberen Standard ohne ständige Abstimmungsrunden."
          highlights={["Feste Teams", "Reinigung außerhalb der Geschäftszeiten", "Planbare Monatsabrechnung"]}
          benefitsTitle="Zuverlässige Büroreinigung für Ihr Unternehmen"
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.reinigungBuero)}
          priceHint="Mindestabnahme 2 Stunden. Intervalle und Zusatzleistungen wie Innenfenster oder Sonderflächen stimmen wir vorab transparent mit Ihnen ab."
          primaryCta={{ href: "/kontakt", label: "Angebot anfordern" }}
          secondaryCta={{ href: "/buchen?service=OFFICE_CLEANING", label: "Reinigung anfragen" }}
          closingTitle="Saubere Büros, produktive Teams"
          closingText="Ein gepflegtes Arbeitsumfeld wirkt professionell und entlastet Ihr Team. Wir erstellen Ihnen ein Reinigungskonzept, das zu Ihren Öffnungszeiten und Flächen passt."
          faqItems={faqItems}
          relatedLinks={internalLinks}
        />
      </main>
    </>
  );
}
