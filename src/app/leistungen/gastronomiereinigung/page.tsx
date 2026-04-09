import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata, buildFaqSchema } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Gastronomiereinigung Berlin – Restaurants, Cafés und Küchen",
  description:
    "Professionelle Gastronomiereinigung in Berlin für Restaurants, Cafés, Bars und Großküchen. HACCP-konforme Küchenreinigung, Gastraumreinigung und flexible Einsatzzeiten nach Betriebsschluss.",
  path: "/leistungen/gastronomiereinigung",
});

const benefits = [
  "HACCP-konforme Küchen- und Gastraumreinigung",
  "Erfahrung mit Restaurants, Cafés, Bars und Kantinen",
  "Reinigung nach Betriebsschluss oder vor Öffnung",
  "Fettreinigung und Entfernung hartnäckiger Verschmutzungen",
  "Lebensmittelkonforme Desinfektionsmittel",
  "Zuverlässige Teams auch an Wochenenden und Feiertagen",
];

const includedServices = [
  "Küche und Zubereitungsbereiche",
  "Gastraum und Sitzflächen",
  "Bar- und Thekenbereiche",
  "Sanitäranlagen und Gäste-WC",
  "Bodenreinigung",
  "Fettfilter und Abzugshauben auf Anfrage",
  "Abfallentsorgung und Mülltrennung",
  "Außenbereich und Terrasse saisonal",
];

const faqItems = [
  {
    question: "Reinigen Sie nach HACCP-Vorgaben?",
    answer:
      "Ja. Unsere Teams kennen die HACCP-Anforderungen und arbeiten mit lebensmittelkonformen Reinigungsmitteln. Die Reinigung wird dokumentiert und kann bei Kontrollen vorgelegt werden.",
  },
  {
    question: "Wann findet die Reinigung statt?",
    answer:
      "Wir reinigen in der Regel nach Betriebsschluss oder vor der Öffnung – also in den Nachtstunden oder am frühen Morgen. Die genauen Zeiten stimmen wir mit Ihrem Betriebsablauf ab.",
  },
  {
    question: "Können Sie auch Abzugshauben und Fettfilter reinigen?",
    answer:
      "Ja. Die Reinigung von Abzugshauben, Fettfiltern und Dunstabzügen bieten wir als Zusatzleistung an. Diese werden in regelmäßigen Intervallen oder bei Bedarf gründlich gereinigt.",
  },
  {
    question: "Arbeiten Sie auch an Wochenenden und Feiertagen?",
    answer:
      "Selbstverständlich. Gastronomie kennt keine freien Tage – deshalb sind auch wir an Wochenenden, Feiertagen und in den Abendstunden im Einsatz.",
  },
];

const relatedLinks = [
  { href: "/leistungen/gewerbereinigung", label: "Gewerbereinigung" },
  { href: "/leistungen/bueroreinigung", label: "Büroreinigung" },
  { href: "/leistungen/praxisreinigung", label: "Praxisreinigung" },
  { href: "/leistungen/kitareinigung", label: "Kita-Reinigung" },
  { href: "/leistungen/schulreinigung", label: "Schulreinigung" },
  { href: "/leistungen/reinigung", label: "Alle Reinigungsleistungen" },
];

export default async function GastronomiereinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="gastronomiereinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Gastronomie"
          title="Gastronomiereinigung in Berlin"
          intro="HACCP-konforme Reinigung für Restaurants, Cafés, Bars und Großküchen in Berlin. Lebensmittelkonforme Reinigungsmittel, erfahrene Teams und flexible Einsatzzeiten nach Betriebsschluss halten Ihre Abläufe sauber und kontrollierbar."
          highlights={["HACCP-konform", "Nach Betriebsschluss", "Auch an Wochenenden"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.reinigungBuero)}
          priceHint="Mindestabnahme 2 Stunden. Küchenintensität, Fettaufwand und Zusatzbereiche wie Terrasse oder Haubensysteme stimmen wir vorab transparent ab."
          primaryCta={{ href: "/kontakt", label: "Angebot anfordern" }}
          secondaryCta={{ href: "/buchen?service=OFFICE_CLEANING", label: "Reinigung anfragen" }}
          closingTitle="Saubere Küche, ruhiger Servicebetrieb"
          closingText="Wir planen Reinigungsfenster so, dass Service und Küchenbetrieb möglichst ungestört bleiben – klar abgestimmt auf Ihre Öffnungszeiten und Ihre Hygienestandards."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
