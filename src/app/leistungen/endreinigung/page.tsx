"use client";

import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowRight, Check, SprayCan, Sparkles, Shield, Star, Home, Clock } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema } from "@/lib/seo";

const benefits = [
  { icon: Sparkles, title: "Übergabefertig", desc: "Professionelle Reinigung für eine einwandfreie Wohnungsübergabe" },
  { icon: Shield, title: "Abnahmegarantie", desc: "Sollte der Vermieter nicht zufrieden sein, bessern wir kostenlos nach" },
  { icon: Star, title: "Höchste Qualität", desc: "Erfahrene Reinigungskräfte mit professionellem Equipment" },
];

const features = [
  "Komplette Küchenreinigung (inkl. Herd, Backofen, Dunstabzug)",
  "Badezimmer inkl. Armaturen, Fliesen, Fugen",
  "Fensterreinigung (innen und Rahmen)",
  "Heizkörper und Lüftungsschlitze",
  "Fußböden (Wischen, Staubsaugen)",
  "Türen, Türrahmen und Lichtschalter",
  "Einbauschränke innen und außen",
  "Balkone und Terrassen",
];

const faqs = [
  { q: "Was ist in der Endreinigung enthalten", a: "Unsere Endreinigung umfasst die komplette Reinigung aller Räume, Küche, Bad, Fenster (innen), Böden, Türen und Heizkörper. Die Wohnung wird übergabefertig hinterlassen." },
  { q: "Wie lange dauert eine Endreinigung", a: "Das hängt von der Wohnungsgröße ab. Als Richtwert: ~3 Stunden für eine 2-Zimmer-Wohnung, ~4-5 Stunden für eine 3-Zimmer-Wohnung." },
  { q: "Was passiert, wenn der Vermieter nicht zufrieden ist", a: "Wir bieten eine Nachbesserungsgarantie. Sollte der Vermieter Mängel feststellen, kommen wir erneut und reinigen die beanstandeten Bereiche." },
];

export default function EndreinigungPage() {
  return (
    <>
      <Script id="endreinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((f) => ({ question: f.q, answer: f.a }))))}
      </Script>

      <section className="gradient-navy py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SprayCan className="text-cyan-400" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Endreinigung & Auszugsreinigung</h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg">Professionelle Wohnungsübergabe-Reinigung. Übergabefertig, gründlich, mit Nachbesserungsgarantie.</p>
            <Link href="/buchen?service=MOVE_OUT_CLEANING" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">
              Jetzt Endreinigung buchen <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-10 text-center">Ihre Vorteile</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((b) => { const Icon = b.icon; return (
                <div key={b.title} className="bg-gray-50 dark:bg-navy-800/60 rounded-2xl p-6 border border-gray-100 dark:border-navy-700/50">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4"><Icon className="text-cyan-500" size={24} /></div>
                  <h3 className="font-bold text-navy-800 dark:text-white mb-2">{b.title}</h3>
                  <p className="text-sm text-silver-600 dark:text-silver-300">{b.desc}</p>
                </div>
              ); })}
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
            <p className="text-silver-600 dark:text-silver-300">Der Preis richtet sich nach der Wohnungsgröße und dem Reinigungsumfang. Unser Online-Rechner gibt Ihnen eine Orientierung – das verbindliche Angebot erhalten Sie nach Ihrer Anfrage.</p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[{ icon: Home, label: "Nach Wohnfläche" }, { icon: Clock, label: "Stundenbasiert" }, { icon: Star, label: "Garantie inklusive" }].map((item) => {
                const Icon = item.icon; return (
                <div key={item.label} className="bg-cyan-50 dark:bg-cyan-500/10 rounded-xl p-4 text-center">
                  <Icon className="text-cyan-600 mx-auto mb-2" size={24} />
                  <span className="text-sm font-medium text-cyan-800 dark:text-cyan-300">{item.label}</span>
                </div>
              ); })}
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
                <summary className="px-5 py-4 cursor-pointer font-medium text-navy-800 dark:text-white text-sm flex items-center justify-between">{faq.q}<span className="text-teal-500 transition-transform group-open:rotate-45 text-lg">+</span></summary>
                <div className="px-5 pb-4 text-sm text-silver-600 dark:text-silver-300">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-navy section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Wohnung übergeben</h2>
            <p className="text-silver-300 mb-8">Professionelle Endreinigung für eine stressfreie Übergabe.</p>
            <Link href="/buchen?service=MOVE_OUT_CLEANING" className="inline-flex items-center gap-2 px-10 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">
              Jetzt Angebot anfordern <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
