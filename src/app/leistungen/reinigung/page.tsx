import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = buildMetadata({
  title: "Reinigung Berlin - Wohnung, Büro und Übergabe",
  description:
    "Professionelle Reinigung in Berlin für Wohnungen, Büros und Objektübergaben. Klare Leistungslisten, feste Teams und transparente Preise von SEEL Transport.",
  path: "/leistungen/reinigung",
});

const faqItems = [
  {
    question: "Welche Reinigungsarten bieten Sie an?",
    answer: "Wir bieten Wohnungsreinigung, Endreinigung für Übergaben, Büro- und Praxisreinigung sowie gewerbliche Unterhaltsreinigung an. Jede Leistung arbeiten wir mit klarer Checkliste ab.",
  },
  {
    question: "Bringen Sie eigene Reinigungsmittel mit?",
    answer: "Ja. Unsere Teams arbeiten mit professionellen, umweltfreundlichen Reinigungsmitteln und eigenem Equipment. Sonderwünsche stimmen wir vorab ab.",
  },
  {
    question: "Wie wird der Preis kalkuliert?",
    answer: "Der Preis richtet sich nach der Fläche, dem Reinigungsumfang und optionalen Extras. Die Mindestdauer beträgt 2 Stunden. Über den Online-Rechner erhalten Sie eine erste Orientierung.",
  },
];

export default async function ReinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="reinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Reinigung Berlin - Wohnung, Büro und Übergabe</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Ob Wohnungsreinigung, Endreinigung oder regelmäßige Büroreinigung — wir arbeiten mit klaren Leistungslisten,
            festen Teams und transparenter Preisstruktur.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen?service=HOME_CLEANING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600">
              Reinigung buchen
              <ArrowRight size={16} />
            </Link>
            <Link href="/kontakt?subject=Festpreisanfrage%20-%20Reinigung" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Klare Leistungslisten mit dokumentierter Endkontrolle",
              "Feste Teams und planbare Intervalle",
              "Fair kalkulierte Preise ohne versteckte Pauschalen",
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
                  "Endreinigung für Auszug und Übergabe",
                  "Wohnungsreinigung (einmalig oder regelmäßig)",
                  "Büro- und Praxisreinigung",
                  "Küchen- und Sanitärreinigung",
                  "Fensterreinigung (innen)",
                  "Boden-, Tür- und Heizkörperreinigung",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-silver-600 shadow-sm dark:border-navy-700/50 dark:bg-navy-900 dark:text-silver-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-8 dark:border-navy-700/50 dark:bg-navy-800/60">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Startpreis</p>
              <p className="mt-4 text-3xl font-bold text-navy-800 dark:text-white">{formatPricePerHour(prices.reinigungWohnung)}</p>
              <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Mindestabnahme 2 Stunden. Zusätzlicher Aufwand wie Fensterreinigung, Backofen oder Grundreinigung wird transparent kalkuliert.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=HOME_CLEANING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Jetzt buchen
                  <ArrowRight size={16} />
                </Link>
                <Link href="/leistungen/endreinigung" className="text-sm font-semibold text-teal-600 transition hover:text-teal-500">
                  Zur Endreinigung
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

      <Gallery
        title="Unsere Reinigungsarbeiten"
        subtitle="Einblicke"
        images={Array.from({ length: 16 }, (_, i) => ({
          src: `/images/clean/clean (${i + 1}).jpeg`,
          alt: `SEEL Reinigung Berlin - Arbeitsbild ${i + 1}`,
        }))}
      />

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
            <Link href="/leistungen/privatumzug" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Privatumzug
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
