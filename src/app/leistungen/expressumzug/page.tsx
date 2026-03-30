"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Clock, Shield, Truck, AlertTriangle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema } from "@/lib/seo";

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
      <Script id="expressumzug-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((f) => ({ question: f.q, answer: f.a }))))}
      </Script>

      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <Image
          src="/images/Express.jpeg"
          alt="SEEL Transport Expressumzug Berlin – kurzfristiger Umzug innerhalb 24 Stunden"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20">
              <Zap className="text-amber-400" size={40} />
            </div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-bold text-amber-300">
              <Zap size={14} /> Express-Service
            </span>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Expressumzug in Berlin</h1>
            <p className="mx-auto max-w-2xl text-lg text-silver-300">
              Kurzfristiger Umzug ohne Qualitätsverlust. Wenn es schnell gehen muss, organisiert unser Team den kompletten Ablauf zuverlässig.
            </p>
            <Link href="/buchen?service=express" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:from-amber-600 hover:to-orange-600">
              Expressumzug buchen <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-10 text-center text-2xl font-bold text-navy-800 dark:text-white md:text-3xl">Warum Express?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Clock, title: "Innerhalb 24–48h", desc: "Kurzfristige Umzüge ohne lange Wartezeit" },
                { icon: Truck, title: "Volle Leistung", desc: "Gleiche Qualität wie regulär – nur schneller disponiert" },
                { icon: Shield, title: "Versichert", desc: "Transportversicherung gemäß HGB §451e inklusive" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-navy-700/50 dark:bg-navy-800/60">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                      <Icon className="text-amber-500" size={24} />
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
            <h2 className="mb-8 text-center text-2xl font-bold text-navy-800 dark:text-white md:text-3xl">Leistungsumfang</h2>
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
            <h2 className="mb-5 text-2xl font-bold text-navy-800 dark:text-white">Preishinweis</h2>
            <div className="glass-strong mx-auto max-w-3xl rounded-[28px] p-6 text-left sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/12">
                  <AlertTriangle className="text-amber-300" size={22} />
                </div>
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300/80">Expresszuschlag</p>
                  <p className="mb-4 text-2xl font-bold text-white">Prioritätszuschlag</p>
                  <ul className="space-y-3 text-base leading-8 text-white/80">
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
            <h2 className="mb-4 text-3xl font-bold text-white">Schnell umziehen ohne Kompromisse</h2>
            <p className="mb-8 text-silver-300">Express-Service für dringende Umzüge mit verlässlicher Umsetzung.</p>
            <Link href="/buchen?service=express" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-4 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:from-amber-600 hover:to-orange-600">
              Expressumzug anfragen <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
