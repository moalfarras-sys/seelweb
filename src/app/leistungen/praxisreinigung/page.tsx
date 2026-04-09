import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata, buildFaqSchema } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Praxisreinigung Berlin – Arztpraxis und Zahnarztpraxis",
  description:
    "Professionelle Praxisreinigung in Berlin für Arztpraxen, Zahnarztpraxen und medizinische Einrichtungen. Hygienekonforme Reinigung mit geschulten Teams und dokumentierter Qualitätskontrolle.",
  path: "/leistungen/praxisreinigung",
});

const benefits = [
  "Hygienekonforme Reinigung nach RKI-Empfehlungen",
  "Geschulte Teams mit Erfahrung in medizinischen Einrichtungen",
  "Dokumentierte Reinigungspläne und Qualitätskontrollen",
  "Flexible Reinigungszeiten außerhalb der Sprechstunden",
  "Desinfektion von Kontaktflächen und Wartebereichen",
  "Feste Ansprechpartner für Ihre Praxis",
];

const includedServices = [
  "Desinfizierende Reinigung von Behandlungsräumen",
  "Sanitärbereiche und WC-Anlagen",
  "Wartezimmer und Empfangsbereich",
  "Boden- und Oberflächenreinigung",
  "Kontaktflächendesinfektion",
  "Abfallentsorgung und Mülltrennung",
  "Fensterreinigung innen auf Wunsch",
  "Küchen- und Aufenthaltsräume",
];

const faqItems = [
  {
    question: "Erfüllt die Reinigung die Hygienevorschriften für Arztpraxen?",
    answer:
      "Ja. Unsere Teams arbeiten nach den RKI-Empfehlungen und verwenden geprüfte Desinfektionsmittel. Wir erstellen individuelle Hygienepläne und dokumentieren jede Reinigung nachvollziehbar.",
  },
  {
    question: "Wann findet die Reinigung statt?",
    answer:
      "Wir reinigen bevorzugt außerhalb der Sprechzeiten – frühmorgens, abends oder am Wochenende. Die Zeiten stimmen wir individuell mit Ihrer Praxis ab.",
  },
  {
    question: "Können Sie auch Zahnarztpraxen reinigen?",
    answer:
      "Selbstverständlich. Wir reinigen Zahnarztpraxen, Allgemeinarztpraxen, Fachpraxen und MVZ und kennen die besonderen Anforderungen an Hygiene und Desinfektion in medizinischen Bereichen.",
  },
  {
    question: "Wie wird die Qualität der Reinigung sichergestellt?",
    answer:
      "Jede Reinigung wird anhand einer Checkliste durchgeführt und dokumentiert. Regelmäßige Qualitätskontrollen vor Ort und ein fester Ansprechpartner sichern ein gleichbleibend hohes Niveau.",
  },
];

const relatedLinks = [
  { href: "/leistungen/bueroreinigung", label: "Büroreinigung" },
  { href: "/leistungen/kitareinigung", label: "Kita-Reinigung" },
  { href: "/leistungen/schulreinigung", label: "Schulreinigung" },
  { href: "/leistungen/gewerbereinigung", label: "Gewerbereinigung" },
  { href: "/leistungen/gastronomiereinigung", label: "Gastronomiereinigung" },
  { href: "/leistungen/reinigung", label: "Alle Reinigungsleistungen" },
];

export default async function PraxisreinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="praxisreinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Medizinische Einrichtungen"
          title="Praxisreinigung in Berlin"
          intro="Hygienekonforme Reinigung für Arztpraxen, Zahnarztpraxen und medizinische Einrichtungen. Geschulte Teams, dokumentierte Abläufe und flexible Reinigungszeiten außerhalb der Sprechstunden sorgen für Ruhe im Praxisalltag."
          highlights={["RKI-orientiert", "Dokumentierte Abläufe", "Außerhalb der Sprechzeiten"]}
          benefitsTitle="Warum Praxen uns vertrauen"
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.reinigungBuero)}
          priceHint="Mindestabnahme 2 Stunden. Hygieneintensive Bereiche, Sonderintervalle und Zusatzflächen kalkulieren wir vorab klar mit ein."
          primaryCta={{ href: "/kontakt", label: "Angebot anfordern" }}
          secondaryCta={{ href: "/buchen?service=OFFICE_CLEANING", label: "Reinigung anfragen" }}
          closingTitle="Saubere Praxis, ruhiger Ablauf"
          closingText="Wir stimmen Zeiten, Hygienestandard und Raumtypen sauber mit Ihnen ab und liefern ein Reinigungskonzept, das zum medizinischen Alltag passt."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
