import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check, Clock3, MapPin, Shield, Truck, Users } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privatumzug Berlin | SEEL Transport & Reinigung",
  description:
    "Strukturierte Privatumzüge in Berlin, Brandenburg und deutschlandweit mit klarer Planung, versichertem Ablauf und transparentem Startpreis ab 59 €/Std.",
  path: "/leistungen/umzug",
});

const benefits = [
  {
    icon: Truck,
    title: "Sauber disponiert",
    desc: "Feste Abläufe, klare Zeitslots und ein Team, das auch bei engen Treppenhäusern ruhig arbeitet.",
  },
  {
    icon: Shield,
    title: "Versichert nach HGB",
    desc: "Transportversicherung gemäß HGB §451e für einen nachvollziehbaren und professionellen Umzug.",
  },
  {
    icon: Users,
    title: "Persönliche Begleitung",
    desc: "Ein fester Ansprechpartner koordiniert Rückfragen, Timing und Zusatzleistungen aus einer Hand.",
  },
];

const features = [
  "Möbelmontage und Demontage",
  "Verpackungsmaterial auf Wunsch",
  "Halteverbotszone koordinierbar",
  "Tragehilfe auch ohne Aufzug",
  "Sensible Transporte für Einzelstücke",
  "Besenreine Übergabe bei Bedarf",
  "Berlin, Brandenburg und bundesweit",
  "Express-Option innerhalb von 48 Stunden",
];

const faqs = [
  {
    q: "Wie wird ein Privatumzug kalkuliert?",
    a: "Die Kalkulation orientiert sich an Zeitbedarf, Volumen, Erreichbarkeit und gewünschtem Leistungsumfang. Sie erhalten vorab eine klare Einschätzung ohne unruhige Zuschlagsstruktur.",
  },
  {
    q: "Arbeiten Sie nur in Berlin?",
    a: "Nein. Wir fahren in ganz Berlin, im Umland Brandenburgs und übernehmen auf Anfrage auch deutschlandweite Umzüge mit sauberer Etappenplanung.",
  },
  {
    q: "Kann ich Verpackung und Montage dazubuchen?",
    a: "Ja. Kartons, Material, Demontage und Montage können direkt in der Anfrage mit aufgenommen werden.",
  },
  {
    q: "Ist auch ein kurzfristiger Termin möglich?",
    a: "Ja. Für kurzfristige Einsätze können wir je nach Verfügbarkeit auch Express-Fenster einplanen.",
  },
];

export default function UmzugPage() {
  return (
    <>
      <Script id="umzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((item) => ({ question: item.q, answer: item.a }))))}
      </Script>

      <section className="hero-led-section relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#08111d_0%,#10253b_48%,#16324a_100%)]" />
        <Image
          src="/images/umzug-1.jpeg"
          alt="SEEL Privatumzug in Berlin mit organisiertem Möbeltransport"
          fill
          className="object-cover opacity-24"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,229,186,0.16),transparent_26%),linear-gradient(180deg,rgba(2,8,18,0.12)_0%,rgba(2,8,18,0.64)_100%)]" />
        <div className="hero-copy-flow relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/12 bg-white/10 backdrop-blur-xl">
            <Truck className="text-brand-teal-light" size={38} />
          </div>
          <p className="section-eyebrow mx-auto text-cyan-200/90">Privatumzug Berlin & Brandenburg</p>
          <h1 className="hero-title-strong mx-auto max-w-4xl font-display text-4xl font-bold text-white md:text-6xl">
            Umziehen mit Ruhe, Struktur und einem starken Auftritt.
          </h1>
          <p className="hero-body mx-auto max-w-3xl text-white/80">
            SEEL organisiert Privatumzüge für Wohnungen, Häuser und Etappenwechsel mit klarer Kommunikation, versichertem Ablauf und einem Erscheinungsbild, das hochwertig wirkt statt hektisch.
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">Standard ab 59 €/Std.</span>
            <span className="hero-metric">HGB §451e versichert</span>
            <span className="hero-metric">Berlin · Brandenburg · bundesweit</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/buchen?service=MOVING" className="btn-primary-glass gap-2 px-8 py-4">
              Jetzt Umzug anfragen <ArrowRight size={18} />
            </Link>
            <Link href="/kontakt?subject=Privatumzug%20Berlin" className="btn-secondary-glass px-8 py-4 text-white">
              Rückruf anfordern
            </Link>
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="premium-panel-dark overflow-hidden p-0">
              <div className="relative h-full min-h-[320px]">
                <Image
                  src="/images/moving-truck-hero.png"
                  alt="SEEL Transport Fahrzeug für Umzüge in Berlin"
                  fill
                  className="image-cinematic object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.08)_0%,rgba(2,8,18,0.76)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Präzise statt laut</p>
                  <p className="mt-3 max-w-md text-2xl font-semibold text-white">
                    Ein Umzug darf modern, ruhig und verlässlich wirken.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 sm:p-7">
              <p className="section-eyebrow">Ihre Vorteile</p>
              <h2 className="section-title mt-4 text-3xl">Mehr Kontrolle vom ersten Karton bis zur letzten Übergabe.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {benefits.map((item) => {
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
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="section-title mb-8 text-center text-2xl md:text-3xl">Leistungsumfang</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="glass-card flex items-start gap-3 p-4">
                  <Check size={18} className="mt-0.5 shrink-0 text-brand-teal" />
                  <span className="text-sm text-text-primary dark:text-text-on-dark">{feature}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <div className="glass-strong p-6 sm:p-8">
              <h2 className="section-title text-2xl">Transparente Preislogik</h2>
              <p className="mt-4 text-text-body dark:text-text-on-dark-muted">
                Standardumzüge starten bei 59 €/Std. Je nach Volumen, Etage, Distanz und Zusatzleistungen entsteht eine klare Einschätzung, die Sie vorab sauber nachvollziehen können.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: Clock3, label: "Zeitbasiert" },
                  { icon: MapPin, label: "Nach Strecke & Zugang" },
                  { icon: Shield, label: "Versichert geplant" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="glass-card p-4 text-center">
                      <Icon className="mx-auto mb-2 text-brand-gold" size={22} />
                      <span className="text-sm font-medium text-text-primary dark:text-text-on-dark">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
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
          <ScrollReveal>
            <div className="premium-panel-dark px-8 py-10 sm:px-10 sm:py-12">
              <p className="section-eyebrow text-cyan-200/80">Bereit für den Wechsel?</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Planen Sie Ihren Umzug mit einer klaren Premium-Oberfläche.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/72">
                Sie erhalten eine strukturierte Anfrageführung, sichtbare Preistransparenz und einen Auftritt, der auch auf dem Handy hochwertig bleibt.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/buchen?service=MOVING" className="btn-primary-glass gap-2 px-10 py-4">
                  Jetzt Angebot anfordern <ArrowRight size={20} />
                </Link>
                <Link href="/kontakt" className="btn-secondary-glass px-10 py-4 text-white">
                  Kontakt aufnehmen
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
