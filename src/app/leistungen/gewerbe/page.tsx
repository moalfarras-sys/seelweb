import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Büro- & Gewerbeumzug Berlin – Firmenumzug mit System",
  description:
    "Professioneller Büro- und Gewerbeumzug in Berlin für Unternehmen, Kanzleien, Agenturen und Praxen. Projektplanung, IT-Handling und minimale Ausfallzeit von SEEL Transport.",
  path: "/leistungen/gewerbe",
});

const benefits = [
  "Minimale Ausfallzeit durch abgestimmte Projektplanung",
  "Transport von IT-Equipment, Servern und sensiblen Geräten",
  "Etappenweise Verlagerung im laufenden Betrieb möglich",
  "Demontage und Montage von Büromöbeln und Arbeitsstationen",
  "Feste Ansprechpartner und dokumentierter Ablaufplan",
  "Optional mit Übergabereinigung oder Entsorgung alter Möbel",
];

const includedServices = [
  "Vorabbegehung und Projektplanung",
  "Pack- und Transportkonzept",
  "Arbeitsplatz- und Möbelverlagerung",
  "IT- und Technikhandling (Monitore, Rechner, Drucker)",
  "Etagen- und Zugangsplanung",
  "Halteverbotszone vor beiden Standorten",
  "Archiv- und Aktentransport",
  "Optionale Nachreinigung beider Objekte",
];

const faqItems = [
  {
    question: "Wie reduzieren Sie Ausfallzeiten im laufenden Betrieb?",
    answer:
      "Wir planen Etappen, Zeitfenster und Möbellogistik vorab, damit kritische Arbeitsbereiche schnell wieder einsatzbereit sind. Auf Wunsch verlagern wir abteilungsweise oder am Wochenende.",
  },
  {
    question: "Transportieren Sie auch IT-Equipment und Server?",
    answer:
      "Ja. Monitore, Rechner, Drucker, Server und sensible Ausstattung werden geordnet erfasst, geschützt verpackt und sicher verlagert. Wir arbeiten eng mit Ihrem IT-Team zusammen.",
  },
  {
    question: "Kann nach dem Umzug eine Reinigung erfolgen?",
    answer:
      "Ja. Auf Wunsch kombinieren wir den Gewerbeumzug mit einer Reinigungsleistung für Übergabe, Teilflächen oder das alte Objekt. So erhalten Sie alles aus einer Hand.",
  },
  {
    question: "Wie kurzfristig können Sie einen Gewerbeumzug durchführen?",
    answer:
      "Reguläre Gewerbeumzüge planen wir mit einem Vorlauf von 2–4 Wochen. Bei dringenden Projekten finden wir kurzfristige Lösungen — kontaktieren Sie uns direkt für eine Einschätzung.",
  },
  {
    question: "Welche Unternehmen betreuen Sie?",
    answer:
      "Wir betreuen Unternehmen jeder Größe — von Einzelpraxen und Kanzleien über Agenturen und Start-ups bis hin zu mittelständischen Betrieben. Jeder Umzug wird individuell geplant.",
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
            Für Unternehmen & Gewerbe
          </p>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Büro- & Gewerbeumzug Berlin
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Für Unternehmen, Kanzleien, Agenturen und Praxen organisieren wir Gewerbeumzüge mit
            fester Projektplanung, klaren Zeitfenstern und möglichst geringer Unterbrechung Ihres Betriebs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/buchen?service=MOVING"
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
              href="/buchen?service=MOVING"
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
            Ihr Gewerbeumzug — professionell geplant
          </h2>
          <p className="mt-5 text-lg text-white/75">
            Lassen Sie uns gemeinsam Ihren Umzug planen. Kontaktieren Sie uns für ein
            unverbindliches Angebot und eine individuelle Beratung.
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
