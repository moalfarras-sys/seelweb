import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Gallery from "@/components/Gallery";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reinigung Berlin - Wohnung, Büro und Übergabe",
  description:
    "Professionelle Reinigung in Berlin für Wohnungen, Büros und Objektübergaben. Klare Leistungslisten, feste Teams und transparente Preise von SEEL Transport.",
  path: "/leistungen/reinigung",
});

const faqItems = [
  {
    question: "Welche Reinigungsarten bieten Sie an?",
    answer:
      "Wir bieten Wohnungsreinigung, Endreinigung für Übergaben, Büro- und Praxisreinigung sowie gewerbliche Unterhaltsreinigung an. Jede Leistung arbeiten wir mit klarer Checkliste ab.",
  },
  {
    question: "Bringen Sie eigene Reinigungsmittel mit?",
    answer:
      "Ja. Unsere Teams arbeiten mit professionellen, umweltfreundlichen Reinigungsmitteln und eigenem Equipment. Sonderwünsche stimmen wir vorab ab.",
  },
  {
    question: "Wie wird der Preis kalkuliert?",
    answer:
      "Der Preis richtet sich nach der Fläche, dem Reinigungsumfang und optionalen Extras. Die Mindestdauer beträgt 2 Stunden. Über den Online-Rechner erhalten Sie eine erste Orientierung.",
  },
];

const cleaningGallery = [
  "clean (2).jpeg",
  "clean (3).jpeg",
  "clean (4).jpeg",
  "clean (5).jpeg",
  "clean (6).jpeg",
  "clean (7).jpeg",
  "clean (8).jpeg",
  "clean (9).jpeg",
  "clean (10).jpeg",
  "clean (12).jpeg",
  "clean (13).jpeg",
  "clean (15).jpeg",
  "clean (16).jpeg",
];

export default async function ReinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="reinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="relative px-4 pb-8 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="page-hero-shell">
            <div className="page-hero-grid">
              <div className="hero-copy-flow max-w-3xl">
                <p className="page-kicker">Reinigung Berlin</p>
                <h1 className="page-title max-w-[11ch]">
                  Wohnung, Büro und Übergabe in einer klaren Premium-Oberfläche.
                </h1>
                <p className="page-copy">
                  Ob Wohnungsreinigung, Endreinigung oder regelmäßige Büroreinigung:
                  SEEL arbeitet mit festen Teams, sauberer Checkliste und transparenter
                  Preisstruktur.
                </p>
                <div className="page-chip-row">
                  <span className="page-chip">{formatPricePerHour(prices.reinigungWohnung)}</span>
                  <span className="page-chip">Feste Teams</span>
                  <span className="page-chip">Berlin & Brandenburg</span>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/buchen?service=HOME_CLEANING" className="btn-primary-glass gap-2 px-7 py-4 text-base">
                    Reinigung buchen
                    <ArrowRight size={17} />
                  </Link>
                  <Link href="/kontakt?subject=Festpreisanfrage%20-%20Reinigung" className="btn-secondary-glass px-7 py-4 text-base">
                    Festpreis anfragen
                  </Link>
                </div>
              </div>

              <div className="page-info-card p-4 sm:p-5">
                <div className="relative min-h-[250px] overflow-hidden rounded-[26px]">
                  <Image
                    src="/images/cleaning-team-office.png"
                    alt="SEEL Reinigungsteam bei der professionellen Reinigung in Berlin"
                    fill
                    priority
                    className="image-cinematic object-cover"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,22,0.08)_0%,rgba(5,12,22,0.24)_44%,rgba(5,12,22,0.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="page-kicker">Saubere Übergabe</p>
                    <p className="mt-3 text-2xl font-semibold leading-tight sm:text-[2rem]">
                      Sichtbar gepflegte Räume statt improvisierter Reinigung.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Start", value: formatPricePerHour(prices.reinigungWohnung) },
                    { label: "Mindestdauer", value: "2 Std." },
                    { label: "Stil", value: "Checkliste" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/7 p-4 text-white">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/46">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Klare Leistungslisten mit dokumentierter Endkontrolle",
              "Feste Teams und planbare Intervalle",
              "Fair kalkulierte Preise ohne versteckte Pauschalen",
            ].map((item) => (
              <div key={item} className="glass-card p-6">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-teal-300" />
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="glass-strong p-6 sm:p-7">
              <p className="section-eyebrow">Was ist enthalten</p>
              <h2 className="section-title mt-4 text-3xl">Reinigung mit Struktur statt Zufall.</h2>
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

            <div className="glass-strong p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-gold">Startpreis</p>
              <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {formatPricePerHour(prices.reinigungWohnung)}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/60">
                Mindestabnahme 2 Stunden. Zusätzlicher Aufwand wie Fensterreinigung,
                Backofen oder Grundreinigung wird transparent kalkuliert.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/buchen?service=HOME_CLEANING" className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
                  Jetzt buchen
                  <ArrowRight size={16} />
                </Link>
                <Link href="/leistungen/endreinigung" className="text-sm font-semibold text-brand-teal transition hover:text-brand-teal-light">
                  Zur Endreinigung
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-4xl space-y-4 px-4 md:px-8">
          {faqItems.map((faq) => (
            <details key={faq.question} className="glass-card rounded-[24px] p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white">
                {faq.question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <Gallery
        title="Unsere Reinigungsarbeiten"
        subtitle="Einblicke"
        images={cleaningGallery.map((image, index) => ({
          src: `/images/clean/${image}`,
          alt: `SEEL Reinigung Berlin - Arbeitsbild ${index + 1}`,
        }))}
      />

      <section className="pb-24 pt-10">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <div className="page-info-card-light rounded-[30px] p-6">
            <h2 className="section-title text-3xl md:text-4xl">Verwandte Leistungen</h2>
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
        </div>
      </section>
    </>
  );
}
