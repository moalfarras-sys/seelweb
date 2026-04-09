"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check, Clock, Leaf, Recycle, Shield, Trash2 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema } from "@/lib/seo";

const benefits = [
  { icon: Recycle, title: "Fachgerechte Entsorgung", desc: "Umweltgerechte Entsorgung mit Nachweis und sauberer Trennung." },
  { icon: Clock, title: "Schnell & zuverlässig", desc: "Kurzfristige Termine sind möglich – auch bei vollem Objekt." },
  { icon: Leaf, title: "Verantwortungsvoll", desc: "Maximales Recycling statt unklarer Sammelabwicklung." },
];

const features = [
  "Komplett-Entrümpelung von Wohnungen",
  "Keller- und Dachbodenräumung",
  "Büroauflösungen",
  "Sperrmüllentsorgung",
  "Besenreine Übergabe",
  "Entsorgungsnachweis auf Wunsch",
  "Schwere Gegenstände und Geräte",
  "Nachlassentrümpelung",
];

const faqs = [
  { q: "Was kostet eine Entrümpelung?", a: "Der Preis richtet sich nach Volumen, Etage, Zugänglichkeit und Entsorgungsaufwand. Sie erhalten vorab ein transparentes Angebot." },
  { q: "Muss ich eine zweite Adresse angeben?", a: "Nein. Für Entrümpelung und Entsorgung benötigen wir nur die Objektadresse – es gibt keine Zieladresse." },
  { q: "Entsorgen Sie auch Elektrogeräte?", a: "Ja. Wir entsorgen Elektrogeräte, Möbel, Mischabfälle und Sonderpositionen fachgerecht gemäß den geltenden Vorgaben." },
  { q: "Wie schnell können Sie kommen?", a: "In der Regel innerhalb von 2 bis 5 Werktagen. Expressfenster sind nach Verfügbarkeit möglich." },
];

export default function EntruempelungPage() {
  return (
    <>
      <Script id="entruempelung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((item) => ({ question: item.q, answer: item.a }))))}
      </Script>

      <section className="hero-led-section relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#08111d_0%,#102538_52%,#2c1f12_100%)]" />
        <Image
          src="/images/waste-disposal-recycling.png"
          alt="Umweltgerechte Entrümpelung und Entsorgung Berlin – SEEL Transport"
          fill
          className="object-cover opacity-24"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(251,146,60,0.18),transparent_28%),linear-gradient(180deg,rgba(2,8,18,0.12)_0%,rgba(2,8,18,0.58)_100%)]" />
        <div className="hero-copy-flow relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/12 bg-white/10 backdrop-blur-xl">
            <Trash2 className="text-orange-300" size={38} />
          </div>
          <p className="section-eyebrow mx-auto text-cyan-200/90">Entrümpelung & Entsorgung</p>
          <h1 className="hero-title-strong mx-auto max-w-4xl font-display text-4xl font-bold text-white md:text-6xl">
            Räumen, sortieren, sauber übergeben.
          </h1>
          <p className="hero-body mx-auto max-w-3xl text-white/80">
            Professionelle Räumung und umweltgerechte Entsorgung für Wohnungen, Keller, Gewerbe und Nachlassobjekte in Berlin und Brandenburg.
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">Besenrein geplant</span>
            <span className="hero-metric">Recycling-orientiert</span>
            <span className="hero-metric">Kurzfristig anfragbar</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/buchen?service=DISPOSAL" className="btn-primary-glass gap-2 px-8 py-4">
              Jetzt Entrümpelung buchen <ArrowRight size={18} />
            </Link>
            <Link href="/kontakt?subject=Entrümpelung%20Berlin" className="btn-secondary-glass px-8 py-4 text-white">
              Objekt prüfen lassen
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
                  src="/images/waste-disposal-recycling.png"
                  alt="SEEL Entrümpelung in Berlin"
                  fill
                  className="image-cinematic object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.06)_0%,rgba(2,8,18,0.76)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Kontrolliert statt chaotisch</p>
                  <p className="mt-3 max-w-md text-2xl font-semibold text-white">
                    Auch anspruchsvolle Räumungen dürfen ruhig und klar aussehen.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 sm:p-7">
              <p className="section-eyebrow">Ihre Vorteile</p>
              <h2 className="section-title mt-4 text-3xl">Saubere Räumung mit nachvollziehbarer Logik.</h2>
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
            <h2 className="section-title mb-8 text-center text-2xl md:text-3xl">Was ist enthalten</h2>
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
              <h2 className="section-title text-2xl">Transparente Preisgestaltung</h2>
              <p className="mt-4 text-text-body dark:text-text-on-dark-muted">
                Die Kosten richten sich nach Entsorgungsvolumen, Etage und dem Zugang zum Objekt. Keine versteckten Kosten – alle Zuschläge werden vorab im Angebot aufgeführt.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: Trash2, label: "Nach Volumen" },
                  { icon: Recycle, label: "Recycling inklusive" },
                  { icon: Shield, label: "Nachweis auf Wunsch" },
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
                <summary className="px-5 py-4 cursor-pointer font-medium text-text-primary dark:text-text-on-dark text-sm flex items-center justify-between">
                  {faq.q}
                  <span className="text-brand-teal transition-transform group-open:rotate-45 text-lg">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spotlight pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="premium-panel-dark px-8 py-10 sm:px-10 sm:py-12">
              <h2 className="text-3xl font-bold text-white mb-4">Räumung nötig</h2>
              <p className="text-white/72 mb-8 max-w-2xl mx-auto">
                Erhalten Sie ein unverbindliches Angebot für Ihre Entrümpelung – strukturiert, nachvollziehbar und ohne unruhige Überraschungen.
              </p>
              <Link href="/buchen?service=DISPOSAL" className="btn-primary-glass gap-2 px-10 py-4">
                Jetzt Angebot anfordern <ArrowRight size={20} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
