import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check, Leaf, Recycle, Shield, Trash2, Truck } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema } from "@/lib/seo";

const benefits = [
  {
    icon: Recycle,
    title: "Sauber getrennt",
    desc: "Materialien werden strukturiert sortiert und umweltgerecht dem passenden Entsorgungsweg zugeführt.",
  },
  {
    icon: Shield,
    title: "Nachvollziehbar",
    desc: "Entsorgungsnachweise und klare Kommunikation statt unklarer Sammelabwicklung.",
  },
  {
    icon: Leaf,
    title: "Verantwortungsvoll",
    desc: "Recyclingorientierte Planung für Wohnungen, Keller, Renovierungsreste und Gewerbeflächen.",
  },
];

const features = [
  "Sperrmüll und Altmöbel",
  "Elektrogeräte und Haushaltsreste",
  "Bauschutt und Renovierungsabfälle",
  "Keller-, Dachboden- und Garageninhalte",
  "Gewerbliche Restbestände",
  "Trennung recyclingfähiger Stoffe",
  "Besenreine Freiräumung auf Wunsch",
  "Entsorgungsnachweis bei Bedarf",
];

const faqs = [
  {
    q: "Was kann entsorgt werden?",
    a: "Wir übernehmen Möbel, Elektrogeräte, Sperrmüll, Bauschutt, gemischte Haushaltsreste und viele weitere Positionen. Sonderstoffe werden separat geprüft.",
  },
  {
    q: "Brauche ich einen Container?",
    a: "Nein. In den meisten Fällen organisieren wir Abtransport und Entsorgung direkt ohne zusätzlichen Container auf Ihrer Seite.",
  },
  {
    q: "Wie wird der Preis kalkuliert?",
    a: "Die Kalkulation orientiert sich an Volumen, Zugänglichkeit, Etage und Entsorgungsart. Sie erhalten vorab einen klaren Richtwert.",
  },
  {
    q: "Arbeiten Sie auch kurzfristig?",
    a: "Ja. Je nach Kapazität können wir auch kurzfristige Termine für Berlin und Brandenburg einplanen.",
  },
];

export default function EntsorgungPage() {
  return (
    <>
      <Script id="entsorgung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((item) => ({ question: item.q, answer: item.a }))))}
      </Script>

      <section className="hero-led-section relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#08111d_0%,#13253a_48%,#322112_100%)]" />
        <Image
          src="/images/waste-disposal-apartment.png"
          alt="SEEL Entsorgungsservice in Berlin für Sperrmüll und Wohnungsräumung"
          fill
          className="object-cover opacity-24"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(251,191,36,0.18),transparent_24%),linear-gradient(180deg,rgba(2,8,18,0.12)_0%,rgba(2,8,18,0.64)_100%)]" />
        <div className="hero-copy-flow relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/12 bg-white/10 backdrop-blur-xl">
            <Trash2 className="text-orange-200" size={38} />
          </div>
          <p className="section-eyebrow mx-auto text-cyan-200/90">Entsorgungsservice Berlin</p>
          <h1 className="hero-title-strong mx-auto max-w-4xl font-display text-4xl font-bold text-white md:text-6xl">
            Entsorgung mit Ordnung, Klarheit und sauberer Logik.
          </h1>
          <p className="hero-body mx-auto max-w-3xl text-white/80">
            Für Sperrmüll, Elektrogeräte, Renovierungsreste und Objektfreimachungen mit einem strukturierten Ablauf, der seriös aussieht und verlässlich umgesetzt wird.
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">Ab 59 €/Std.</span>
            <span className="hero-metric">Recyclingorientiert</span>
            <span className="hero-metric">Berlin & Brandenburg</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/buchen?service=DISPOSAL" className="btn-primary-glass gap-2 px-8 py-4">
              Entsorgung anfragen <ArrowRight size={18} />
            </Link>
            <Link href="/kontakt?subject=Entsorgung%20Berlin" className="btn-secondary-glass px-8 py-4">
              Objekt einschätzen lassen
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
                  src="/images/waste-disposal-van.png"
                  alt="SEEL Fahrzeug für Entsorgung und Abtransport in Berlin"
                  fill
                  className="image-cinematic object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.08)_0%,rgba(2,8,18,0.76)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Objektfreimachung</p>
                  <p className="mt-3 max-w-md text-2xl font-semibold text-white">
                    Auch Entsorgung darf hochwertig und kontrolliert erscheinen.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 sm:p-7">
              <p className="section-eyebrow">Ihre Vorteile</p>
              <h2 className="section-title mt-4 text-3xl">Weniger Chaos, mehr nachvollziehbare Räumung.</h2>
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
            <h2 className="section-title mb-8 text-center text-2xl md:text-3xl">Was wir entsorgen</h2>
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
              <h2 className="section-title text-2xl">Preisgestaltung ohne Verwirrung</h2>
              <p className="mt-4 text-text-body dark:text-text-on-dark-muted">
                Die Entsorgung startet ab 59 €/Std. Relevant sind Volumen, Etage, Tragestrecke und Entsorgungsart. Diese Faktoren werden vorab klar eingeordnet, damit Sie einen brauchbaren Richtwert erhalten.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: Trash2, label: "Nach Volumen" },
                  { icon: Truck, label: "Mit Abtransport" },
                  { icon: Recycle, label: "Mit Recyclinglogik" },
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
              <p className="section-eyebrow text-cyan-200/80">Jetzt freiräumen</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Planen Sie Ihre Entsorgung mit einem klaren Premium-Auftritt.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/72">
                Von der ersten Anfrage bis zur Abholung bleibt der Ablauf strukturiert, verständlich und visuell hochwertig.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/buchen?service=DISPOSAL" className="btn-primary-glass gap-2 px-10 py-4">
                  Jetzt Angebot anfordern <ArrowRight size={20} />
                </Link>
                <Link href="/kontakt" className="btn-secondary-glass px-10 py-4">
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
