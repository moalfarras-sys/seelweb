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

      <section className="bg-[linear-gradient(135deg,#0d1724_0%,#112132_52%,#173832_100%)] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Reinigung Berlin - Wohnung, Büro und Übergabe</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Ob Wohnungsreinigung, Endreinigung oder regelmäßige Büroreinigung — wir arbeiten mit klaren Leistungslisten,
            festen Teams und transparenter Preisstruktur.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen?service=HOME_CLEANING" className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
              Reinigung buchen
              <ArrowRight size={16} />
            </Link>
            <Link href="/kontakt?subject=Festpreisanfrage%20-%20Reinigung" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Klare Leistungslisten mit dokumentierter Endkontrolle",
              "Feste Teams und planbare Intervalle",
              "Fair kalkulierte Preise ohne versteckte Pauschalen",
            ].map((item) => (
              <div key={item} className="glass-card rounded-[28px] p-6">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-teal-300" />
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Was ist enthalten</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Endreinigung für Auszug und Übergabe",
                  "Wohnungsreinigung (einmalig oder regelmäßig)",
                  "Büro- und Praxisreinigung",
                  "Küchen- und Sanitärreinigung",
                  "Fensterreinigung (innen)",
                  "Boden-, Tür- und Heizkörperreinigung",
                ].map((item) => (
                  <div key={item} className="glass-card rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-white/60">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[28px] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">Startpreis</p>
              <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{formatPricePerHour(prices.reinigungWohnung)}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/60">
                Mindestabnahme 2 Stunden. Zusätzlicher Aufwand wie Fensterreinigung, Backofen oder Grundreinigung wird transparent kalkuliert.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=HOME_CLEANING" className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
                  Jetzt buchen
                  <ArrowRight size={16} />
                </Link>
                <Link href="/leistungen/endreinigung" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600 dark:text-teal-300">
                  Zur Endreinigung
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl space-y-4 px-4 md:px-8">
          {faqItems.map((faq) => (
            <details key={faq.question} className="glass-card rounded-[24px] p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white">{faq.question}</summary>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{faq.answer}</p>
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

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Verwandte Leistungen</h2>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/leistungen/endreinigung" className="btn-secondary-glass px-6 py-3.5 text-sm font-semibold">
              Endreinigung
            </Link>
            <Link href="/leistungen/entruempelung" className="btn-secondary-glass px-6 py-3.5 text-sm font-semibold">
              Entrümpelung
            </Link>
            <Link href="/leistungen/privatumzug" className="btn-secondary-glass px-6 py-3.5 text-sm font-semibold">
              Privatumzug
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
