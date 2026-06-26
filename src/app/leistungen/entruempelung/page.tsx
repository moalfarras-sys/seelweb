"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowRight, Check, Trash2, Recycle, Shield, Clock, Leaf, Home } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema } from "@/lib/seo";
import { ENTRUEMPELUNG_LABEL, ENTRUEMPELUNG_LONG_DETAILS } from "@/lib/service-pricing";

const benefits = [
  { icon: Recycle, title: "Fachgerechte Entsorgung", desc: "Umweltgerechte Entsorgung mit Nachweis und Recycling" },
  { icon: Clock, title: "Schnell & zuverlässig", desc: "Kurzfristige Termine möglich – auch bei dringenden Räumungen" },
  { icon: Leaf, title: "Umweltbewusst", desc: "Maximales Recycling und verantwortungsvolle Verwertung" },
];

const features = [
  "Komplett-Entrümpelung von Wohnungen",
  "Keller- und Dachbodenräumung",
  "Büroauflösungen",
  "Sperrmüllentsorgung",
  "Besenreine Übergabe",
  "Entsorgungsnachweis auf Wunsch",
  "Schwere Gegenstände (Möbel, Geräte)",
  "Nachlassentrümpelung",
];

const faqs = [
  {
    q: "Was kostet eine Entrümpelung?",
    a: "Entrümpelungen starten bei 60 €/m³. Der endgültige Preis hängt vom Volumen, der Etage, dem Aufzug, dem Laufweg und der Art der Entsorgung ab. Sie erhalten vorab ein transparentes Angebot mit allen Positionen.",
  },
  { q: "Muss ich eine zweite Adresse angeben?", a: "Nein. Bei Entrümpelung und Entsorgung benötigen wir nur die Objektadresse – es gibt keine Zieladresse." },
  { q: "Entsorgen Sie auch Elektrogeräte?", a: "Ja, wir entsorgen Elektrogeräte, Möbel, Bauschutt und weitere zugelassene Fraktionen fachgerecht gemäß den geltenden Vorschriften." },
  { q: "Wie schnell können Sie kommen?", a: "In der Regel innerhalb von 2–5 Werktagen. Für kurzfristige Fälle prüfen wir verfügbare Expressfenster transparent vorab." },
];

export default function EntruempelungPage() {
  return (
    <>
      <Script id="entruempelung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((f) => ({ question: f.q, answer: f.a }))))}
      </Script>

      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0">
          <Image src="/images/waste-disposal-recycling.png" alt="Umweltgerechte Entrümpelung und Entsorgung Berlin – SEEL Transport" fill className="object-cover opacity-25" sizes="100vw" />
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute left-20 top-10 h-72 w-72 rounded-full bg-orange-500 blur-[128px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/20">
              <Trash2 className="text-orange-400" size={40} />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Entrümpelung & Entsorgung</h1>
            <p className="mx-auto max-w-2xl text-lg text-silver-300">Entrümpelung & Entsorgung ab 60 €/m³ – transparent kalkuliert nach Volumen, Etage und Zugang.</p>
            <Link href="/buchen?service=DISPOSAL" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-4 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600">
              Entrümpelung anfragen <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-10 text-center text-2xl font-bold text-navy-800 dark:text-white md:text-3xl">Ihre Vorteile</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-navy-700/50 dark:bg-navy-800/60">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                      <Icon className="text-orange-500" size={24} />
                    </div>
                    <h3 className="mb-2 font-bold text-navy-800 dark:text-white">{b.title}</h3>
                    <p className="text-sm text-silver-600 dark:text-silver-300">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-8 text-center text-2xl font-bold text-navy-800 dark:text-white md:text-3xl">Was ist enthalten</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-navy-700/50 dark:bg-navy-800/60">
                  <Check size={18} className="mt-0.5 shrink-0 text-teal-500" />
                  <span className="text-sm text-navy-700 dark:text-silver-200">{f}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="mb-4 text-2xl font-bold text-navy-800 dark:text-white">Transparente Preisgestaltung</h2>
            <p className="text-silver-600 dark:text-silver-300">{ENTRUEMPELUNG_LABEL}</p>
            <p className="mt-3 text-silver-600 dark:text-silver-300">{ENTRUEMPELUNG_LONG_DETAILS}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Home, label: "Nach Volumen (m³)" },
                { icon: Recycle, label: "Recycling inklusive" },
                { icon: Shield, label: "Transparente Kalkulation" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-500/10">
                    <Icon className="mx-auto mb-2 text-orange-600" size={24} />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy-800 dark:text-white">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-100 bg-white dark:border-navy-700/50 dark:bg-navy-800/60">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-navy-800 dark:text-white">
                  {faq.q}
                  <span className="text-lg text-teal-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-silver-600 dark:text-silver-300">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-navy section-padding">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-bold text-white">Räumung nötig</h2>
            <p className="mx-auto mb-8 max-w-xl text-silver-300">Erhalten Sie ein unverbindliches Angebot für Ihre Entrümpelung – transparent, sauber dokumentiert und nachvollziehbar kalkuliert.</p>
            <Link href="/buchen?service=DISPOSAL" className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-10 py-4 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600">
              Entrümpelung anfragen <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
