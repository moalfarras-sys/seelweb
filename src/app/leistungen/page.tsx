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
      description: "Privatumzüge, Berlin-Umzüge und Brandenburg-Routen mit klarer Taktung, transparenter Preisstruktur und versicherter Durchführung.",
      href: "/leistungen/umzug-berlin",
      image: "/images/umzug-1.jpeg",
      alt: "SEEL Transport Privatumzug Berlin – Möbeltransport und Umzugsteam",
      price: getPublicServicePriceLabel(prices, "umzug-berlin"),
      bullets: ["Privatumzug Berlin", "Umzug Berlin-Brandenburg", "Montage und Tragehilfe", "Halteverbotszonen auf Wunsch"],
    },
    {
      id: "buero",
      title: "Büro- und Gewerbeumzug",
      description: "Projektorientierte Umzüge für Kanzleien, Praxen, Agenturen und gewerbliche Flächen mit minimaler Unterbrechung.",
      href: "/leistungen/gewerbe",
      image: "/images/corporate-hallway-cleaning.png",
      alt: "Professionelle Gewerbeleistung von SEEL in Berlin",
      price: getPublicServicePriceLabel(prices, "gewerbe"),
      bullets: ["Projektplanung", "IT-Equipment", "Möbellogistik", "Optionale Nachreinigung"],
    },
    {
      id: "schule",
      title: "Schulumzug Berlin",
      description: "Ferien- und Wochenendumzüge für Schulen, Kitas, Bibliotheken und Bildungseinrichtungen mit sauberer Etappenplanung.",
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
      image: "/images/cleaning-team-staircase.png",
      alt: "SEEL Reinigungsteam bei der professionellen Büroreinigung in Berlin",
      price: getPublicServicePriceLabel(prices, "reinigung"),
      bullets: ["Wohnungsreinigung", "Endreinigung", "Büroreinigung", "Feste Leistungslisten"],
    },
    {
      id: "entruempelung",
      title: "Entrümpelung und Entsorgung",
      description: "Räumung, Demontage und fachgerechte Entsorgung für Wohnung, Keller, Gewerbe und Nachlass mit dokumentierter Übergabe.",
      href: "/leistungen/entruempelung",
      image: "/images/waste-disposal-recycling.png",
      alt: "Umweltgerechte Entrümpelung und Entsorgung in Berlin – SEEL Transport",
      price: getPublicServicePriceLabel(prices, "entruempelung"),
      bullets: ["Besenreine Übergabe", "Umweltgerechte Entsorgung", "Kurzfristige Termine", "Dokumentierte Abwicklung"],
    },
  ];

  return (
    <>
      <section className="relative px-4 pb-8 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="page-hero-shell">
            <div className="hero-light-sweep opacity-60" />
            <div className="page-hero-grid">
              <div>
                <p className="page-kicker">Leistungen</p>
                <h1 className="page-title max-w-[11ch]">Servicefelder für Berlin, Brandenburg und darüber hinaus</h1>
                <p className="page-copy">
                  Jede Leistung ist auf schnelle Orientierung, klare Preise und eine ruhige, hochwertige Anfrageführung aufgebaut.
                </p>
                <div className="page-chip-row">
                  <span className="page-chip">Klar gegliedert</span>
                  <span className="page-chip">Direkt buchbar</span>
                  <span className="page-chip">Privat bis Gewerbe</span>
                </div>
              </div>

              <div className="page-info-card p-4 sm:p-5">
                <div className="relative min-h-[240px] overflow-hidden rounded-[26px]">
                  <Image
                    src="/images/umzug-1.jpeg"
                    alt="SEEL Leistungen Überblick"
                    fill
                    className="image-cinematic object-cover"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,22,0.14)_0%,rgba(5,12,22,0.32)_48%,rgba(5,12,22,0.88)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="page-kicker">Orientierung</p>
                    <p className="mt-3 text-2xl font-semibold leading-tight">Umzug, Reinigung und Entrümpelung in einer konsistenten Oberfläche.</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Umzug", value: getPublicServicePriceLabel(prices, "umzug-berlin") },
                    { label: "Express", value: getPublicServicePriceLabel(prices, "expressumzug") },
                    { label: "Reinigung", value: getPublicServicePriceLabel(prices, "reinigung") },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/7 p-4 text-white">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/46">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-[1240px] space-y-10 px-4 md:px-8">
          {sections.map((section, index) => (
            <article
              key={section.id}
              id={section.id}
              className="page-info-card-light grid items-center gap-8 overflow-hidden rounded-[36px] lg:grid-cols-2"
            >
              <div className={index % 2 === 1 ? "order-2 lg:order-1" : ""}>
                <div className="relative h-80">
                  <Image src={section.image} alt={section.alt} fill className="image-cinematic object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.04)_0%,rgba(2,8,18,0.58)_100%)]" />
                  <span className="absolute left-5 top-5 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-navy">{section.price}</span>
                </div>
              </div>
              <div className={`p-8 md:p-10 ${index % 2 === 1 ? "order-1 lg:order-2" : ""}`}>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-700 dark:text-cyan-300">Klar strukturierter Bereich</p>
                <h2 className="section-title mt-4 text-3xl md:text-4xl">{section.title}</h2>
                <p className="section-copy mt-4 text-sm md:text-base">{section.description}</p>
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

      <section className="pb-24">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="page-info-card-light rounded-[30px] p-6">
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
    </>
  );
}
