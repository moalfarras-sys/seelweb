import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Schulumzug Berlin - Zuverlässig in den Ferien",
  description:
    "Schulumzug Berlin für Schulen, Kitas, Hochschulen und Bildungseinrichtungen mit Ferienplanung, Wochenendfenstern und präziser Taktung.",
  path: "/leistungen/schulumzug",
});

const faqItems = [
  {
    question: "Wann führen Sie Schulumzüge durch?",
    answer: "Bevorzugt in Ferienzeiten, an Wochenenden oder in abgestimmten Teilabschnitten, damit der Schulbetrieb möglichst nicht gestört wird.",
  },
  {
    question: "Was transportieren Sie typischerweise?",
    answer: "Unter anderem Schulbänke, Tafeln, Whiteboards, IT-Ausstattung, Bibliotheksregale, Schränke und komplette Klassenraumausstattung.",
  },
  {
    question: "In welchen Berliner Bezirken sind Sie aktiv?",
    answer: "Regelmäßig betreuen wir Einsätze in Mitte, Tempelhof, Neukölln, Pankow und Charlottenburg sowie weitere Standorte in Berlin.",
  },
];

export default async function SchulumzugPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="schulumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>
      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Schulumzug Berlin - Zuverlässig in den Ferien</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Wir organisieren Schulumzüge für Schulen, Kitas, Hochschulen und andere Bildungseinrichtungen mit präziser Planung,
            festen Zeitfenstern und hoher Rücksicht auf den laufenden Betrieb.
          </p>
        </div>
      </section>
      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Präzise geplant für Bildungseinrichtungen</h2>
              <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Schulumzüge in Berlin benötigen eine besondere Taktung. Deshalb koordinieren wir Ferienfenster, Wochenendtermine,
                Schlüsselübergaben, Laufwege und sensible Räume von Anfang an mit Ihren Ansprechpartnern.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Ferien- und Wochenendumzüge",
                  "Feste Zeitfenster ohne Unterrichtsstörung",
                  "Transport von Schulbänken, Tafeln und Whiteboards",
                  "Sichere Verlagerung von IT-Ausstattung",
                  "Bibliotheksregale, Schränke und Schulmöbel",
                  "Einsätze in Mitte, Tempelhof, Neukölln, Pankow und Charlottenburg",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-navy-800 dark:border-navy-700/50 dark:bg-navy-800/60 dark:text-silver-200">
                    <CheckCircle2 size={16} className="mt-0.5 text-teal-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-8 dark:border-navy-700/50 dark:bg-navy-800/60">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Startpreis</p>
              <p className="mt-4 text-3xl font-bold text-navy-800 dark:text-white">{formatPricePerHour(prices.umzugStandard)}</p>
              <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Mindestabnahme 2 Stunden. Für größere Einrichtungen planen wir Etappen, Raumlisten und feste Umzugsfenster.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Schulumzug anfragen
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
    </>
  );
}
