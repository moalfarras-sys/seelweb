import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privatumzug Berlin - Stressfrei und termingerecht",
  description:
    "Privatumzug in Berlin mit verlässlicher Planung, transparenten Preisen, Möbelmontage und versichertem Transport. SEEL Transport organisiert Ihren Wohnungsumzug.",
  path: "/leistungen/privatumzug",
});

const faqItems = [
  {
    question: "Was kostet ein Privatumzug in Berlin?",
    answer: "Privatumzüge starten ab einem transparenten Stundenpreis. Über den Online-Rechner erhalten Sie in wenigen Schritten eine Orientierung – das verbindliche Angebot folgt nach Ihrer Anfrage.",
  },
  {
    question: "Ist mein Umzugsgut versichert?",
    answer: "Ja. Alle Transporte werden nach HGB §451e durchgeführt. Auf Wunsch beraten wir Sie zusätzlich zu erweiterten Absicherungen.",
  },
  {
    question: "Kann ich Endreinigung und Umzug kombinieren?",
    answer: "Ja. Viele Kundinnen und Kunden kombinieren Privatumzug, Endreinigung und Entrümpelung in einem abgestimmten Ablauf, damit Ihr alter Wohnraum übergabefertig hinterlassen wird.",
  },
  {
    question: "Wie kurzfristig können Sie einen Umzug übernehmen?",
    answer: "Reguläre Umzüge planen wir mit festen Zeitfenstern. Für besonders dringende Fälle bieten wir einen Expressumzug mit kurzfristiger Disposition innerhalb von 24–48 Stunden an.",
  },
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
          <h1 className="text-4xl font-bold text-white md:text-5xl">Privatumzug Berlin - Stressfrei und termingerecht</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            SEEL Transport organisiert Ihren Wohnungsumzug in Berlin strukturiert und termingerecht – vom ersten Karton bis zur
            letzten Schraube. Feste Zeitfenster, erfahrene Teams und ein versicherter Transport sorgen für einen stressfreien
            Ablauf.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600">
              Privatumzug buchen
              <ArrowRight size={16} />
            </Link>
            <Link href="/kontakt?subject=Festpreisanfrage%20-%20Privatumzug" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Ihre Vorteile beim Privatumzug</h2>
          <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">
            Ein Wohnungsumzug in Berlin erfordert präzise Planung und Erfahrung mit lokalen Gegebenheiten. Wir kennen
            die Berliner Kieze, kümmern uns um Halteverbotszonen und stimmen Zeitfenster klar ab, damit Ihr Umzug
            reibungslos verläuft.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              "Minimale Ausfallzeit durch abgestimmte Projektplanung",
              "Feste Zeitfenster statt unklarer Ankunft",
              "Versicherter Möbeltransport nach HGB §451e",
            ].map((item) => (
              <div key={item} className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-6 dark:border-navy-700/50 dark:bg-navy-800/60">
                <CheckCircle2 size={18} className="text-teal-500" />
                <p className="mt-4 text-sm leading-7 text-navy-800 dark:text-silver-200">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Was ist enthalten</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Verpackung, Transport und Aufbau",
                  "Möbelmontage und -demontage",
                  "Halteverbotszone auf Wunsch",
                  "Tragehilfe für schwere Gegenstände",
                  "Schutzmaterial für empfindliche Möbel",
                  "Optional: Endreinigung und Entrümpelung",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-silver-600 shadow-sm dark:border-navy-700/50 dark:bg-navy-900 dark:text-silver-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-8 dark:border-navy-700/50 dark:bg-navy-800/60">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Startpreis</p>
              <p className="mt-4 text-3xl font-bold text-navy-800 dark:text-white">{formatPricePerHour(prices.umzugStandard)}</p>
              <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Mindestabnahme 2 Stunden. Zusätzlich kalkulieren wir Anfahrtswege, Stockwerke und optionale Leistungen wie Montage oder Halteverbotszonen.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Jetzt buchen
                  <ArrowRight size={16} />
                </Link>
                <Link href="/leistungen/umzug-berlin" className="text-sm font-semibold text-teal-600 transition hover:text-teal-500">
                  Zur Umzugsfirma Berlin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl space-y-4 px-4 md:px-8">
          {faqItems.map((faq) => (
            <details key={faq.question} className="rounded-3xl border border-gray-100 bg-white p-5 dark:border-navy-700/50 dark:bg-navy-800/60">
              <summary className="cursor-pointer list-none text-sm font-semibold text-navy-800 dark:text-white">{faq.question}</summary>
              <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">Verwandte Leistungen</h2>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/leistungen/endreinigung" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Endreinigung
            </Link>
            <Link href="/leistungen/entruempelung" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Entrümpelung
            </Link>
            <Link href="/leistungen/expressumzug" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Expressumzug
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
