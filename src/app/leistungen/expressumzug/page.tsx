import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { AlertTriangle, ArrowRight, Check, Clock, Shield, Sparkles, Truck } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Expressumzug Berlin – Kurzfristig und zuverlässig",
  description:
    "Expressumzug in Berlin mit schneller Disposition, klarer Preisstruktur und verlässlicher Durchführung innerhalb kurzer Vorlaufzeiten.",
  path: "/leistungen/expressumzug",
});

const features = [
  "Umzug innerhalb von 24 bis 48 Stunden",
  "Abend- und Wochenendumzüge",
  "Priorisierte Terminvergabe",
  "Erfahrenes Express-Team",
  "Verpackungsmaterial auf Wunsch",
  "Moderne Fahrzeuge mit Hebebühne",
  "Möbelmontage und Demontage",
  "Halteverbotszone auf Wunsch",
];

export default async function ExpressumzugPage() {
  const prices = await getPrices();
  const expressPrice = formatPricePerHour(prices.umzugExpress);
  const standardPrice = formatPricePerHour(prices.umzugStandard).replace("ab ", "");

  const faqs = [
    {
      q: "Was kostet ein Expressumzug?",
      a: `Expressumzüge starten bei ${expressPrice.replace("ab ", "")}. Der reguläre Umzugspreis liegt bei ${standardPrice}. Für kurzfristige Einsätze erhalten Sie direkt einen klar ausgewiesenen Expresspreis ohne zusätzliche Zuschlagslogik.`,
    },
    {
      q: "Wie kurzfristig können Sie starten?",
      a: "Bei Verfügbarkeit auch innerhalb von 24 Stunden. Für eine sichere Planung empfehlen wir möglichst 48 Stunden Vorlauf.",
    },
    {
      q: "Ist Express auch am Wochenende möglich?",
      a: "Ja. Wochenend- und Abendtermine sind möglich und werden vorab transparent im Angebot ausgewiesen.",
    },
    {
      q: "Leidet die Qualität unter der kurzen Vorlaufzeit?",
      a: "Nein. Sie erhalten den gleichen Qualitätsstandard wie beim regulären Umzug, nur mit priorisierter Disposition und schneller Terminvergabe.",
    },
  ];

  return (
    <>
      <Script id="expressumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((item) => ({ question: item.q, answer: item.a }))))}
      </Script>

      <section className="hero-led-section relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#08111d_0%,#0e1b2f_48%,#2f1d0f_100%)]" />
        <Image
          src="/images/Express.jpeg"
          alt="SEEL Transport Expressumzug Berlin – kurzfristiger Umzug mit schneller Disposition"
          fill
          className="object-cover opacity-24"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.2),transparent_24%),linear-gradient(180deg,rgba(4,8,16,0.16)_0%,rgba(4,8,16,0.58)_100%)]" />
        <div className="hero-copy-flow relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/12 bg-white/10 backdrop-blur-xl">
            <Sparkles className="text-amber-300" size={38} />
          </div>
          <p className="section-eyebrow mx-auto text-cyan-200/90">Express-Service</p>
          <h1 className="hero-title-strong mx-auto max-w-4xl font-display text-4xl font-bold text-white md:text-6xl">
            Expressumzug mit Tempo, ohne hektisch zu wirken.
          </h1>
          <p className="hero-body mx-auto max-w-3xl text-white/80">
            Für dringende Umzüge in Berlin und Brandenburg mit klarer Preislogik, schneller Rückmeldung und einem Team, das auch unter Zeitdruck sauber arbeitet.
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">24–48h Vorlauf</span>
            <span className="hero-metric">Priorisierte Disposition</span>
            <span className="hero-metric">Express ab {expressPrice.replace("ab ", "")}</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/buchen?service=EXPRESS_MOVING" className="btn-primary-glass gap-2 px-8 py-4">
              Expressumzug buchen <ArrowRight size={18} />
            </Link>
            <Link href="/kontakt?subject=Expressumzug%20Berlin" className="btn-secondary-glass px-8 py-4 text-white">
              Direkt Rückruf anfordern
            </Link>
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="premium-panel-dark overflow-hidden p-0">
              <div className="relative h-full min-h-[300px]">
                <Image
                  src="/images/Express.jpeg"
                  alt="Expressumzug Team von SEEL in Berlin"
                  fill
                  className="image-cinematic object-cover"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.08)_0%,rgba(2,8,18,0.76)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Klar priorisiert</p>
                  <p className="mt-3 max-w-md text-2xl font-semibold text-white">
                    Ein schneller Termin darf trotzdem hochwertig aussehen.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="glass-strong p-6 sm:p-7">
                <p className="section-eyebrow">Warum Express?</p>
                <h2 className="section-title mt-4 text-3xl">Schnell, sauber, nachvollziehbar.</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Clock, title: "24–48 Stunden", desc: "Kurzfristige Disposition ohne unklare Zusagen." },
                    { icon: Truck, title: "Volle Leistung", desc: "Gleiche Qualität wie regulär, nur schneller geplant." },
                    { icon: Shield, title: "Versichert", desc: "Transportversicherung gemäß HGB §451e inklusive." },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="glass-card p-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-gold/14 text-brand-gold">
                          <Icon size={19} />
                        </div>
                        <p className="mt-4 text-base font-semibold text-text-primary dark:text-text-on-dark">{item.title}</p>
                        <p className="mt-2 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-strong p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-amber-400/20 bg-amber-500/12">
                    <AlertTriangle className="text-amber-300" size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">Preishinweis</p>
                    <p className="mt-3 text-2xl font-semibold text-text-primary dark:text-text-on-dark">Klare Preislogik ohne Überraschungen</p>
                    <div className="mt-5 space-y-3 text-sm text-text-body dark:text-text-on-dark-muted">
                      <p>Regulärer Umzugspreis: ab {standardPrice}</p>
                      <p>Expresspreis: {expressPrice}</p>
                      <p>Der Expresspreis ist ein transparenter Festwert für priorisierte Einsatzplanung und schnelle Rückmeldung.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-5xl">
          <h2 className="section-title mb-8 text-center text-2xl md:text-3xl">Leistungsumfang</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="glass-card flex items-start gap-3 p-4">
                <Check size={18} className="mt-0.5 shrink-0 text-brand-teal" />
                <span className="text-sm text-text-primary dark:text-text-on-dark">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title mb-8 text-center text-2xl">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="glass-card group">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-text-primary dark:text-text-on-dark">
                  {faq.q}
                  <span className="text-lg text-brand-teal transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spotlight pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="premium-panel-dark px-8 py-10 sm:px-10 sm:py-12">
            <p className="section-eyebrow text-cyan-200/80">Jetzt anfragen</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Schnell umziehen ohne Kompromisse</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/72">
              Express-Service für dringende Umzüge mit verlässlicher Umsetzung, sichtbarer Ordnung und einem Auftritt, der zu einer Premium-Marke passt.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/buchen?service=EXPRESS_MOVING" className="btn-primary-glass gap-2 px-10 py-4">
                Expressumzug anfragen <ArrowRight size={20} />
              </Link>
              <Link href="/kontakt" className="btn-secondary-glass px-10 py-4 text-white">
                Rückruf anfordern
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
