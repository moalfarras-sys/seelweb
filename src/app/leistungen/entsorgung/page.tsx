"use client";

import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowRight, Check, Trash2, Recycle, Shield, Leaf } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema } from "@/lib/seo";
import {
  ENTRUEMPELUNG_LABEL,
  ENTRUEMPELUNG_LONG_DETAILS,
  ENTRUEMPELUNG_SHORT_DETAILS,
} from "@/lib/service-pricing";

const features = [
  "Sperrmüllentsorgung",
  "Elektrogeräte-Entsorgung",
  "Bauschutt und Renovierungsabfall",
  "Altmöbel und Matratzen",
  "Gartenabfall",
  "Aktenvernichtung auf Wunsch",
  "Recyclingfähige Materialien trennen",
  "Entsorgungsnachweis",
];

const faqs = [
  {
    q: "Was kann alles entsorgt werden?",
    a: "Möbel, Elektrogeräte, Bauschutt, Sperrmüll, Gartenabfall und viele weitere zugelassene Fraktionen. Gefahrstoffe wie Asbest oder Chemikalien benötigen eine Sonderabfuhr.",
  },
  {
    q: "Brauche ich einen Container?",
    a: "Nein. Wir kümmern uns um den gesamten Transport und die fachgerechte Entsorgung – Sie müssen keinen Container bestellen.",
  },
  {
    q: "Wie wird der Preis berechnet?",
    a: `Entsorgungen starten bei ${ENTRUEMPELUNG_LABEL.replace("ab ", "")}. ${ENTRUEMPELUNG_LONG_DETAILS}`,
  },
];

export default function EntsorgungPage() {
  return (
    <>
      <Script id="entsorgung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((f) => ({ question: f.q, answer: f.a }))))}
      </Script>

      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/20">
              <Trash2 className="text-red-400" size={40} />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Entsorgung & Recycling</h1>
            <p className="mx-auto max-w-2xl text-lg text-silver-300">
              Entsorgung {ENTRUEMPELUNG_LABEL.replace("ab ", "ab ")} – transparent kalkuliert nach Volumen, Etage, Zugang und Entsorgungsart.
            </p>
            <Link
              href="/buchen?service=DISPOSAL"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-4 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600"
            >
              Entsorgung anfragen <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Preise</h2>
          <p className="mt-4 text-4xl font-bold text-teal-600 dark:text-teal-300">{ENTRUEMPELUNG_LABEL}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-silver-300">
            {ENTRUEMPELUNG_SHORT_DETAILS} · {ENTRUEMPELUNG_LONG_DETAILS}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-10 text-center text-2xl font-bold text-navy-800 dark:text-white md:text-3xl">Ihre Vorteile</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Recycle, title: "Recycling", desc: "Maximale Wiederverwertung aller geeigneten Materialien" },
                { icon: Shield, title: "Nachweislich", desc: "Entsorgungsnachweis auf Wunsch" },
                { icon: Leaf, title: "Umweltgerecht", desc: "Fachgerechte Entsorgung nach Vorschrift" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-navy-700/50 dark:bg-navy-800/60">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                      <Icon className="text-red-500" size={24} />
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
            <h2 className="mb-8 text-center text-2xl font-bold text-navy-800 dark:text-white md:text-3xl">Was wir entsorgen</h2>
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
            <h2 className="mb-4 text-3xl font-bold text-white">Entsorgung jetzt anfragen</h2>
            <p className="mb-8 text-silver-300">
              Entsorgungen starten bei 60 €/m³. Sie erhalten vorab eine klare Preisorientierung nach Volumen, Etage und Zugang.
            </p>
            <Link href="/buchen?service=DISPOSAL" className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-10 py-4 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600">
              Entsorgung anfragen <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
