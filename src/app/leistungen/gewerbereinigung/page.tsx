import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata, buildFaqSchema } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Gewerbereinigung Berlin – Gewerbliche Reinigung für Betriebe",
  description:
    "Gewerbliche Reinigung in Berlin für Produktionsstätten, Lagerhallen, Werkstätten und Gewerbeflächen. Professionelle Industriereinigung mit flexiblen Einsatzzeiten und transparenten Preisen.",
  path: "/leistungen/gewerbereinigung",
});

const benefits = [
  "Erfahrung mit Gewerbe-, Industrie- und Produktionsflächen",
  "Professionelles Equipment für Großflächen",
  "Einhaltung branchenspezifischer Hygienestandards",
  "Flexible Einsatzzeiten auch nachts und am Wochenende",
  "Schlüsselverwaltung und eigenständiger Zugang",
  "Skalierbar für wechselnde Flächengrößen",
];

const includedServices = [
  "Produktions- und Lagerflächen",
  "Werkstätten und Fertigungsbereiche",
  "Büro- und Verwaltungsflächen",
  "Sanitäranlagen und Umkleiden",
  "Teeküchen und Aufenthaltsräume",
  "Industrie- und Hallenböden",
  "Entsorgung von gewerblichem Abfall",
  "Außenbereiche auf Anfrage",
];

const faqItems = [
  {
    question: "Welche Gewerbeobjekte reinigen Sie?",
    answer:
      "Wir reinigen Produktionsstätten, Lagerhallen, Werkstätten, Bürokomplexe, Einzelhandelsflächen und andere Gewerbeobjekte. Unser Equipment ist auf Großflächen und industrielle Anforderungen ausgelegt.",
  },
  {
    question: "Können Sie auch Industrieböden reinigen?",
    answer:
      "Ja. Wir verfügen über professionelle Reinigungsmaschinen für Industrieböden, Beton, Epoxid und andere gewerbliche Bodenbeläge. Grundreinigungen und Versiegelungen bieten wir ebenfalls an.",
  },
  {
    question: "Wie flexibel sind die Einsatzzeiten?",
    answer:
      "Sehr flexibel. Wir reinigen auch nachts, an Wochenenden und Feiertagen – je nachdem, wann es für Ihren Betrieb am besten passt.",
  },
  {
    question: "Ist eine einmalige Grundreinigung möglich?",
    answer:
      "Ja. Neben regelmäßiger Unterhaltsreinigung bieten wir auch einmalige Grundreinigungen an – etwa nach Bauarbeiten, vor einer Inspektion oder bei einem Mieterwechsel.",
  },
];

const relatedLinks = [
  { href: "/leistungen/bueroreinigung", label: "Büroreinigung" },
  { href: "/leistungen/praxisreinigung", label: "Praxisreinigung" },
  { href: "/leistungen/gastronomiereinigung", label: "Gastronomiereinigung" },
  { href: "/leistungen/schulreinigung", label: "Schulreinigung" },
  { href: "/leistungen/kitareinigung", label: "Kita-Reinigung" },
  { href: "/leistungen/reinigung", label: "Alle Reinigungsleistungen" },
];

export default async function GewerbereinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="gewerbereinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Gewerbe und Industrie"
          title="Gewerbereinigung in Berlin"
          intro="Professionelle Reinigung für Gewerbeflächen, Produktionsstätten und Industrieobjekte in Berlin. Leistungsstarkes Equipment, erfahrene Teams und flexible Einsatzzeiten sorgen für einen planbaren Betrieb ohne unnötige Unterbrechung."
          highlights={["Großflächen", "Nachts und am Wochenende", "Industriegeeignet"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.reinigungBuero)}
          priceHint="Mindestabnahme 2 Stunden. Reinigungsfrequenz, Maschinenaufwand und Sonderflächen kalkulieren wir vorab klar mit ein."
          primaryCta={{ href: "/kontakt", label: "Angebot anfordern" }}
          secondaryCta={{ href: "/buchen?service=OFFICE_CLEANING", label: "Reinigung anfragen" }}
          closingTitle="Gewerbereinigung mit belastbarem Ablauf"
          closingText="Wenn Flächengröße, Schichtzeiten und Sicherheitsanforderungen sauber abgestimmt werden, bleibt der Betrieb planbar. Wir erstellen Ihnen ein klares Reinigungskonzept."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
