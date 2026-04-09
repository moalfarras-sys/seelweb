import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata, buildFaqSchema } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Kita-Reinigung Berlin – Hygiene für Kindertagesstätten",
  description:
    "Professionelle Kita-Reinigung in Berlin. Kindgerechte Hygiene mit schadstofffreien Reinigungsmitteln, dokumentierten Reinigungsplänen und flexiblen Zeiten außerhalb der Betreuung.",
  path: "/leistungen/kitareinigung",
});

const benefits = [
  "Schadstofffreie, kindgerechte Reinigungsmittel",
  "Reinigung nach den Vorgaben des Infektionsschutzgesetzes",
  "Dokumentierte Reinigungs- und Hygienepläne",
  "Flexible Einsatzzeiten nach Betreuungsende",
  "Erfahrung mit Kindertagesstätten und Betreuungseinrichtungen",
  "Feste Teams, die Ihre Einrichtung kennen",
];

const includedServices = [
  "Gruppenräume und Spielbereiche",
  "Sanitäranlagen und Wickelbereiche",
  "Küche und Essbereich",
  "Garderoben und Eingangsbereiche",
  "Böden und kindgerechte Pflege",
  "Desinfektion von Kontaktflächen und Spielzeug",
  "Abfallentsorgung und Mülltrennung",
  "Schlafräume und Ruhezonen",
];

const faqItems = [
  {
    question: "Welche Reinigungsmittel setzen Sie in Kitas ein?",
    answer:
      "Wir verwenden ausschließlich schadstofffreie, allergikerfreundliche Reinigungsmittel, die für den Einsatz in Kindereinrichtungen geeignet sind.",
  },
  {
    question: "Reinigen Sie auch während der Betreuungszeiten?",
    answer:
      "In der Regel reinigen wir nach Ende der Betreuungszeit, um den Alltag der Kinder nicht zu stören. In Ausnahmefällen sind Teilreinigungen in nicht genutzten Räumen möglich.",
  },
  {
    question: "Erstellen Sie einen individuellen Hygieneplan?",
    answer:
      "Ja. Wir erstellen gemeinsam mit Ihrer Einrichtung einen Reinigungsplan, der die Vorgaben des Infektionsschutzgesetzes berücksichtigt und regelmäßig überprüft wird.",
  },
  {
    question: "Wie häufig sollte eine Kita gereinigt werden?",
    answer:
      "Für Kindertagesstätten empfehlen wir eine tägliche Unterhaltsreinigung. Sanitärbereiche und Küchen sollten besonders gründlich gereinigt werden.",
  },
];

const relatedLinks = [
  { href: "/leistungen/schulreinigung", label: "Schulreinigung" },
  { href: "/leistungen/praxisreinigung", label: "Praxisreinigung" },
  { href: "/leistungen/bueroreinigung", label: "Büroreinigung" },
  { href: "/leistungen/gewerbereinigung", label: "Gewerbereinigung" },
  { href: "/leistungen/gastronomiereinigung", label: "Gastronomiereinigung" },
  { href: "/leistungen/reinigung", label: "Alle Reinigungsleistungen" },
];

export default async function KitareinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="kitareinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Kindertagesstätten"
          title="Kita-Reinigung in Berlin"
          intro="Hygienische Sauberkeit für Kindertagesstätten mit schadstofffreien Reinigungsmitteln, dokumentierten Hygieneplänen und Teams, die die besonderen Anforderungen von Betreuungseinrichtungen kennen."
          highlights={["Kindgerechte Mittel", "Dokumentierte Hygiene", "Nach Betreuungsende"]}
          benefitsTitle="Sicherheit und Hygiene für Ihre Kita"
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.reinigungBuero)}
          priceHint="Mindestabnahme 2 Stunden. Reinigungsfrequenz, sensible Bereiche und Sonderleistungen stimmen wir individuell mit Ihrer Einrichtung ab."
          primaryCta={{ href: "/kontakt", label: "Angebot anfordern" }}
          secondaryCta={{ href: "/buchen?service=OFFICE_CLEANING", label: "Reinigung anfragen" }}
          closingTitle="Kindgerechte Sauberkeit mit ruhigem Ablauf"
          closingText="Wir stimmen Intervalle, sensible Bereiche und Hygienevorgaben gemeinsam mit Ihrer Einrichtung ab – klar, nachvollziehbar und ohne unnötige Störung des Alltags."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
