"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Trash2, Recycle, Shield, Clock, Leaf, Home } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const benefits = [
  { icon: Recycle, title: "Fachgerechte Entsorgung", desc: "Umweltgerechte Entsorgung mit Nachweis und Recycling" },
  { icon: Clock, title: "Schnell & zuverlässig", desc: "Kurzfristige Termine möglich – auch am Wochenende" },
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
  { q: "Was kostet eine Entrümpelung?", a: "Der Preis richtet sich nach dem Volumen (m³), der Etage und dem Zugang. Sie erhalten ein transparentes Angebot mit allen Positionen vorab." },
  { q: "Muss ich eine zweite Adresse angeben?", a: "Nein. Bei Entrümpelung und Entsorgung benötigen wir nur die Objektadresse – es gibt keine Zieladresse." },
  { q: "Entsorgen Sie auch Elektrogeräte?", a: "Ja, wir entsorgen Elektrogeräte, Möbel, Bauschutt und Sondermüll fachgerecht gemäß den geltenden Vorschriften." },
  { q: "Wie schnell können Sie kommen?", a: "In der Regel innerhalb von 2–5 Werktagen. Expresstermine sind gegen Aufpreis möglich." },
];

export default function EntruempelungPage() {
  return (
    <>
      <section className="gradient-navy py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/waste-disposal-recycling.png" alt="Entrümpelung" fill className="object-cover opacity-25" sizes="100vw" />
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-20 w-72 h-72 bg-orange-500 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="text-orange-400" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Entrümpelung & Entsorgung</h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg">Professionelle Räumung und umweltgerechte Entsorgung in Deutschland. Schnell, sauber, verantwortungsvoll.</p>
            <Link href="/buchen?service=DISPOSAL" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">
              Jetzt Entrümpelung buchen <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-10 text-center">Ihre Vorteile</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="bg-gray-50 dark:bg-navy-800/60 rounded-2xl p-6 border border-gray-100 dark:border-navy-700/50">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="text-orange-500" size={24} />
                    </div>
                    <h3 className="font-bold text-navy-800 dark:text-white mb-2">{b.title}</h3>
                    <p className="text-sm text-silver-600 dark:text-silver-300">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-8 text-center">Was ist enthalten</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-white dark:bg-navy-800/60 rounded-xl p-4 border border-gray-100 dark:border-navy-700/50">
                  <Check size={18} className="text-teal-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-navy-700 dark:text-silver-200">{f}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 dark:text-white mb-4">Transparente Preisgestaltung</h2>
            <p className="text-silver-600 dark:text-silver-300">Die Kosten richten sich nach dem Entsorgungsvolumen (m³), der Etage und dem Vorhandensein eines Aufzugs. Keine versteckten Kosten – alle Zuschläge werden vorab im Angebot aufgeführt.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: Home, label: "Nach Volumen (m³)" },
                { icon: Recycle, label: "Recycling inklusive" },
                { icon: Shield, label: "Entsorgungsnachweis" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-orange-50 dark:bg-orange-500/10 rounded-xl p-4 text-center">
                    <Icon className="text-orange-600 mx-auto mb-2" size={24} />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy-800 dark:text-white mb-8 text-center">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50">
                <summary className="px-5 py-4 cursor-pointer font-medium text-navy-800 dark:text-white text-sm flex items-center justify-between">
                  {faq.q}
                  <span className="text-teal-500 transition-transform group-open:rotate-45 text-lg">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-silver-600 dark:text-silver-300">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-navy section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Räumung nötig</h2>
            <p className="text-silver-300 mb-8 max-w-xl mx-auto">Erhalten Sie ein unverbindliches Angebot für Ihre Entrümpelung – transparent und fair.</p>
            <Link href="/buchen?service=DISPOSAL" className="inline-flex items-center gap-2 px-10 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">
              Jetzt Angebot anfordern <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

