import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Umzugsfirma Berlin - Schnell, Sicher, Zuverlässig",
  description:
    "Umzugsfirma Berlin mit Erfahrung in Mitte, Neukölln, Charlottenburg, Spandau, Friedrichshain, Kreuzberg, Tempelhof, Pankow, Prenzlauer Berg und Steglitz.",
  path: "/leistungen/umzug-berlin",
});

const faqItems = [
  {
    question: "Welche Berliner Bezirke betreuen Sie?",
    answer: "Wir fahren regelmäßig Einsätze in Mitte, Neukölln, Charlottenburg, Spandau, Friedrichshain, Kreuzberg, Tempelhof, Pankow, Prenzlauer Berg und Steglitz.",
  },
  {
    question: "Kennen Sie Halteverbotszonen und typische Zufahrten?",
    answer: "Ja. Als Berliner Umzugsfirma planen wir Halteverbotszonen, Ladepunkte und knappe Zufahrten frühzeitig mit ein.",
  },
  {
    question: "Führen Sie auch Umzüge nach Brandenburg aus?",
    answer: "Ja. Berlin-Brandenburg-Routen gehören zu unseren häufigsten Einsätzen und werden mit klaren Fahrfenstern geplant.",
  },
];

export default async function UmzugBerlinPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="umzug-berlin-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>
      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Umzugsfirma Berlin - Schnell, Sicher, Zuverlässig</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Seit über 10 Jahren begleiten wir Umzüge in Berlin mit eingespielten Prozessen, Ortskenntnis und verlässlicher Kommunikation.
            Mehr als 500 Einsätze haben unsere Abläufe für die Hauptstadt geschärft.
          </p>
        </div>
      </section>
      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Berlin-spezifische Einsatzplanung</h2>
              <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Wer in Berlin umzieht, braucht mehr als ein Transportfahrzeug. Wir planen Zufahrten, Halteverbotszonen, enge Treppenhäuser,
                Ladewege und enge Terminfenster für die typischen Berliner Kieze besonders genau.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Mitte", "Neukölln", "Charlottenburg", "Spandau", "Friedrichshain", "Kreuzberg", "Tempelhof", "Pankow", "Prenzlauer Berg", "Steglitz"].map((district) => (
                  <div key={district} className="flex items-start gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-navy-800 dark:border-navy-700/50 dark:bg-navy-800/60 dark:text-silver-200">
                    <CheckCircle2 size={16} className="mt-0.5 text-teal-500" />
                    {district}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-8 dark:border-navy-700/50 dark:bg-navy-800/60">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Preisorientierung</p>
              <p className="mt-4 text-3xl font-bold text-navy-800 dark:text-white">{formatPricePerHour(prices.umzugStandard)}</p>
              <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Mindestabnahme 2 Stunden. Expressumzüge starten bei {formatPricePerHour(prices.umzugExpress).replace("ab ", "")}.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Umzug in Berlin starten
                  <ArrowRight size={16} />
                </Link>
                <Link href="/leistungen/umzug-brandenburg" className="text-sm font-semibold text-teal-600 transition hover:text-teal-500">
                  Auch für Brandenburg verfügbar
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
