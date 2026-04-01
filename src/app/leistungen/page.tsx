import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPublicServicePriceLabel, getPublicServicePrices } from "@/lib/public-service-pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Leistungen für Umzug, Reinigung und Entrümpelung",
  description:
    "Entdecken Sie alle Leistungen von SEEL Transport & Reinigung für Privatkunden, Unternehmen, Schulen sowie Umzüge, Reinigung und Entrümpelung in Berlin.",
  path: "/leistungen",
});

export default async function LeistungenPage() {
  const { prices } = await getPublicServicePrices();

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
      image: "/images/moving-workers-furniture.png",
      alt: "SEEL Transport Privatumzug Berlin – Möbeltransport und Umzugsteam",
      price: getPublicServicePriceLabel(prices, "umzug-berlin"),
      bullets: ["Privatumzug Berlin", "Umzug Berlin-Brandenburg", "Montage und Tragehilfe", "Halteverbotszonen auf Wunsch"],
    },
    {
      id: "buero",
      title: "Büro- und Gewerbeumzug",
      description: "Projektorientierte Umzüge für Kanzleien, Praxen, Agenturen und gewerbliche Flächen mit minimaler Unterbrechung.",
      href: "/leistungen/gewerbe",
      image: "/images/corporate-glass-cleaning.png",
      alt: "Professionelle Gewerbeleistung von SEEL in Berlin",
      price: getPublicServicePriceLabel(prices, "gewerbe"),
      bullets: ["Projektplanung", "IT-Equipment", "Möbellogistik", "Optionale Nachreinigung"],
    },
    {
      id: "schule",
      title: "Schulumzug Berlin",
      description: "Ferien- und Wochenendumzüge für Schulen, Kitas, Bibliotheken und Bildungseinrichtungen.",
      href: "/leistungen/schulumzug",
      image: "/images/corporate-school-cleaning.png",
      alt: "Schulumzug Berlin – SEEL Transport für Schulen und Bildungseinrichtungen",
      price: getPublicServicePriceLabel(prices, "schulumzug"),
      bullets: ["Ferienfenster", "Präzise Etappen", "IT- und Möbellogistik", "Kein Unterrichtsausfall"],
    },
    {
      id: "reinigung",
      title: "Reinigung und Endreinigung",
      description: "Wohnungsreinigung, Endreinigung und gewerbliche Reinigung mit abgestimmten Checklisten und fester Kommunikation.",
      href: "/leistungen/reinigung",
      image: "/images/cleaning-team-office.png",
      alt: "SEEL Reinigungsteam bei der professionellen Büroreinigung in Berlin",
      price: getPublicServicePriceLabel(prices, "reinigung"),
      bullets: ["Wohnungsreinigung", "Endreinigung", "Büroreinigung", "Feste Leistungslisten"],
    },
    {
      id: "entruempelung",
      title: "Entrümpelung und Entsorgung",
      description: "Räumung, Demontage und fachgerechte Entsorgung für Wohnung, Keller, Gewerbe und Nachlass.",
      href: "/leistungen/entruempelung",
      image: "/images/waste-disposal-recycling.png",
      alt: "Umweltgerechte Entrümpelung und Entsorgung in Berlin – SEEL Transport",
      price: getPublicServicePriceLabel(prices, "entruempelung"),
      bullets: ["Besenreine Übergabe", "Umweltgerechte Entsorgung", "Kurzfristige Termine", "Dokumentierte Abwicklung"],
    },
  ];

  return (
    <>
      <section className="gradient-navy relative overflow-hidden py-28 md:py-36">
        <div className="absolute inset-0 opacity-[0.10]">
          <Image src="/images/moving-truck-hero.png" alt="" fill className="object-cover object-center" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <p className="section-eyebrow text-cyan-200/80">Leistungen</p>
          <h1 className="font-display mt-4 max-w-4xl text-4xl font-bold text-white md:text-6xl">
            Servicefelder für Berlin, Brandenburg und darüber hinaus
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">
            Alle Leistungen sind auf schnelle Orientierung, klare Preise und verlässliche Kommunikation ausgelegt.
            So finden Kundinnen und Kunden sofort den passenden Einsatzbereich.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-8">
          {sections.map((section, index) => (
            <article
              key={section.id}
              id={section.id}
              className="premium-panel grid items-center gap-8 overflow-hidden rounded-[36px] lg:grid-cols-2"
            >
              <div className={index % 2 === 1 ? "order-2 lg:order-1" : ""}>
                <div className="relative h-80">
                  <Image src={section.image} alt={section.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.04)_0%,rgba(2,8,18,0.58)_100%)]" />
                  <span className="price-badge absolute left-5 top-5">{section.price}</span>
                </div>
              </div>
              <div className={`p-8 md:p-10 ${index % 2 === 1 ? "order-1 lg:order-2" : ""}`}>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-700 dark:text-cyan-300">Klar strukturierter Bereich</p>
                <h2 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-white/55">{section.description}</p>
                <p className="mt-5 text-sm font-semibold text-sky-700 dark:text-cyan-300">{section.price} · Mindestabnahme 2 Stunden</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <div key={bullet} className="glass-card flex items-start gap-2 rounded-[22px] px-4 py-3 text-sm text-slate-700 dark:text-white/70">
                      <CheckCircle2 size={16} className="mt-0.5 text-sky-600 dark:text-cyan-300" />
                      {bullet}
                    </div>
                  ))}
                </div>
                <Link href={section.href} className="btn-primary-glass mt-7 gap-2">
                  Details ansehen
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="premium-panel rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/45">Alle Leistungen</p>
            <nav aria-label="Alle Leistungen" className="mt-5">
              <ul className="flex flex-wrap gap-3">
                {serviceLinks.map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="btn-ghost-premium">
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="premium-panel rounded-[36px] p-10 text-center md:p-14">
            <p className="section-eyebrow">Direkt online anfragen</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">Jetzt strukturiert weitergehen</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-white/55">
              Nutzen Sie den Buchungsprozess für eine schnelle Preisorientierung oder senden Sie uns Ihre Festpreisanfrage über das Kontaktformular.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/buchen" className="btn-primary-glass gap-2">
                Jetzt buchen
                <ArrowRight size={16} />
              </Link>
              <Link href="/kontakt" className="btn-secondary-glass">
                Festpreis anfragen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
