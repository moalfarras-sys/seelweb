import type { Metadata } from "next";
import Script from "next/script";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/service/ServiceTemplate";

export const metadata: Metadata = buildMetadata({
  title: "Firmenumzug Berlin – Projektplanung mit minimaler Ausfallzeit",
  description:
    "Firmenumzug in Berlin mit klarer Projektplanung, IT-sicherem Transport und minimaler Betriebsunterbrechung für Unternehmen, Kanzleien, Praxen und Agenturen.",
  path: "/leistungen/firmenumzug",
});

const benefits = [
  "Minimale Ausfallzeit durch abgestimmte Meilensteinplanung",
  "IT-sicherer Transport für Monitore, Server und sensible Geräte",
  "Umzug außerhalb Ihrer Kernzeiten – abends und am Wochenende",
  "Etagen- und Zugangsplanung für komplexe Gebäudestrukturen",
  "Versicherter Transport nach HGB §451e",
  "Optionale Nachreinigung der alten Räumlichkeiten",
];

const includedServices = [
  "Vorabstimmung mit Projektleitung",
  "Individuelles Pack- und Transportkonzept",
  "Arbeitsplatz- und Möbelverlagerung",
  "IT- und Technikhandling für Rechner, Drucker und Server",
  "Archivsysteme und Aktenumzug",
  "Etagen- und Zugangsplanung",
  "Halteverbotszonen für Be- und Entladung",
  "Optionale Grundreinigung der neuen Fläche",
];

const faqItems = [
  {
    question: "Wie minimieren Sie die Ausfallzeit für unser Unternehmen?",
    answer:
      "Wir planen Etappen, Zeitfenster und Möbellogistik vorab, damit kritische Arbeitsbereiche schnell wieder einsatzbereit sind. Umzüge können auch abends oder am Wochenende stattfinden.",
  },
  {
    question: "Transportieren Sie auch IT-Equipment und sensible Geräte?",
    answer:
      "Ja. Monitore, Rechner, Drucker, Server und sensible Ausstattung werden geordnet erfasst, geschützt verpackt und sicher verlagert.",
  },
  {
    question: "Können Sie auch eine Reinigung nach dem Umzug übernehmen?",
    answer:
      "Ja. Auf Wunsch kombinieren wir den Firmenumzug mit einer Übergabereinigung für die alten Büroräume oder einer Grundreinigung der neuen Fläche.",
  },
  {
    question: "Für welche Unternehmensgrößen bieten Sie Firmenumzüge an?",
    answer:
      "Von Einzelunternehmen bis hin zu mittelständischen Betrieben mit mehreren Etagen. Für jedes Projekt erstellen wir einen individuellen Ablaufplan.",
  },
  {
    question: "Wie läuft die Projektplanung ab?",
    answer:
      "Zunächst erfassen wir Rahmendaten wie Größe, Etage, Technikumfang und Zeitrahmen. Daraus entsteht ein Meilensteinplan mit klaren Zuständigkeiten, den wir vor dem Umzug gemeinsam freigeben.",
  },
];

const internalLinks = [
  { href: "/leistungen/gewerbe", label: "Gewerbeumzug" },
  { href: "/leistungen/privatumzug", label: "Privatumzug" },
  { href: "/leistungen/umzug-berlin", label: "Umzug Berlin" },
  { href: "/leistungen/schulumzug", label: "Schulumzug" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/reinigung", label: "Reinigung" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
  { href: "/leistungen/umzug-brandenburg", label: "Umzug Brandenburg" },
];

export default async function FirmenumzugPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="firmenumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
        <ServiceTemplate
          badge="Für Unternehmen und Gewerbe"
          title="Firmenumzug Berlin – mit minimaler Ausfallzeit"
          intro="Für Unternehmen, Kanzleien, Praxen und Agenturen koordinieren wir Arbeitsplätze, Technik, Archivsysteme und Zeitfenster mit einem belastbaren Ablaufplan. Das Ziel ist ein ruhiger Wechsel ohne unnötige Unterbrechung Ihres Betriebs."
          highlights={["Meilensteinplanung", "IT-sicherer Transport", "Abends oder am Wochenende"]}
          benefits={benefits}
          includedServices={includedServices}
          priceLabel={formatPricePerHour(prices.gewerbeUmzug)}
          priceHint="Mindestabnahme 2 Stunden. Je nach Projektumfang kalkulieren wir Anfahrt, Trageaufwand, Technikhandling und Sonderleistungen transparent mit ein."
          primaryCta={{ href: "/buchen?service=MOVING&variant=business", label: "Firmenumzug anfragen" }}
          secondaryCta={{ href: "/kontakt?subject=Festpreisanfrage%20-%20Firmenumzug", label: "Festpreis anfragen" }}
          closingTitle="Firmenumzug mit belastbarem Ablaufplan"
          closingText="Teilen Sie uns Teamgröße, Technikanteil und Wunschfenster mit. Wir melden uns mit einem geordneten Projektvorschlag und klaren Zuständigkeiten zurück."
          faqItems={faqItems}
          relatedLinks={internalLinks}
        />
      </main>
    </>
  );
}
