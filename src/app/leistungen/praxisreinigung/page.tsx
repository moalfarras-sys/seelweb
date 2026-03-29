import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildMetadata, buildFaqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Praxisreinigung Berlin – Arztpraxis & Zahnarztpraxis",
  description:
    "Professionelle Praxisreinigung in Berlin für Arztpraxen, Zahnarztpraxen und medizinische Einrichtungen. Hygienekonforme Reinigung mit geschulten Teams und dokumentierter Qualitätskontrolle.",
  path: "/leistungen/praxisreinigung",
});

const benefits = [
  "Hygienekonforme Reinigung nach RKI-Empfehlungen",
  "Geschulte Teams mit Erfahrung in medizinischen Einrichtungen",
  "Dokumentierte Reinigungspläne und Qualitätskontrollen",
  "Flexible Reinigungszeiten außerhalb der Sprechstunden",
  "Desinfektion von Kontaktflächen und Wartebereichen",
  "Feste Ansprechpartner für Ihre Praxis",
];

const includedServices = [
  "Desinfizierende Reinigung von Behandlungsräumen",
  "Sanitärbereiche und WC-Anlagen",
  "Wartezimmer und Empfangsbereich",
  "Boden- und Oberflächenreinigung",
  "Kontaktflächendesinfektion (Türklinken, Schalter, Handläufe)",
  "Abfallentsorgung und Mülltrennung",
  "Fensterreinigung innen (auf Wunsch)",
  "Küchen- und Aufenthaltsräume",
];

const faqItems = [
  {
    question: "Erfüllt die Reinigung die Hygienevorschriften für Arztpraxen?",
    answer:
      "Ja. Unsere Teams arbeiten nach den RKI-Empfehlungen und verwenden geprüfte Desinfektionsmittel. Wir erstellen individuelle Hygienepläne und dokumentieren jede Reinigung nachvollziehbar.",
  },
  {
    question: "Wann findet die Reinigung statt?",
    answer:
      "Wir reinigen bevorzugt außerhalb der Sprechzeiten — frühmorgens, abends oder am Wochenende. Die Zeiten stimmen wir individuell mit Ihrer Praxis ab, damit der Betrieb nicht gestört wird.",
  },
  {
    question: "Können Sie auch Zahnarztpraxen reinigen?",
    answer:
      "Selbstverständlich. Wir reinigen Zahnarztpraxen, Allgemeinarztpraxen, Fachpraxen und MVZ. Unsere Teams kennen die besonderen Anforderungen an Hygiene und Desinfektion in zahnmedizinischen Bereichen.",
  },
  {
    question: "Wie wird die Qualität der Reinigung sichergestellt?",
    answer:
      "Jede Reinigung wird anhand einer Checkliste durchgeführt und dokumentiert. Regelmäßige Qualitätskontrollen vor Ort und ein fester Ansprechpartner garantieren ein gleichbleibend hohes Niveau.",
  },
];

const internalLinks = [
  { href: "/leistungen/bueroreinigung", label: "Büroreinigung" },
  { href: "/leistungen/kitareinigung", label: "Kita-Reinigung" },
  { href: "/leistungen/schulreinigung", label: "Schulreinigung" },
  { href: "/leistungen/gewerbereinigung", label: "Gewerbereinigung" },
  { href: "/leistungen/gastronomiereinigung", label: "Gastronomiereinigung" },
  { href: "/leistungen/reinigung", label: "Alle Reinigungsleistungen" },
];

export default async function PraxisreinigungPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="praxisreinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-300 backdrop-blur-xl">
            Medizinische Einrichtungen
          </p>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Praxisreinigung in Berlin
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Hygienekonforme Reinigung für Arztpraxen, Zahnarztpraxen und medizinische Einrichtungen.
            Geschulte Teams, dokumentierte Abläufe und flexible Reinigungszeiten außerhalb der Sprechstunden.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Angebot anfordern <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
              Vorteile
            </p>
            <h2 className="mt-4 text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">
              Warum Praxen uns vertrauen
            </h2>
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
              Leistungsumfang
            </p>
            <h2 className="mt-4 text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">
              Was ist enthalten
            </h2>
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
          <p className="mt-4 text-4xl font-bold text-teal-600">
            {formatPricePerHour(prices.reinigungBuero)}
          </p>
          <p className="mt-2 text-sm text-silver-500">Mindestabnahme 2 Stunden</p>
          <Link
            href="/kontakt"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Festpreis anfragen <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-navy-800 dark:text-white">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details
                key={faq.question}
                className="rounded-3xl border border-gray-100 bg-white p-5 dark:border-navy-700/50 dark:bg-navy-800/60"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-navy-800 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-navy py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Saubere Praxis, zufriedene Patienten
          </h2>
          <p className="mt-5 text-lg text-silver-300">
            Lassen Sie uns gemeinsam ein Reinigungskonzept für Ihre Praxis entwickeln.
            Kontaktieren Sie uns für ein unverbindliches Angebot.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Jetzt Angebot anfordern
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-4 text-sm font-semibold text-navy-800 dark:text-white">
            Weitere Reinigungsleistungen
          </p>
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
