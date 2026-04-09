import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check, Clock3, Home, Shield, Sparkles, Star } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Gallery from "@/components/Gallery";
import { buildFaqSchema } from "@/lib/seo";

const benefits = [
  {
    icon: Sparkles,
    title: "Übergabefertig",
    desc: "Endreinigung mit Fokus auf sichtbare Ordnung, klare Oberflächen und professionelle Wirkung bei der Übergabe.",
  },
  {
    icon: Shield,
    title: "Mit Nachbesserung",
    desc: "Wenn nach der Abnahme einzelne Punkte offen bleiben, bessern wir die vereinbarten Bereiche gezielt nach.",
  },
  {
    icon: Star,
    title: "Strukturiert geplant",
    desc: "Küche, Bad, Fenster und Böden werden in einer festen Reihenfolge bearbeitet statt improvisiert.",
  },
];

const features = [
  "Küche inklusive Herd, Backofen und Fronten",
  "Badezimmer mit Fliesen, Armaturen und WC",
  "Fenster innen und Rahmen",
  "Fußböden, Sockelleisten und Übergänge",
  "Türen, Türrahmen und Schalterflächen",
  "Einbauschränke innen und außen",
  "Balkon oder Terrasse nach Absprache",
  "Vorbereitung für Wohnungsübergaben",
];

const faqs = [
  {
    q: "Was ist in der Endreinigung enthalten?",
    a: "Die Endreinigung umfasst alle üblichen Übergabebereiche wie Küche, Bad, Böden, Fenster innen, Türen und stark genutzte Flächen. Zusätze können individuell aufgenommen werden.",
  },
  {
    q: "Wie lange dauert eine Endreinigung?",
    a: "Das hängt von Größe und Zustand der Wohnung ab. Für kleinere Objekte reicht oft ein halber Tag, größere oder stärker belastete Wohnungen benötigen entsprechend mehr Zeit.",
  },
  {
    q: "Arbeiten Sie auch für Hausverwaltungen?",
    a: "Ja. Wir übernehmen Endreinigung für private Übergaben, Hausverwaltungen, Makler und vorbereitende Objekttermine.",
  },
  {
    q: "Wie wird der Preis berechnet?",
    a: "Die Endreinigung startet ab 34 €/Std. Maßgeblich sind Flächengröße, Zustand und gewünschter Reinigungsumfang.",
  },
];

export default function EndreinigungPage() {
  return (
    <>
      <Script id="endreinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((item) => ({ question: item.q, answer: item.a }))))}
      </Script>

      <section className="hero-led-section relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#07101c_0%,#10253a_52%,#16334a_100%)]" />
        <Image
          src="/images/cleaning-team-government.png"
          alt="SEEL Endreinigung in Berlin für Wohnungsübergaben"
          fill
          className="object-cover opacity-22"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(96,165,250,0.18),transparent_28%),linear-gradient(180deg,rgba(2,8,18,0.1)_0%,rgba(2,8,18,0.64)_100%)]" />
        <div className="hero-copy-flow relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/12 bg-white/10 backdrop-blur-xl">
            <Sparkles className="text-cyan-200" size={38} />
          </div>
          <p className="section-eyebrow mx-auto text-cyan-200/90">Endreinigung & Auszugsreinigung</p>
          <h1 className="hero-title-strong mx-auto max-w-4xl font-display text-4xl font-bold text-white md:text-6xl">
            Übergabefertig, gründlich und visuell überzeugend.
          </h1>
          <p className="hero-body mx-auto max-w-3xl text-white/80">
            Für Wohnungswechsel, Eigentümerwechsel und sensible Übergabesituationen mit einem Endergebnis, das sauber wirkt und auf allen Geräten hochwertig präsentiert wird.
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">Ab 34 €/Std.</span>
            <span className="hero-metric">Für Übergaben abgestimmt</span>
            <span className="hero-metric">Berlin & Brandenburg</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/buchen?service=MOVE_OUT_CLEANING" className="btn-primary-glass gap-2 px-8 py-4">
              Endreinigung buchen <ArrowRight size={18} />
            </Link>
            <Link href="/kontakt?subject=Endreinigung%20Berlin" className="btn-secondary-glass px-8 py-4 text-white">
              Übergabetermin abstimmen
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
                  src="/images/corporate-hallway-cleaning.png"
                  alt="SEEL Reinigungsergebnis in einem Berliner Objekt"
                  fill
                  className="image-cinematic object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.08)_0%,rgba(2,8,18,0.76)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Abnahmeorientiert</p>
                  <p className="mt-3 max-w-md text-2xl font-semibold text-white">
                    Ein Reinigungsbild, das sauber, klar und vorbereitet erscheint.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 sm:p-7">
              <p className="section-eyebrow">Ihre Vorteile</p>
              <h2 className="section-title mt-4 text-3xl">Saubere Übergaben ohne improvisierten Eindruck.</h2>
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
            <h2 className="section-title mb-8 text-center text-2xl md:text-3xl">Was typischerweise enthalten ist</h2>
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
              <h2 className="section-title text-2xl">Preisgestaltung für Übergabeobjekte</h2>
              <p className="mt-4 text-text-body dark:text-text-on-dark-muted">
                Die Endreinigung startet ab 34 €/Std. Je nach Fläche, Verschmutzungsgrad und Zusatzumfang erhalten Sie eine klare Einschätzung für Ihr Objekt.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: Home, label: "Nach Objektgröße" },
                  { icon: Clock3, label: "Nach Zeitbedarf" },
                  { icon: Shield, label: "Mit Nachbesserung" },
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

      <Gallery
        title="Reinigungsarbeiten im Einsatz"
        subtitle="Echte Eindrücke"
        images={Array.from({ length: 16 }, (_, index) => ({
          src: `/images/clean/clean (${index + 1}).jpeg`,
          alt: `SEEL Endreinigung Berlin – Arbeitsbild ${index + 1}`,
        }))}
      />

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
              <p className="section-eyebrow text-cyan-200/80">Wohnung übergeben</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Buchen Sie eine Endreinigung mit ruhiger Premium-Anmutung.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/72">
                Für Eigentümer, Mieter und Verwalter, die eine moderne Darstellung und ein professionelles Reinigungsergebnis erwarten.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/buchen?service=MOVE_OUT_CLEANING" className="btn-primary-glass gap-2 px-10 py-4">
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
