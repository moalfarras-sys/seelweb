import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Firmenumzug Berlin - Projektplanung mit minimaler Ausfallzeit",
  description:
    "Firmenumzug in Berlin mit klarer Projektplanung, IT-sicherem Transport und minimaler Betriebsunterbrechung für Unternehmen, Kanzleien, Praxen und Agenturen.",
  path: "/leistungen/firmenumzug",
});

const faqItems = [
  {
    question: "Wie minimieren Sie die Ausfallzeit für unser Unternehmen?",
    answer: "Wir planen Etappen, Zeitfenster und Möbellogistik vorab, damit kritische Arbeitsbereiche schnell wieder einsatzbereit sind. Umzüge können auch abends oder am Wochenende stattfinden.",
  },
  {
    question: "Transportieren Sie auch IT-Equipment und sensible Geräte?",
    answer: "Ja. Monitore, Rechner, Drucker, Server und sensible Ausstattung werden geordnet erfasst, geschützt verpackt und sicher verlagert.",
  },
  {
    question: "Können Sie auch eine Reinigung nach dem Umzug übernehmen?",
    answer: "Ja. Auf Wunsch kombinieren wir den Firmenumzug mit einer Übergabereinigung für die alten Büroräume oder einer Grundreinigung der neuen Fläche.",
  },
  {
    question: "Für welche Unternehmensgrößen bieten Sie Firmenumzüge an?",
    answer: "Von Einzelunternehmen bis hin zu mittelständischen Betrieben mit mehreren Etagen. Für jedes Projekt erstellen wir einen individuellen Ablaufplan.",
  },
];

export default async function FirmenumzugPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="firmenumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Firmenumzug Berlin - Projektplanung mit minimaler Ausfallzeit</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Für Unternehmen, Kanzleien, Praxen und Agenturen koordinieren wir Arbeitsplätze, Technik und
            Archivsysteme mit einem belastbaren Ablaufplan und klaren Meilensteinen.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600">
              Firmenumzug anfragen
              <ArrowRight size={16} />
            </Link>
            <Link href="/kontakt?subject=Festpreisanfrage%20-%20Firmenumzug" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
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
              "Sicherer Transport von IT-Equipment, Möbeln und Archivmaterial",
              "Umzug außerhalb Ihrer Kernzeiten – abends und am Wochenende",
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
                  "Vorabstimmung mit Projektleitung",
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Startpreis</p>
              <p className="mt-4 text-3xl font-bold text-navy-800 dark:text-white">{formatPricePerHour(prices.umzugStandard)}</p>
              <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">
                Mindestabnahme 2 Stunden. Je nach Projektumfang kalkulieren wir zusätzlich Anfahrtswege, Trageaufwand und Sonderleistungen.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=MOVING" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  Firmenumzug buchen
                  <ArrowRight size={16} />
                </Link>
                <Link href="/leistungen/gewerbe" className="text-sm font-semibold text-teal-600 transition hover:text-teal-500">
                  Büro- & Gewerbeumzug ansehen
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
            <Link href="/leistungen/gewerbe" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Büro- & Gewerbeumzug
            </Link>
            <Link href="/leistungen/schulumzug" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Schulumzug
            </Link>
            <Link href="/leistungen/reinigung" className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
              Reinigung
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
