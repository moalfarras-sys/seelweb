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
  const serviceLinks = [
    { label: "Privatumzug", href: "/leistungen/privatumzug" },
    { label: "Firmenumzug", href: "/leistungen/firmenumzug" },
    { label: "Schulumzug", href: "/leistungen/schulumzug" },
    { label: "Expressumzug", href: "/leistungen/expressumzug" },
    { label: "Endreinigung", href: "/leistungen/endreinigung" },
    { label: "Entrümpelung", href: "/leistungen/entruempelung" },
    { label: "Entsorgung", href: "/leistungen/entsorgung" },
    { label: "Reinigung", href: "/leistungen/reinigung" },
    { label: "Wohnungsreinigung", href: "/leistungen/wohnungsreinigung" },
    { label: "Gewerbe", href: "/leistungen/gewerbe" },
    { label: "Umzug Berlin", href: "/leistungen/umzug-berlin" },
    { label: "Umzug Brandenburg", href: "/leistungen/umzug-brandenburg" },
    { label: "Deutschlandweite Umzüge", href: "/leistungen/deutschlandweite-umzuege" },
    { label: "Transport", href: "/leistungen/transport" },
    { label: "Praxisreinigung", href: "/leistungen/praxisreinigung" },
    { label: "Büroreinigung", href: "/leistungen/bueroreinigung" },
    { label: "Kitareinigung", href: "/leistungen/kitareinigung" },
    { label: "Schulreinigung", href: "/leistungen/schulreinigung" },
    { label: "Gewerbereinigung", href: "/leistungen/gewerbereinigung" },
    { label: "Gastronomiereinigung", href: "/leistungen/gastronomiereinigung" },
  ];

  const sections = [
    {
      id: "umzuege",
      title: "Privat- und Regionalumzüge",
      description: "Privatumzüge, Berlin-Umzüge und Brandenburg-Routen mit klarer Taktung und transparenter Preisstruktur.",
      href: "/leistungen/umzug-berlin",
      image: "/images/umzug-1.jpeg",
      alt: "SEEL Transport Privatumzug Berlin – Möbeltransport und Umzugsteam",
      price: formatPricePerHour(prices.umzugStandard),
      bullets: ["Privatumzug Berlin", "Umzug Berlin-Brandenburg", "Montage und Tragehilfe", "Halteverbotszonen auf Wunsch"],
    },
    {
      id: "buero",
      title: "Büro- & Gewerbeumzug",
      description: "Projektorientierte Umzüge für Kanzleien, Praxen, Agenturen und gewerbliche Flächen mit minimaler Unterbrechung.",
      href: "/leistungen/gewerbe",
      image: "/images/corporate-glass-cleaning.png",
      alt: "Professionelle Glasreinigung im Büro – SEEL Gewerbeservice Berlin",
      price: formatPricePerHour(prices.gewerbeUmzug),
      bullets: ["Projektplanung", "IT-Equipment", "Möbellogistik", "Optionale Nachreinigung"],
    },
    {
      id: "schule",
      title: "Schulumzug Berlin",
      description: "Ferien- und Wochenendumzüge für Schulen, Kitas, Bibliotheken und Bildungseinrichtungen.",
      href: "/leistungen/schulumzug",
      image: "/images/corporate-school-cleaning.png",
      alt: "Schulumzug Berlin – SEEL Transport für Schulen und Bildungseinrichtungen",
      price: formatPricePerHour(prices.umzugStandard),
      bullets: ["Ferienfenster", "Präzise Etappen", "IT- und Möbellogistik", "Kein Unterrichtsausfall"],
    },
    {
      id: "reinigung",
      title: "Reinigung & Endreinigung",
      description: "Wohnungsreinigung, Endreinigung und gewerbliche Reinigung mit abgestimmten Checklisten und fester Kommunikation.",
      href: "/leistungen/reinigung",
      image: "/images/cleaning-team-office.png",
      alt: "SEEL Reinigungsteam bei der professionellen Büroreinigung Berlin",
      price: formatPricePerHour(prices.reinigungWohnung),
      bullets: ["Wohnungsreinigung", "Endreinigung", "Büroreinigung", "Feste Leistungslisten"],
    },
    {
      id: "entruempelung",
      title: "Entrümpelung & Entsorgung",
      description: "Räumung, Demontage und fachgerechte Entsorgung für Wohnung, Keller, Gewerbe und Nachlass.",
      href: "/leistungen/entruempelung",
      image: "/images/waste-disposal-recycling.png",
      alt: "Umweltgerechte Entrümpelung und Entsorgung Berlin – SEEL Transport",
      price: formatPricePerHour(prices.entruempelung),
      bullets: ["Besenreine Übergabe", "Umweltgerechte Entsorgung", "Kurzfristige Termine", "Dokumentierte Abwicklung"],
    },
  ];

  return (
    <>
      <section className="bg-[linear-gradient(135deg,#0d1724_0%,#112132_52%,#173832_100%)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">Leistungen</p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">Servicefelder für Berlin, Brandenburg und darüber hinaus</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Alle Leistungen sind auf schnelle Orientierung, klare Preise und verlässliche Kommunikation ausgelegt. So finden Kundinnen und Kunden sofort den passenden Einsatzbereich.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 md:px-8">
          {sections.map((section, index) => (
            <article key={section.id} id={section.id} className="glass-card grid items-center gap-8 overflow-hidden rounded-[2rem] lg:grid-cols-2">
              <div className={index % 2 === 1 ? "order-2 lg:order-1" : ""}>
                <div className="relative h-72">
                  <Image src={section.image} alt={section.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
              <div className={`p-8 ${index % 2 === 1 ? "order-1 lg:order-2" : ""}`}>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{section.description}</p>
                <p className="mt-5 text-sm font-semibold text-emerald-700 dark:text-teal-300">{section.price} · Mindestabnahme 2 Stunden</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <div key={bullet} className="glass-card flex items-start gap-2 rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-white/70">
                      <CheckCircle2 size={16} className="mt-0.5 text-emerald-600 dark:text-teal-300" />
                      {bullet}
                    </div>
                  ))}
                </div>
                <Link href={section.href} className="btn-primary-glass mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                  Details ansehen
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <nav aria-label="Alle Leistungen">
            <ul className="flex flex-wrap gap-3">
              {serviceLinks.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/10 dark:text-white/70 dark:hover:text-teal-300"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Direkt online anfragen</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-white/60">
            Nutzen Sie den Buchungsprozess für eine schnelle Preisorientierung oder senden Sie uns Ihre Festpreisanfrage über das Kontaktformular.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen" className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
              Jetzt buchen
              <ArrowRight size={16} />
            </Link>
            <Link href="/kontakt" className="btn-secondary-glass inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold">
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
