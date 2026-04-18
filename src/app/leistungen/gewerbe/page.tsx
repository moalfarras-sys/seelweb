import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gewerbeumzug Berlin – Für Praxen, Läden und laufende Betriebe",
  description:
    "Gewerbeumzug in Berlin für Praxen, Studios, Läden, Kanzleien und gemischt genutzte Flächen. Etappenplanung, sensible Ausstattung und saubere Übergaben von SEEL Transport.",
  path: "/leistungen/gewerbe",
});

const benefits = [
  "Geeignet für Praxen, Studios, Einzelhandel und kleinere Betriebsflächen",
  "Abschnittsweise Verlagerung bei laufendem Tagesgeschäft möglich",
  "Sicherer Umgang mit Inventar, Technik und sensiblen Arbeitsbereichen",
  "Koordination von Zugängen, Ladezonen und Übergaben mit Hausverwaltung",
  "Kombinierbar mit Entrümpelung, Entsorgung und Abschlussreinigung",
  "Fester Ansprechpartner von Vor-Ort-Termin bis Abschluss",
];

const includedServices = [
  "Vor-Ort-Begehung mit Ablaufskizze",
  "Transport von Einrichtung, Geräten und Arbeitsmaterial",
  "Absicherung sensibler Zonen und Laufwege",
  "Teilumzüge in Etappen oder außerhalb der Stoßzeiten",
  "Demontage und Wiederaufbau ausgewählter Möbel",
  "Organisation von Ladezone und Zugängen",
  "Optionaler Abtransport alter Ausstattung",
  "Übergabe- oder Grundreinigung nach dem Umzug",
];

const faqItems = [
  {
    question: "Wie reduzieren Sie Ausfallzeiten im laufenden Betrieb?",
    answer:
      "Wir planen Etappen, Zeitfenster und Laufwege vorab, damit Empfang, Praxisräume oder Verkaufsflächen nur so kurz wie nötig betroffen sind. Auf Wunsch arbeiten wir vor Öffnung, nach Betrieb oder in einzelnen Abschnitten.",
  },
  {
    question: "Welche Gewerbeflächen betreuen Sie?",
    answer:
      "Wir betreuen unter anderem Praxen, Kanzleien, Studios, kleine Büros, Ladenflächen, Agenturen und gemischt genutzte Objekte. Der Ablauf wird an Betrieb, Inventar und Zugänge angepasst.",
  },
  {
    question: "Kann der Gewerbeumzug mit Reinigung oder Entsorgung kombiniert werden?",
    answer:
      "Ja. Gerade bei Praxis- oder Ladenflächen kombinieren wir Umzug, Entsorgung und Übergabereinigung häufig in einem abgestimmten Ablauf. Das spart Abstimmung mit mehreren Dienstleistern.",
  },
  {
    question: "Wie kurzfristig können Sie einen Gewerbeumzug übernehmen?",
    answer:
      "Planbare Gewerbeumzüge stimmen wir idealerweise frühzeitig ab. Wenn Flächen kurzfristig übergeben werden müssen, prüfen wir Express- oder Etappenlösungen und geben schnell Rückmeldung zur Machbarkeit.",
  },
  {
    question: "Was unterscheidet diese Seite vom Firmenumzug?",
    answer:
      "Der Firmenumzug fokussiert sich stärker auf klassische Büro- und Teamstrukturen mit Projektmeilensteinen. Der Gewerbeumzug ist breiter auf Praxen, Läden, Studios und kleinere Betriebsflächen mit gemischten Anforderungen ausgerichtet.",
  },
];

const internalLinks = [
  { href: "/leistungen/firmenumzug", label: "Firmenumzug" },
  { href: "/leistungen/privatumzug", label: "Privatumzug" },
  { href: "/leistungen/umzug-berlin", label: "Umzugsfirma Berlin" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
  { href: "/leistungen/reinigung", label: "Reinigung" },
];

export default async function GewerbePage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="gewerbe-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="bg-[linear-gradient(135deg,#0d1724_0%,#112132_52%,#173832_100%)] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <p className="inline-flex rounded-full border border-emerald-200/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-xl">
            Für laufende Betriebe & sensible Flächen
          </p>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Gewerbeumzug Berlin
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Für Praxen, Studios, Ladenflächen, Kanzleien und kleinere Unternehmensstandorte organisieren wir
            Gewerbeumzüge mit klarer Einsatzplanung, geschützten Laufwegen und möglichst kurzer Unterbrechung Ihres Tagesgeschäfts.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/buchen?service=MOVING&variant=business"
              className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
            >
              Gewerbeumzug anfragen
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20B%C3%BCro-%20%26%20Gewerbeumzug"
              className="btn-secondary-glass inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold"
            >
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">
              Vorteile
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Warum Unternehmen uns vertrauen
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="glass-card rounded-[28px] p-6"
              >
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-teal-300" />
                <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">
              Leistungsumfang
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Was ist enthalten
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {includedServices.map((item) => (
              <div
                key={item}
                className="glass-card rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-white/60"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Preise</h2>
          <p className="mt-4 text-4xl font-bold text-emerald-700 dark:text-teal-300">
            {formatPricePerHour(prices.gewerbeUmzug)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mindestabnahme 2 Stunden. Je nach Projektumfang kalkulieren wir Anfahrt, Trageaufwand und Sonderleistungen.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/buchen?service=MOVING&variant=business"
              className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
            >
              Jetzt buchen
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20Gewerbeumzug"
              className="btn-secondary-glass inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold"
            >
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-white">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details
                key={faq.question}
                className="glass-card rounded-[24px] p-5"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0d1724_0%,#112132_52%,#173832_100%)] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Gewerbeumzug mit sauberem Betriebsablauf
          </h2>
          <p className="mt-5 text-lg text-white/75">
            Wir planen Ihren Umzug so, dass Übergabe, Transport und Anschlussarbeiten ineinandergreifen.
            Senden Sie uns Eckdaten zu Fläche, Inventar und Zeitfenster für ein belastbares Angebot.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/kontakt?subject=Gewerbeumzug%20Anfrage"
              className="btn-primary-glass inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold"
            >
              Jetzt Angebot anfordern
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            Weitere Leistungen
          </p>
          <div className="flex flex-wrap gap-3">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/10 dark:text-white/70 dark:hover:text-teal-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
