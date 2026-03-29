import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Umzugsfirma Brandenburg - Auch außerhalb Berlins",
  description:
    "Umzugsfirma Brandenburg für Potsdam, Falkensee, Oranienburg, Bernau, Cottbus und Eberswalde mit eingespielten Berlin-Brandenburg-Routen.",
  path: "/leistungen/umzug-brandenburg",
});

const faqItems = [
  {
    question: "Betreuen Sie nur Brandenburg oder auch Berlin-Brandenburg-Routen?",
    answer: "Ein großer Teil unserer Einsätze verbindet Berlin mit Brandenburg. Genau darauf ist unsere Tourenplanung ausgerichtet.",
  },
  {
    question: "Welche Orte in Brandenburg fahren Sie regelmäßig an?",
    answer: "Unter anderem Potsdam, Falkensee, Oranienburg, Bernau, Cottbus und Eberswalde sowie weitere Ziele nach Bedarf.",
  },
  {
    question: "Kann ich den Umzug online anfragen?",
    answer: "Ja. Über den Buchungsprozess erhalten Sie eine schnelle Preisorientierung und können den Einsatz direkt anfragen.",
  },
];

export default async function UmzugBrandenburgPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="umzug-brandenburg-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>
      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Umzugsfirma Brandenburg - Auch außerhalb Berlins</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Wir begleiten Umzüge von Berlin nach Brandenburg und innerhalb Brandenburgs mit klaren Fahrtrouten,
            genauer Zeitplanung und einem eingespielten Team für regionale wie auch größere Strecken.
          </p>
        </div>
      </section>
      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Berlin und Brandenburg als eingespielte Route</h2>
              <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Gerade auf den Strecken zwischen Berlin und Brandenburg sind Vorbereitung, Ladefolge und genaue Zeitfenster entscheidend.
                Deshalb planen wir Touren nach Potsdam, Falkensee, Oranienburg, Bernau, Cottbus und Eberswalde besonders sorgfältig.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Berlin-Potsdam", "Berlin-Falkensee", "Berlin-Oranienburg", "Berlin-Bernau", "Berlin-Cottbus", "Berlin-Eberswalde"].map((item) => (
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
                Mindestabnahme 2 Stunden. Strecke, Ladevolumen und Zusatzleistungen werden transparent ergänzt.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Umzug anfragen
                  <ArrowRight size={16} />
                </Link>
                <Link href="/leistungen/umzug-berlin" className="text-sm font-semibold text-teal-600 transition hover:text-teal-500">
                  Zurück zu Umzugsfirma Berlin
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
