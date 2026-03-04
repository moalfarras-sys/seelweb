"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Trash2, Recycle, Shield, Leaf } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const features = [
  "Sperrmüllentsorgung", "Elektrogeräte-Entsorgung",
  "Bauschutt und Renovierungsabfall", "Altmöbel und Matratzen",
  "Gartenabfall", "Aktenvernichtung auf Wunsch",
  "Recyclingfähige Materialien trennen", "Entsorgungsnachweis",
];

const faqs = [
  { q: "Was kann alles entsorgt werden", a: "Möbel, Elektrogeräte, Bauschutt, Sperrmüll, Gartenabfall und vieles mehr. Ausnahmen: Gefahrstoffe wie Asbest oder Chemikalien bedürfen einer Sonderabfuhr." },
  { q: "Brauche ich einen Container", a: "Nein. Wir kümmern uns um den gesamten Transport und die fachgerechte Entsorgung – Sie müssen keinen Container bestellen." },
  { q: "Wie wird der Preis berechnet", a: "Nach dem geschätzten Volumen in Kubikmetern (m³) plus eventuelle Etagenzuschläge." },
];

export default function EntsorgungPage() {
  return (
    <>
      <section className="gradient-navy py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 className="text-red-400" size={40} /></div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Entsorgungsservice</h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg">Fachgerechte Entsorgung von Sperrmüll, Elektrogeräten und Bauschutt – umweltbewusst und zuverlässig.</p>
            <Link href="/buchen?service=DISPOSAL" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">Jetzt Entsorgung buchen <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white dark:bg-navy-950"><div className="max-w-5xl mx-auto"><ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-10 text-center">Ihre Vorteile</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ icon: Recycle, title: "Recycling", desc: "Maximale Wiederverwertung aller Materialien" },{ icon: Shield, title: "Nachweislich", desc: "Entsorgungsnachweis auf Wunsch" },{ icon: Leaf, title: "Umweltgerecht", desc: "Fachgerechte Entsorgung nach Vorschrift" }].map((b) => { const Icon = b.icon; return (
            <div key={b.title} className="bg-gray-50 dark:bg-navy-800/60 rounded-2xl p-6 border border-gray-100 dark:border-navy-700/50">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4"><Icon className="text-red-500" size={24} /></div>
              <h3 className="font-bold text-navy-800 dark:text-white mb-2">{b.title}</h3><p className="text-sm text-silver-600 dark:text-silver-300">{b.desc}</p>
            </div>
          ); })}
        </div>
      </ScrollReveal></div></section>
      <section className="section-padding bg-gray-50 dark:bg-navy-900"><div className="max-w-5xl mx-auto"><ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-8 text-center">Was wir entsorgen</h2>
        <div className="grid md:grid-cols-2 gap-4">{features.map((f) => (
          <div key={f} className="flex items-start gap-3 bg-white dark:bg-navy-800/60 rounded-xl p-4 border border-gray-100 dark:border-navy-700/50"><Check size={18} className="text-teal-500 mt-0.5 shrink-0" /><span className="text-sm text-navy-700 dark:text-silver-200">{f}</span></div>
        ))}</div>
      </ScrollReveal></div></section>
      <section className="section-padding bg-gray-50 dark:bg-navy-900"><div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-navy-800 dark:text-white mb-8 text-center">Häufige Fragen</h2>
        <div className="space-y-3">{faqs.map((faq) => (
          <details key={faq.q} className="group bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50">
            <summary className="px-5 py-4 cursor-pointer font-medium text-navy-800 dark:text-white text-sm flex items-center justify-between">{faq.q}<span className="text-teal-500 transition-transform group-open:rotate-45 text-lg">+</span></summary>
            <div className="px-5 pb-4 text-sm text-silver-600 dark:text-silver-300">{faq.a}</div>
          </details>
        ))}</div>
      </div></section>
      <section className="gradient-navy section-padding"><div className="max-w-4xl mx-auto text-center"><ScrollReveal>
        <h2 className="text-3xl font-bold text-white mb-4">Entsorgung benötigt</h2>
        <p className="text-silver-300 mb-8">Lassen Sie Ihren Sperrmüll und Abfall professionell und umweltgerecht entsorgen.</p>
        <Link href="/buchen?service=DISPOSAL" className="inline-flex items-center gap-2 px-10 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">Jetzt Angebot anfordern <ArrowRight size={20} /></Link>
      </ScrollReveal></div></section>
    </>
  );
}
