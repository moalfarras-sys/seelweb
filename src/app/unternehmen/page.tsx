"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  BarChart3,
  Building2,
  CalendarRange,
  Check,
  FileText,
  GraduationCap,
  Handshake,
  Landmark,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import { useSiteContent } from "@/components/SiteContentProvider";

const benefits = [
  { icon: CalendarRange, title: "Rahmenverträge", desc: "Planbare Kosten und feste Ansprechpartner für regelmäßige Leistungen." },
  { icon: BadgePercent, title: "Klare Kalkulation", desc: "Transparente Angebotsstruktur statt unklarer Sammelpositionen." },
  { icon: FileText, title: "Saubere Dokumentation", desc: "Nachvollziehbare Leistungsbeschreibung für Ausschreibung, Einkauf und Verwaltung." },
  { icon: Shield, title: "Professionelle Durchführung", desc: "Koordinierte Teams für Gewerbe, Bildungseinrichtungen und Institutionen." },
  { icon: Handshake, title: "Verlässliche Kommunikation", desc: "Direkter Kontakt für Rückfragen, Terminfenster und Freigaben." },
  { icon: BarChart3, title: "Skalierbare Einsätze", desc: "Vom Einzelobjekt bis zu mehrteiligen Projektphasen mit klarer Struktur." },
];

const sectors = [
  {
    icon: Building2,
    title: "Büros & Unternehmen",
    items: ["Firmenumzüge", "Büroreinigung", "Etagen- und Teilumzüge", "Laufende Objektbetreuung"],
  },
  {
    icon: GraduationCap,
    title: "Schulen & Kitas",
    items: ["Ferienumzüge", "Objektreinigung", "Etappenplanung", "Koordination außerhalb des Betriebs"],
  },
  {
    icon: Landmark,
    title: "Öffentliche Einrichtungen",
    items: ["Strukturierte Ausschreibungen", "Zuverlässige Einsatzplanung", "Dokumentierbare Leistungen", "Kommunikation mit Verantwortlichen"],
  },
];

export default function UnternehmenPage() {
  const { company, contact } = useSiteContent();
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    category: "",
    description: "",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gdpr, setGdpr] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!gdpr) return;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("request_failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <>
      <section className="gradient-navy py-18 relative overflow-hidden md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-teal-200">
                <Building2 size={16} />
                Für Unternehmen & Institutionen
              </span>
              <h1 className="mt-6 text-4xl font-semibold text-white md:text-6xl">
                Gewerbliche Einsätze mit ruhiger Planung und sauberer Angebotsstruktur.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                {company.name} begleitet Firmen, Schulen und öffentliche Einrichtungen mit strukturierten Angeboten für Umzug, Reinigung und Entsorgung in {contact.serviceRegion}.
              </p>
              <div className="mt-8">
                <a href="#ausschreibung" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-slate-900 transition hover:bg-slate-100">
                  Ausschreibung einreichen <ArrowRight size={18} />
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                <a href={`tel:${contact.primaryPhone}`} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10">
                  {contact.primaryPhoneDisplay}
                </a>
                <a href={`mailto:${contact.email}`} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10">
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="glass rounded-[30px] p-6 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Für glaubwürdige Vergabeprozesse</p>
              <div className="mt-4 grid gap-3">
                {[
                  "Klare Leistungsbeschreibung für Einkauf und Verwaltung",
                  "Saubere Kommunikation mit festen Rückmeldungen",
                  "Geeignet für laufende Betreuung oder einzelne Projekte",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/78">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-emerald-700 dark:text-teal-300 text-sm font-semibold uppercase tracking-wider">Vorteile</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mt-3 mb-4">Was Unternehmen wirklich brauchen</h2>
            <p className="text-slate-600 dark:text-white/60 max-w-2xl mx-auto">
              Kein Sales-Sprech, sondern saubere Zusammenarbeit mit nachvollziehbaren Abläufen.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <ScrollReveal key={benefit.title} delay={index * 0.08}>
                  <TiltCard className="h-full">
                    <div className="glass-card h-full rounded-[28px] p-8">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        <Icon size={26} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/60">{benefit.desc}</p>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-teal-300 text-sm font-semibold uppercase tracking-wider">Branchen</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3 mb-4">Bereiche, die wir betreuen</h2>
            <p className="text-white/65 max-w-2xl mx-auto">
              Von kleinen Büros bis zu Institutionen mit abgestimmter Einsatzplanung.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <ScrollReveal key={sector.title} delay={index * 0.1}>
                  <div className="rounded-[30px] border border-white/10 bg-white/5 p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="text-white" size={30} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{sector.title}</h3>
                    <ul className="mt-5 space-y-3">
                      {sector.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                          <Check size={16} className="mt-0.5 shrink-0 text-teal-300" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding" id="ausschreibung">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">Ausschreibung</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">Projekt anfragen</h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-white/60">
                Beschreiben Sie Projekt, Kategorie, Umfang und Zeitrahmen. Wir nutzen Ihre Angaben für eine belastbare erste Rückmeldung.
              </p>
            </div>

            <div aria-live="polite">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[30px] p-10 text-center">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Anfrage erhalten</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/60">
                    Vielen Dank. Wir prüfen die Angaben und melden uns mit einer strukturierten Rückmeldung.
                  </p>
                  <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-emerald-700 dark:text-teal-300">
                    Zurück zur Startseite
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-strong rounded-[30px] p-8 md:p-10 space-y-6">
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                      Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Unternehmen *</label>
                      <input required type="text" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} className={inputClasses} placeholder="Firmenname" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Ansprechpartner *</label>
                      <input required type="text" value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} className={inputClasses} placeholder="Vor- und Nachname" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">E-Mail *</label>
                      <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClasses} placeholder="email@unternehmen.de" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Telefon *</label>
                      <input required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClasses} placeholder="+49 ..." />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Kategorie *</label>
                    <select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClasses}>
                      <option value="">Bitte wählen...</option>
                      <option value="BUEROUMZUG">Büroumzug</option>
                      <option value="SCHULUMZUG">Schulumzug</option>
                      <option value="REINIGUNG">Reinigungsservice</option>
                      <option value="ENTRUEMPELUNG">Entrümpelung</option>
                      <option value="SONSTIGES">Sonstiges</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Projektbeschreibung *</label>
                    <textarea required rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${inputClasses} resize-none`} placeholder="Beschreiben Sie Ihr Projekt, den Umfang und besondere Anforderungen..." />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Budget (optional)</label>
                    <select value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} className={inputClasses}>
                      <option value="">Bitte wählen...</option>
                      <option value="unter-5000">Unter 5.000 EUR</option>
                      <option value="5000-10000">5.000 - 10.000 EUR</option>
                      <option value="10000-25000">10.000 - 25.000 EUR</option>
                      <option value="25000-50000">25.000 - 50.000 EUR</option>
                      <option value="ueber-50000">Über 50.000 EUR</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={gdpr} onChange={(event) => setGdpr(event.target.checked)} className="mt-1 h-4 w-4" required />
                    <span className="text-sm text-slate-600 dark:text-white/60">
                      Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                      <Link href="/datenschutz" className="text-emerald-700 dark:text-teal-300 underline">
                        Datenschutzerklärung
                      </Link>{" "}
                      zu.
                    </span>
                  </label>

                  <button type="submit" disabled={loading || !gdpr} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                    {loading ? "Wird gesendet..." : "Ausschreibung absenden"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="gradient-navy section-padding relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-8 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">Persönliche Rückfrage lieber direkt?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Sprechen Sie direkt mit {company.name} über Ihr Projekt, Zeitfenster und Ablauf.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${contact.primaryPhone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-slate-900 transition hover:bg-slate-100">
                <Phone size={20} /> {contact.primaryPhoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-8 py-4 text-white transition hover:bg-white/15">
                <Mail size={20} /> {contact.email}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
