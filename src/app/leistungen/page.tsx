import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Leistungen für Umzug, Reinigung und Entrümpelung",
  description:
    "Entdecken Sie alle Leistungen von SEEL Transport & Reinigung für Privatkunden, Unternehmen, Schulen sowie Umzüge, Reinigung und Entrümpelung in Berlin.",
  path: "/leistungen",
});

export default async function LeistungenPage() {
  const prices = await getPrices();

  const sections = [
    {
      id: "umzuege",
      title: "Privat- und Regionalumzüge",
      description: "Privatumzüge, Berlin-Umzüge und Brandenburg-Routen mit klarer Taktung und transparenter Preisstruktur.",
      href: "/leistungen/umzug-berlin",
      image: "/images/moving-truck-hero.png",
      price: formatPricePerHour(prices.umzugStandard),
      bullets: ["Privatumzug Berlin", "Umzug Berlin-Brandenburg", "Montage und Tragehilfe", "Halteverbotszonen auf Wunsch"],
    },
    {
      id: "buero",
      title: "Büro- & Gewerbeumzug",
      description: "Projektorientierte Umzüge für Kanzleien, Praxen, Agenturen und gewerbliche Flächen mit minimaler Unterbrechung.",
      href: "/leistungen/gewerbe",
      image: "/images/corporate-glass-cleaning.png",
      price: formatPricePerHour(prices.gewerbeUmzug),
      bullets: ["Projektplanung", "IT-Equipment", "Möbellogistik", "Optionale Nachreinigung"],
    },
    {
      id: "schule",
      title: "Schulumzug Berlin",
      description: "Ferien- und Wochenendumzüge für Schulen, Kitas, Bibliotheken und Bildungseinrichtungen.",
      href: "/leistungen/schulumzug",
      image: "/images/corporate-school-cleaning.png",
      price: formatPricePerHour(prices.umzugStandard),
      bullets: ["Ferienfenster", "Präzise Etappen", "IT- und Möbellogistik", "Kein Unterrichtsausfall"],
    },
    {
      id: "reinigung",
      title: "Reinigung & Endreinigung",
      description: "Wohnungsreinigung, Endreinigung und gewerbliche Reinigung mit abgestimmten Checklisten und fester Kommunikation.",
      href: "/leistungen/reinigung",
      image: "/images/cleaning-team-office.png",
      price: formatPricePerHour(prices.reinigungWohnung),
      bullets: ["Wohnungsreinigung", "Endreinigung", "Büroreinigung", "Feste Leistungslisten"],
    },
    {
      id: "entruempelung",
      title: "Entrümpelung & Entsorgung",
      description: "Räumung, Demontage und fachgerechte Entsorgung für Wohnung, Keller, Gewerbe und Nachlass.",
      href: "/leistungen/entruempelung",
      image: "/images/waste-disposal-recycling.png",
      price: formatPricePerHour(prices.entruempelung),
      bullets: ["Besenreine Übergabe", "Umweltgerechte Entsorgung", "Kurzfristige Termine", "Dokumentierte Abwicklung"],
    },
  ];

  return (
    <>
      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">Leistungen</p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">Servicefelder für Berlin, Brandenburg und darüber hinaus</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-silver-300">
            Alle Leistungen sind auf schnelle Orientierung, klare Preise und verlässliche Kommunikation ausgelegt. So finden Kundinnen und Kunden sofort den passenden Einsatzbereich.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl space-y-12 px-4 md:px-8">
          {sections.map((section, index) => (
            <article key={section.id} id={section.id} className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm dark:border-navy-700/50 dark:bg-navy-900 lg:grid-cols-2">
              <div className={index % 2 === 1 ? "order-2 lg:order-1" : ""}>
                <div className="relative h-72">
                  <Image src={section.image} alt={section.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
              <div className={`p-8 ${index % 2 === 1 ? "order-1 lg:order-2" : ""}`}>
                <h2 className="text-3xl font-bold text-navy-800 dark:text-white">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">{section.description}</p>
                <p className="mt-5 text-sm font-semibold text-teal-600 dark:text-teal-300">{section.price} · Mindestabnahme 2 Stunden</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-2 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-navy-700 dark:bg-navy-800/60 dark:text-silver-200">
                      <CheckCircle2 size={16} className="mt-0.5 text-teal-500" />
                      {bullet}
                    </div>
                  ))}
                </div>
                <Link href={section.href} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Details ansehen
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">Direkt online anfragen</h2>
          <p className="mt-4 text-lg leading-8 text-silver-600 dark:text-silver-300">
            Nutzen Sie den Buchungsprozess für eine schnelle Preisorientierung oder senden Sie uns Ihre Festpreisanfrage über das Kontaktformular.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600">
              Jetzt buchen
              <ArrowRight size={16} />
            </Link>
            <Link href="/kontakt" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
