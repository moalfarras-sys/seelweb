import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Büro- & Gewerbeumzug Berlin",
  description:
    "Büro- und Gewerbeumzug in Berlin für Unternehmen, Kanzleien, Agenturen und Praxen mit Projektplanung, IT-Handling und minimaler Ausfallzeit.",
  path: "/leistungen/gewerbe",
});

const faqItems = [
  {
    question: "Wie reduzieren Sie Ausfallzeiten im laufenden Betrieb?",
    answer: "Wir planen Etappen, Zeitfenster und Möbellogistik vorab, damit kritische Arbeitsbereiche schnell wieder einsatzbereit sind.",
  },
  {
    question: "Transportieren Sie auch IT-Equipment?",
    answer: "Ja. Monitore, Rechner, Drucker und sensible Ausstattung werden geordnet erfasst und geschützt verlagert.",
  },
  {
    question: "Kann nach dem Umzug eine Reinigung erfolgen?",
    answer: "Ja. Auf Wunsch kombinieren wir den Gewerbeumzug mit einer Reinigungsleistung für Übergabe, Teilflächen oder das alte Objekt.",
  },
];

export default async function GewerbePage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="gewerbe-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Büro- & Gewerbeumzug Berlin</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Für Unternehmen, Kanzleien, Agenturen und Praxen organisieren wir Gewerbeumzüge mit fester Projektplanung,
            klaren Zeitfenstern und möglichst geringer Unterbrechung Ihres Betriebs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600">
              Gewerbeumzug anfragen
              <ArrowRight size={16} />
            </Link>
            <Link href="/kontakt?subject=Festpreisanfrage%20-%20B%C3%BCro-%20%26%20Gewerbeumzug" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Minimale Ausfallzeit durch abgestimmte Projektplanung",
              "Transport von IT-Equipment, Möblierung und Archivmaterial",
              "Optional mit Übergabereinigung oder Teilflächenreinigung",
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
                  "Vorabstimmung mit Ansprechpartnern",
                  "Pack- und Transportkonzept",
                  "Möbel- und Arbeitsplatzverlagerung",
                  "IT- und Technikhandling",
                  "Etagen- und Zugangsplanung",
                  "Optionale Nachreinigung",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-silver-600 shadow-sm dark:border-navy-700/50 dark:bg-navy-900 dark:text-silver-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-8 dark:border-navy-700/50 dark:bg-navy-800/60">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Preisorientierung</p>
              <p className="mt-4 text-3xl font-bold text-navy-800 dark:text-white">{formatPricePerHour(prices.gewerbeUmzug)}</p>
              <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Mindestabnahme 2 Stunden. Je nach Projektumfang kalkulieren wir zusätzlich Anfahrtswege, Trageaufwand und Sonderleistungen.
              </p>
              <Link href="/leistungen/reinigung" className="mt-6 inline-flex text-sm font-semibold text-teal-600 transition hover:text-teal-500">
                Optionale Reinigung dazubuchen
              </Link>
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
