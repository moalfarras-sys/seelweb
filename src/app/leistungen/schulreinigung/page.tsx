import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata, buildFaqSchema } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Schulreinigung Berlin – Professionelle Reinigung für Schulen",
  description:
    "Professionelle Schulreinigung in Berlin. Hygienische Reinigung von Klassenräumen, Sporthallen und Sanitäranlagen mit erfahrenen Teams und dokumentierten Reinigungsplänen.",
  path: "/leistungen/schulreinigung",
});

const benefits = [
  "Erfahrung mit Schulen und Bildungseinrichtungen",
  "Reinigung nach Unterrichtsende oder in den Ferien",
  "Hygienepläne gemäß Infektionsschutzgesetz",
  "Großflächenreinigung mit professionellem Equipment",
  "Feste Teams mit Sicherheitsüberprüfung",
  "Skalierbar für einzelne Gebäude oder ganze Schulkomplexe",
];

const includedServices = [
  "Klassenräume und Fachräume",
  "Sporthallen und Umkleidekabinen",
  "Sanitäranlagen und WC-Bereiche",
  "Mensen und Essbereiche",
  "Flure, Treppenhäuser und Eingangsbereiche",
  "Lehrerzimmer und Verwaltungsräume",
  "Desinfektion von Kontaktflächen",
  "Grundreinigung in Ferienzeiten",
];

const faqItems = [
  {
    question: "Wann findet die Schulreinigung statt?",
    answer:
      "Die Unterhaltsreinigung erfolgt in der Regel nach Unterrichtsende, damit der Schulbetrieb nicht beeinträchtigt wird. Grundreinigungen und Intensivreinigungen planen wir bevorzugt in die Ferien.",
  },
  {
    question: "Können Sie auch Sporthallen und Mensen reinigen?",
    answer:
      "Ja. Wir reinigen alle Bereiche einer Schule – von Klassenräumen über Sporthallen bis hin zu Mensen und Verwaltungsbereichen. Für Sporthallenböden setzen wir geeignete Pflegemittel ein.",
  },
  {
    question: "Wie stellen Sie die Hygiene in Sanitäranlagen sicher?",
    answer:
      "Sanitäranlagen werden bei jedem Reinigungseinsatz desinfiziert. Wir verwenden professionelle Desinfektionsmittel und arbeiten mit Checklisten, um eine lückenlose Hygiene zu gewährleisten.",
  },
  {
    question: "Bieten Sie auch Grundreinigungen in den Ferien an?",
    answer:
      "Ja. Ferienzeiten eignen sich ideal für Grundreinigungen, Bodenversiegelungen und Intensivreinigungen. Wir planen diese Einsätze frühzeitig mit Ihrer Schulverwaltung ab.",
  },
];

const relatedLinks = [
  { href: "/leistungen/kitareinigung", label: "Kita-Reinigung" },
  { href: "/leistungen/bueroreinigung", label: "Büroreinigung" },
  { href: "/leistungen/praxisreinigung", label: "Praxisreinigung" },
  { href: "/leistungen/gewerbereinigung", label: "Gewerbereinigung" },
  { href: "/leistungen/gastronomiereinigung", label: "Gastronomiereinigung" },
  { href: "/leistungen/reinigung", label: "Alle Reinigungsleistungen" },
];

export default async function SchulreinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="schulreinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Bildungseinrichtungen"
          title="Schulreinigung in Berlin"
          intro="Professionelle Reinigung für Schulen und Bildungseinrichtungen in Berlin. Von der täglichen Unterhaltsreinigung bis zur Grundreinigung in den Ferien – hygienisch, zuverlässig und mit erfahrenen Teams."
          highlights={["Nach Unterrichtsende", "Sporthallen und Mensen", "Ferien-Grundreinigung"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.reinigungBuero)}
          priceHint="Mindestabnahme 2 Stunden. Große Schulflächen, Sportbereiche und saisonale Grundreinigungen stimmen wir vorab sauber mit Ihnen ab."
          primaryCta={{ href: "/kontakt", label: "Angebot anfordern" }}
          secondaryCta={{ href: "/buchen?service=OFFICE_CLEANING", label: "Reinigung anfragen" }}
          closingTitle="Schulreinigung mit klaren Hygieneplänen"
          closingText="Wir stimmen Reinigungsfenster, Ferienarbeiten und sensible Bereiche sauber mit Ihrer Verwaltung ab – für einen zuverlässigen Betrieb im Schulalltag."
          faqItems={faqItems}
          relatedLinks={relatedLinks}
        />
      </main>
    </>
  );
}
