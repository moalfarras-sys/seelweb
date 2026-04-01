import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Firmenumzug Berlin – Projektplanung mit minimaler Ausfallzeit",
  description:
    "Firmenumzug in Berlin mit klarer Projektplanung, IT-sicherem Transport und minimaler Betriebsunterbrechung für Unternehmen, Kanzleien, Praxen und Agenturen.",
  path: "/leistungen/firmenumzug",
});

const benefits = [
  "Minimale Ausfallzeit durch abgestimmte Meilensteinplanung",
  "IT-sicherer Transport – Monitore, Server, sensible Geräte",
  "Umzug außerhalb Ihrer Kernzeiten – abends und am Wochenende",
  "Etagen- und Zugangsplanung für komplexe Gebäudestrukturen",
  "Versicherter Transport nach HGB §451e",
  "Optionale Nachreinigung der alten Räumlichkeiten",
];

const includedServices = [
  "Vorabstimmung mit Projektleitung",
  "Individuelles Pack- und Transportkonzept",
  "Arbeitsplatz- und Möbelverlagerung",
  "IT- und Technikhandling (Rechner, Drucker, Server)",
  "Archivsysteme und Aktenumzug",
  "Etagen- und Zugangsplanung",
  "Halteverbotszonen für Be- und Entladung",
  "Optionale Grundreinigung der neuen Fläche",
];

const faqItems = [
  {
    question: "Wie minimieren Sie die Ausfallzeit für unser Unternehmen?",
    answer:
      "Wir planen Etappen, Zeitfenster und Möbellogistik vorab, damit kritische Arbeitsbereiche schnell wieder einsatzbereit sind. Umzüge können auch abends oder am Wochenende stattfinden.",
  },
  {
    question: "Transportieren Sie auch IT-Equipment und sensible Geräte?",
    answer:
      "Ja. Monitore, Rechner, Drucker, Server und sensible Ausstattung werden geordnet erfasst, geschützt verpackt und sicher verlagert.",
  },
  {
    question: "Können Sie auch eine Reinigung nach dem Umzug übernehmen?",
    answer:
      "Ja. Auf Wunsch kombinieren wir den Firmenumzug mit einer Übergabereinigung für die alten Büroräume oder einer Grundreinigung der neuen Fläche.",
  },
  {
    question: "Für welche Unternehmensgrößen bieten Sie Firmenumzüge an?",
    answer:
      "Von Einzelunternehmen bis hin zu mittelständischen Betrieben mit mehreren Etagen. Für jedes Projekt erstellen wir einen individuellen Ablaufplan.",
  },
  {
    question: "Wie läuft die Projektplanung ab?",
    answer:
      "Zunächst erfassen wir Rahmendaten wie Größe, Etage, Technikumfang und Zeitrahmen. Daraus entsteht ein Meilensteinplan mit klaren Zuständigkeiten, den wir vor dem Umzug gemeinsam freigeben.",
  },
];

const internalLinks = [
  { href: "/leistungen/gewerbe", label: "Gewerbeumzug" },
  { href: "/leistungen/privatumzug", label: "Privatumzug" },
  { href: "/leistungen/umzug-berlin", label: "Umzug Berlin" },
  { href: "/leistungen/schulumzug", label: "Schulumzug" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/reinigung", label: "Reinigung" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
  { href: "/leistungen/umzug-brandenburg", label: "Umzug Brandenburg" },
];

export default async function FirmenumzugPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="firmenumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="bg-[linear-gradient(135deg,#0d1724_0%,#112132_52%,#173832_100%)] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <p className="inline-flex rounded-full border border-emerald-200/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-xl">
            Für Unternehmen & Gewerbe
          </p>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Firmenumzug Berlin – Projektplanung mit minimaler Ausfallzeit
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Für Unternehmen, Kanzleien, Praxen und Agenturen koordinieren wir Arbeitsplätze, Technik und
            Archivsysteme mit einem belastbaren Ablaufplan und klaren Meilensteinen.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/buchen?service=MOVING&variant=business"
              className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
            >
              Firmenumzug anfragen
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20Firmenumzug"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">
              Vorteile
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Warum Unternehmen uns vertrauen
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div key={item} className="glass-card rounded-[28px] p-6">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-teal-300" />
                <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">
              Leistungsumfang
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Was ist enthalten</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {includedServices.map((item) => (
              <div
                key={item}
                className="glass-card rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-white/60"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Preise</h2>
          <p className="mt-4 text-4xl font-bold text-emerald-700 dark:text-teal-300">
            {formatPricePerHour(prices.gewerbeUmzug)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mindestabnahme 2 Stunden · Je nach Projektumfang kalkulieren wir Anfahrtswege, Trageaufwand und Sonderleistungen
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/buchen?service=MOVING&variant=business"
              className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
            >
              Firmenumzug buchen <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20Firmenumzug"
              className="btn-secondary-glass px-6 py-3.5 text-sm font-semibold"
            >
              Festpreis anfragen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-white">Häufige Fragen</h2>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details key={faq.question} className="glass-card rounded-[24px] p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0d1724_0%,#112132_52%,#173832_100%)] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Ihr Firmenumzug – jetzt planen</h2>
          <p className="mt-5 text-lg text-white/75">
            Kontaktieren Sie uns für eine individuelle Projektplanung. Wir erstellen Ihnen ein unverbindliches
            Angebot mit klarem Ablaufplan.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/kontakt?subject=Firmenumzug%20Anfrage"
              className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
            >
              Jetzt Angebot anfordern
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Weitere Leistungen</p>
          <div className="flex flex-wrap gap-3">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/10 dark:text-white/70 dark:hover:text-teal-300"
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
