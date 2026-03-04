"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Building2, Shield, Clock, Briefcase } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const features = [
  "Büroreinigung (Schreibtische, Böden, Sanitär)", "Praxisreinigung (Arztpraxen, Kanzleien)",
  "Treppenhausreinigung", "Glasflächen und Fenster",
  "Teppichreinigung", "Regelmäßige Verträge möglich",
  "Grundreinigung und Sonderreinigung", "Wochenend- und Abendservice",
];

const faqs = [
  { q: "Bieten Sie monatliche Verträge an", a: "Ja, wir bieten individuelle Reinigungsverträge mit flexiblen Laufzeiten an. Kontaktieren Sie uns für ein maßgeschneidertes Angebot." },
  { q: "Wann wird gereinigt", a: "Wir richten uns nach Ihren Geschäftszeiten. Reinigung am Abend, früh morgens oder am Wochenende ist möglich." },
  { q: "Welche Branchen bedienen Sie", a: "Büros, Arztpraxen, Kanzleien, Einzelhandel, Gastronomie, Schulen und öffentliche Einrichtungen." },
];

export default function GewerbePage() {
  return (
    <>
      <section className="gradient-navy py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><Building2 className="text-blue-400" size={40} /></div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Büro- & Gewerbereinigung</h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg">Professionelle Reinigung für Büros, Praxen und Gewerberäume. Regelmäßig oder einmalig.</p>
            <Link href="/buchen?service=OFFICE_CLEANING" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">Jetzt buchen <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white dark:bg-navy-950"><div className="max-w-5xl mx-auto"><ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-10 text-center">Ihre Vorteile</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ icon: Briefcase, title: "Professionell", desc: "Geschultes Personal für Gewerbereinigung" },{ icon: Clock, title: "Flexible Zeiten", desc: "Reinigung außerhalb Ihrer Geschäftszeiten" },{ icon: Shield, title: "Zuverlässig", desc: "Feste Ansprechpartner und Qualitätskontrolle" }].map((b) => { const Icon = b.icon; return (
            <div key={b.title} className="bg-gray-50 dark:bg-navy-800/60 rounded-2xl p-6 border border-gray-100 dark:border-navy-700/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4"><Icon className="text-blue-500" size={24} /></div>
              <h3 className="font-bold text-navy-800 dark:text-white mb-2">{b.title}</h3><p className="text-sm text-silver-600 dark:text-silver-300">{b.desc}</p>
            </div>
          ); })}
        </div>
      </ScrollReveal></div></section>
      <section className="section-padding bg-gray-50 dark:bg-navy-900"><div className="max-w-5xl mx-auto"><ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-8 text-center">Unsere Leistungen</h2>
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
        <h2 className="text-3xl font-bold text-white mb-4">Saubere Geschäftsräume</h2>
        <p className="text-silver-300 mb-8">Fordern Sie ein individuelles Angebot für Ihre Gewerbereinigung an.</p>
        <Link href="/buchen?service=OFFICE_CLEANING" className="inline-flex items-center gap-2 px-10 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25">Jetzt Angebot anfordern <ArrowRight size={20} /></Link>
      </ScrollReveal></div></section>
    </>
  );
}
