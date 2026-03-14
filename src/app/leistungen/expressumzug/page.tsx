"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Clock, Shield, Truck, AlertTriangle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const features = [
  "Umzug innerhalb von 24–48 Stunden",
  "Abend- und Wochenendumzüge",
  "Priorisierte Terminvergabe",
  "Erfahrenes Express-Team",
  "Verpackungsmaterial inklusive",
  "Moderne Fahrzeuge mit Hebebühne",
  "Möbelmontage/-demontage",
  "Halteverbotszone auf Wunsch",
];

const faqs = [
  {
    q: "Was kostet ein Expressumzug?",
    a: "Expressumzüge starten ab 75 € / Std. und enthalten einen transparenten Prioritätszuschlag von 40 % auf den regulären Umzugspreis.",
  },
  {
    q: "Wie kurzfristig können Sie starten?",
    a: "Bei Verfügbarkeit auch innerhalb von 24 Stunden. Für optimale Planung empfehlen wir 48 Stunden Vorlauf.",
  },
  {
    q: "Ist Express auch am Wochenende möglich?",
    a: "Ja. Wochenend- und Abendtermine sind verfügbar und werden transparent im Angebot ausgewiesen.",
  },
  {
    q: "Ist die Leistung schlechter als beim Standardumzug?",
    a: "Nein. Sie erhalten den gleichen Qualitätsstandard – nur mit priorisierter Terminvergabe.",
  },
];

export default function ExpressumzugPage() {
  return (
    <>
      <section className="gradient-navy py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="text-amber-400" size={40} />
            </div>
            <span className="inline-flex items-center gap-2 bg-amber-500/20 rounded-full text-amber-300 px-4 py-1.5 text-sm mb-4 font-bold">
              <Zap size={14} /> Express-Service
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Expressumzug in Berlin</h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg">
              Kurzfristiger Umzug ohne Qualitätsverlust. Wenn es schnell gehen muss, organisiert unser Team den kompletten Ablauf zuverlässig.
            </p>
            <Link href="/buchen?service=express" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25">
              Expressumzug buchen <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-10 text-center">Warum Express?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Clock, title: "Innerhalb 24–48h", desc: "Kurzfristige Umzüge ohne lange Wartezeit" },
                { icon: Truck, title: "Volle Leistung", desc: "Gleiche Qualität wie regulär – nur schneller disponiert" },
                { icon: Shield, title: "Versichert", desc: "Transportversicherung gemäß HGB §451e inklusive" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="bg-gray-50 dark:bg-navy-800/60 rounded-2xl p-6 border border-gray-100 dark:border-navy-700/50">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="text-amber-500" size={24} />
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
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white mb-8 text-center">Leistungsumfang</h2>
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
            <h2 className="text-2xl font-bold text-navy-800 dark:text-white mb-4">Preishinweis</h2>
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6 text-left max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-300 mb-2">Prioritätszuschlag</p>
                  <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                    <li>Basispreis Express: ab 75 € / Std.</li>
                    <li>Prioritätszuschlag: +40 %</li>
                    <li>Wochenende/Abend: gemäß Preisliste</li>
                  </ul>
                </div>
              </div>
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
            <h2 className="text-3xl font-bold text-white mb-4">Schnell umziehen ohne Kompromisse</h2>
            <p className="text-silver-300 mb-8">Express-Service für dringende Umzüge mit verlässlicher Umsetzung.</p>
            <Link href="/buchen?service=express" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25">
              Expressumzug anfragen <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
