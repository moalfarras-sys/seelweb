import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privatumzug Berlin – Stressfrei und termingerecht",
  description:
    "Privatumzug in Berlin mit verlässlicher Planung, transparenten Preisen, Möbelmontage und versichertem Transport. SEEL Transport organisiert Ihren Wohnungsumzug.",
  path: "/leistungen/privatumzug",
});

const benefits = [
  "Feste Zeitfenster statt unklarer Ankunft",
  "Versicherter Transport nach HGB §451e",
  "Erfahrene Teams mit Berliner Ortskenntnis",
  "Schutzverpackung für empfindliche Möbel und Glas",
  "Montage und Demontage Ihrer Möbel inklusive",
  "Kombination mit Endreinigung und Entrümpelung möglich",
];

const includedServices = [
  "Vorabberatung und individuelle Planung",
  "Be- und Entladen aller Möbel und Kartons",
  "Möbelmontage und -demontage",
  "Schutz für Böden, Türrahmen und Geländer",
  "Halteverbotszone vor beiden Adressen",
  "Fahrzeuge passend zur Wohnungsgröße",
  "Schwerlasttransport (Klavier, Waschmaschine, etc.)",
  "Optionale Endreinigung der alten Wohnung",
];

const faqItems = [
  {
    question: "Was kostet ein Privatumzug in Berlin?",
    answer:
      "Privatumzüge starten ab einem transparenten Stundenpreis. Über den Online-Rechner erhalten Sie in wenigen Schritten eine Orientierung – das verbindliche Angebot folgt nach Ihrer Anfrage.",
  },
  {
    question: "Ist mein Umzugsgut versichert?",
    answer:
      "Ja. Alle Transporte werden nach HGB §451e durchgeführt. Auf Wunsch beraten wir Sie zusätzlich zu erweiterten Absicherungen.",
  },
  {
    question: "Kann ich Endreinigung und Umzug kombinieren?",
    answer:
      "Ja. Viele Kundinnen und Kunden kombinieren Privatumzug, Endreinigung und Entrümpelung in einem abgestimmten Ablauf, damit Ihr alter Wohnraum übergabefertig hinterlassen wird.",
  },
  {
    question: "Wie kurzfristig können Sie einen Umzug übernehmen?",
    answer:
      "Reguläre Umzüge planen wir mit festen Zeitfenstern. Für besonders dringende Fälle bieten wir einen Expressumzug mit kurzfristiger Disposition innerhalb von 24–48 Stunden an.",
  },
  {
    question: "Muss ich Kartons selbst besorgen?",
    answer:
      "Auf Wunsch stellen wir Umzugskartons, Kleiderkisten und Schutzmaterial bereit. Sprechen Sie uns bei der Buchung einfach darauf an.",
  },
];

const internalLinks = [
  { href: "/leistungen/umzug-berlin", label: "Umzug Berlin" },
  { href: "/leistungen/firmenumzug", label: "Firmenumzug" },
  { href: "/leistungen/gewerbe", label: "Gewerbeumzug" },
  { href: "/leistungen/schulumzug", label: "Schulumzug" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/endreinigung", label: "Endreinigung" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
  { href: "/leistungen/umzug-brandenburg", label: "Umzug Brandenburg" },
];

export default async function PrivatumzugPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="privatumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-300 backdrop-blur-xl">
            Für Privathaushalte
          </p>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Privatumzug Berlin – Stressfrei und termingerecht
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            SEEL Transport organisiert Ihren Wohnungsumzug in Berlin strukturiert und termingerecht – vom ersten Karton
            bis zur letzten Schraube. Feste Zeitfenster, erfahrene Teams und ein versicherter Transport sorgen für
            einen stressfreien Ablauf.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/buchen?service=MOVING"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Privatumzug buchen
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20Privatumzug"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Vorteile</p>
            <h2 className="mt-4 text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">
              Ihre Vorteile beim Privatumzug
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-silver-600 dark:text-silver-300">
              Ein Wohnungsumzug in Berlin erfordert präzise Planung und Erfahrung mit lokalen Gegebenheiten. Wir kennen
              die Berliner Kieze und stimmen Zeitfenster klar ab.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-gray-100 bg-gray-50/80 p-6 dark:border-navy-700/50 dark:bg-navy-800/60"
              >
                <CheckCircle2 size={20} className="text-teal-500" />
                <p className="mt-4 text-sm font-semibold text-navy-800 dark:text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Leistungsumfang</p>
            <h2 className="mt-4 text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">Was ist enthalten</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {includedServices.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-silver-600 shadow-sm dark:border-navy-700/50 dark:bg-navy-800 dark:text-silver-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Preise</h2>
          <p className="mt-4 text-4xl font-bold text-teal-600">{formatPricePerHour(prices.umzugStandard)}</p>
          <p className="mt-2 text-sm text-silver-500">
            Mindestabnahme 2 Stunden · Expressumzüge ab {formatPricePerHour(prices.umzugExpress).replace("ab ", "")}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/buchen?service=MOVING"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Jetzt buchen <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20Privatumzug"
              className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:text-white"
            >
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-navy-800 dark:text-white">Häufige Fragen</h2>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details
                key={faq.question}
                className="rounded-3xl border border-gray-100 bg-white p-5 dark:border-navy-700/50 dark:bg-navy-800/60"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-navy-800 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-navy py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Ihr Privatumzug – jetzt planen</h2>
          <p className="mt-5 text-lg text-silver-300">
            Lassen Sie uns gemeinsam Ihren Umzug planen. Kontaktieren Sie uns für eine individuelle Beratung
            und ein unverbindliches Angebot.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/kontakt?subject=Privatumzug%20Anfrage"
              className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Jetzt Angebot anfordern
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-4 text-sm font-semibold text-navy-800 dark:text-white">Weitere Leistungen</p>
          <div className="flex flex-wrap gap-3">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:text-silver-300"
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
