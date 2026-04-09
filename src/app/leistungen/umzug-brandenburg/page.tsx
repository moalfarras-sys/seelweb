import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Umzugsfirma Brandenburg – Auch außerhalb Berlins",
  description:
    "Umzugsfirma Brandenburg für Potsdam, Falkensee, Oranienburg, Bernau, Cottbus und Eberswalde mit eingespielten Berlin-Brandenburg-Routen.",
  path: "/leistungen/umzug-brandenburg",
});

const benefits = [
  "Berlin-Brandenburg-Routen mit eingespielter Tourenplanung",
  "Klare Fahrfenster statt ungenauer Tagesangaben",
  "Versichert nach HGB §451e",
  "Geeignet für Stadt- und Randlagen mit längeren Anfahrten",
  "Kombinierbar mit Reinigung und Entrümpelung",
  "Saubere Kommunikation vor, während und nach dem Einsatz",
];

const includedServices = [
  "Tourenplanung für Berlin und Brandenburg",
  "Be- und Entladen an beiden Standorten",
  "Möbelmontage und Schutzmaterial",
  "Halteverbotszonen auf Wunsch",
  "Sichere Fahrtrouten mit realistischen Zeitfenstern",
  "Optionale Zusatzleistungen wie Reinigung oder Entsorgung",
];

const faqItems = [
  {
    question: "Betreuen Sie nur Brandenburg oder auch Berlin-Brandenburg-Routen?",
    answer:
      "Ein großer Teil unserer Einsätze verbindet Berlin mit Brandenburg. Genau darauf ist unsere Tourenplanung ausgerichtet.",
  },
  {
    question: "Welche Orte in Brandenburg fahren Sie regelmäßig an?",
    answer:
      "Unter anderem Potsdam, Falkensee, Oranienburg, Bernau, Cottbus und Eberswalde sowie weitere Ziele nach Bedarf.",
  },
  {
    question: "Kann ich den Umzug online anfragen?",
    answer:
      "Ja. Über den Buchungsprozess erhalten Sie eine schnelle Preisorientierung und können den Einsatz direkt anfragen.",
  },
];

const relatedLinks = [
  { href: "/leistungen/umzug-berlin", label: "Umzugsfirma Berlin" },
  { href: "/leistungen/deutschlandweite-umzuege", label: "Fernumzug" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
];

export default async function UmzugBrandenburgPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="umzug-brandenburg-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Berlin und Brandenburg"
          title="Umzugsfirma Brandenburg – auch außerhalb Berlins"
          intro="Wir begleiten Umzüge von Berlin nach Brandenburg und innerhalb Brandenburgs mit klaren Fahrtrouten, genauer Zeitplanung und einem eingespielten Team für regionale wie auch längere Strecken."
          highlights={["Potsdam bis Eberswalde", "Klare Fahrfenster", "Mit Reinigung kombinierbar"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.umzugStandard)}
          priceHint="Mindestabnahme 2 Stunden. Strecke, Ladevolumen und Zusatzleistungen ergänzen wir transparent im Angebot."
          primaryCta={{ href: "/buchen?service=MOVING", label: "Umzug anfragen" }}
          secondaryCta={{ href: "/kontakt?subject=Festpreisanfrage%20-%20Umzug%20Brandenburg", label: "Festpreis anfragen" }}
          closingTitle="Berlin-Brandenburg-Routen sauber abgestimmt"
          closingText="Gerade bei Stadt-Umland-Strecken sind Ladezeiten, Fahrwege und Zugangssituationen entscheidend. Schicken Sie uns Start, Ziel und Umfang für einen klaren Ablaufplan."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
