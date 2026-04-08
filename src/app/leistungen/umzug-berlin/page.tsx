import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Umzugsfirma Berlin | Professionell ab 79 €/Std.",
  description:
    "Ihre Umzugsfirma in Berlin: Mitte, Neukölln, Charlottenburg, Spandau, Friedrichshain, Kreuzberg, Tempelhof, Pankow und weitere Bezirke. Transparente Preise und zuverlässige Teams.",
  path: "/leistungen/umzug-berlin",
  keywords: ["umzugsfirma berlin", "umzug berlin", "umzugsunternehmen berlin", "möbeltransport berlin"],
});

const districts = [
  "Mitte", "Neukölln", "Charlottenburg", "Spandau",
  "Friedrichshain", "Kreuzberg", "Tempelhof", "Pankow",
  "Prenzlauer Berg", "Steglitz", "Schöneberg", "Wedding",
];

const benefits = [
  "Ortskenntnis in allen Berliner Bezirken und Kiezen",
  "Halteverbotszonen-Planung inklusive Genehmigung",
  "Enge Treppenhäuser, Hinterhöfe und Altbauten kein Problem",
  "Versicherter Transport nach HGB §451e",
  "Flexible Termine auch kurzfristig verfügbar",
  "Kombination mit Reinigung und Entrümpelung möglich",
];

const includedServices = [
  "Vorabbesichtigung und individuelle Planung",
  "Be- und Entladen aller Möbel und Kartons",
  "Möbelmontage und -demontage",
  "Schutz für Böden, Türrahmen und Geländer",
  "Halteverbotszone vor beiden Adressen",
  "Fahrzeuge passend zur Wohnungsgröße",
  "Schwertransport (Klavier, Tresor, etc.)",
  "Optionale Endreinigung der alten Wohnung",
];

const faqItems = [
  {
    question: "Welche Berliner Bezirke betreuen Sie?",
    answer:
      "Wir fahren regelmäßig Einsätze in Mitte, Neukölln, Charlottenburg, Spandau, Friedrichshain, Kreuzberg, Tempelhof, Pankow, Prenzlauer Berg, Steglitz, Schöneberg und Wedding – sowie allen weiteren Stadtteilen.",
  },
  {
    question: "Kennen Sie die typischen Berliner Zufahrten und Hinterhöfe?",
    answer:
      "Ja. Als Berliner Umzugsfirma planen wir Halteverbotszonen, Ladepunkte und knappe Zufahrten frühzeitig mit ein. Altbauten mit engen Treppenhäusern gehören zu unseren täglichen Einsätzen.",
  },
  {
    question: "Führen Sie auch Umzüge nach Brandenburg aus?",
    answer:
      "Ja. Berlin-Brandenburg-Routen gehören zu unseren häufigsten Einsätzen und werden mit klaren Fahrfenstern geplant. Auch deutschlandweite Umzüge organisieren wir.",
  },
  {
    question: "Was kostet ein Umzug in Berlin?",
    answer:
      "Der Preis richtet sich nach Wohnungsgröße, Etage, Entfernung und Zusatzleistungen. Über unseren Online-Rechner erhalten Sie sofort eine Orientierung – das verbindliche Angebot folgt nach Ihrer Anfrage.",
  },
  {
    question: "Wie kurzfristig können Sie einen Umzug übernehmen?",
    answer:
      "Standardumzüge planen wir mit festem Zeitfenster. Für dringende Fälle bieten wir einen Expressumzug innerhalb von 24–48 Stunden an.",
  },
];

const internalLinks = [
  { href: "/leistungen/privatumzug", label: "Privatumzug" },
  { href: "/leistungen/firmenumzug", label: "Firmenumzug" },
  { href: "/leistungen/gewerbe", label: "Gewerbeumzug" },
  { href: "/leistungen/schulumzug", label: "Schulumzug" },
  { href: "/leistungen/expressumzug", label: "Expressumzug" },
  { href: "/leistungen/umzug-brandenburg", label: "Umzug Brandenburg" },
  { href: "/leistungen/reinigung", label: "Reinigung" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
];

export default async function UmzugBerlinPage() {
  const prices = await getPrices();

  return (
    <>
      <Script id="umzug-berlin-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="hero-led-section kinetic-hero bg-[linear-gradient(135deg,#0d1724_0%,#112132_52%,#173832_100%)] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <p className="inline-flex rounded-full border border-emerald-200/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-xl">
            Ihre Umzugsfirma in Berlin
          </p>
          <h1 className="headline-prism mt-6 text-4xl font-bold md:text-5xl">
            Umzugsfirma Berlin – Schnell, Sicher, Zuverlässig
          </h1>
          <p className="hero-body mx-auto mt-5 max-w-3xl text-white/85 dark:text-white/85">
            Seit über 10 Jahren begleiten wir Umzüge in Berlin mit eingespielten Prozessen, Ortskenntnis
            und verlässlicher Kommunikation. Mehr als 500 Einsätze haben unsere Abläufe für die Hauptstadt geschärft.
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">Berlin Experten</span>
            <span className="hero-metric">Halteverbotszonen</span>
            <span className="hero-metric">Express moglich</span>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/buchen?service=MOVING"
              className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
            >
              Umzug in Berlin starten
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20Umzug%20Berlin"
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">Vorteile</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Warum Berliner uns vertrauen
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="glass-card rounded-[28px] p-6"
              >
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">Einsatzgebiet</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Berliner Bezirke im Überblick
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/60">
              Wer in Berlin umzieht, braucht mehr als ein Transportfahrzeug. Wir planen Zufahrten, Halteverbotszonen,
              enge Treppenhäuser und Ladewege für die typischen Berliner Kieze besonders genau.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {districts.map((district) => (
              <div
                key={district}
                className="glass-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white/80"
              >
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-teal-300 shrink-0" />
                {district}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">Leistungsumfang</p>
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
          <p className="mt-4 text-4xl font-bold text-emerald-700 dark:text-teal-300">{formatPricePerHour(prices.umzugStandard)}</p>
          <p className="mt-2 text-sm text-slate-500">
            Mindestabnahme 2 Stunden · Expressumzüge ab {formatPricePerHour(prices.umzugExpress).replace("ab ", "")}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/buchen?service=MOVING"
              className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold"
            >
              Jetzt buchen <ArrowRight size={16} />
            </Link>
            <Link
              href="/kontakt?subject=Festpreisanfrage%20-%20Umzug%20Berlin"
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
              <details
                key={faq.question}
                className="glass-card rounded-[24px] p-5"
              >
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
          <h2 className="text-3xl font-bold text-white md:text-4xl">Ihr Umzug in Berlin — jetzt planen</h2>
          <p className="mt-5 text-lg text-white/75">
            Lassen Sie uns gemeinsam Ihren Umzug planen. Kontaktieren Sie uns für eine individuelle Beratung
            und ein unverbindliches Angebot.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/kontakt?subject=Umzug%20Berlin%20Anfrage"
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
