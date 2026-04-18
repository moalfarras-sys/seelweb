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

  const inputClasses = "input-glass";

  return (
    <>
      <section className="hero-led-section kinetic-hero gradient-navy relative overflow-hidden py-28 md:py-36">
        <div className="hero-light-sweep" />
        <div className="cine-grid absolute inset-0 opacity-35" />
        <div className="absolute inset-0 opacity-[0.10]">
          <div className="absolute inset-0 bg-[url('/images/corporate-hallway-cleaning.png')] bg-cover bg-center" />
        </div>
        <div className="hero-film absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
          >
            <div className="hero-copy-flow hero-subtle-parallax">
              <span className="hero-badge-glow inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-5 py-2.5 text-sm text-cyan-200">
                <Building2 size={16} />
                Für Unternehmen & Institutionen
              </span>
              <h1
                className="headline-prism hero-title-strong font-display mt-6 text-4xl font-semibold md:text-6xl"
                style={{ color: "#f8fdff", WebkitTextFillColor: "#f8fdff" }}
              >
                Gewerbliche Einsätze mit ruhiger Planung und sauberer Angebotsstruktur.
              </h1>
              <p
                className="hero-body mt-6 max-w-2xl text-white/90 dark:text-white/90"
                style={{ color: "rgba(248, 253, 255, 0.92)" }}
              >
                {company.name} begleitet Firmen, Schulen und öffentliche Einrichtungen mit strukturierten Angeboten für Umzug, Reinigung und Entsorgung in {contact.serviceRegion}.
              </p>
              <div className="hero-metrics">
                <span className="hero-metric">Ausschreibungen sauber</span>
                <span className="hero-metric">Klare Kalkulation</span>
                <span className="hero-metric">Institutionen & Gewerbe</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#ausschreibung" className="btn-primary-glass gap-2">
                  Ausschreibung einreichen <ArrowRight size={18} />
                </a>
                <a href={`tel:${contact.primaryPhone}`} className="btn-secondary-glass">
                  {contact.primaryPhoneDisplay}
                </a>
                <a href={`mailto:${contact.email}`} className="btn-ghost-premium">
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="glass-dark rounded-[32px] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.30)]">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">Für glaubwürdige Vergabeprozesse</p>
              <div className="mt-4 grid gap-3">
                {[
                  "Klare Leistungsbeschreibung für Einkauf und Verwaltung",
                  "Saubere Kommunikation mit festen Rückmeldungen",
                  "Geeignet für laufende Betreuung oder einzelne Projekte",
                ].map((item) => (
                  <div key={item} className="rounded-[22px] border border-white/[0.08] bg-white/5 px-4 py-4 text-sm text-white/78">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ScrollReveal className="mb-16 text-center">
            <div className="accent-line mx-auto" />
            <span className="section-eyebrow">Vorteile</span>
            <h2 className="section-title mt-4 text-center">Was Unternehmen wirklich brauchen</h2>
            <p className="section-copy mx-auto mt-4 max-w-2xl text-center">
              Kein Sales-Sprech, sondern saubere Zusammenarbeit mit nachvollziehbaren Abläufen.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <ScrollReveal key={benefit.title} delay={index * 0.08}>
                  <TiltCard className="h-full">
                    <div className="premium-panel h-full rounded-[30px] p-8">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-700 dark:text-cyan-300">
                        <Icon size={26} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/55">{benefit.desc}</p>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="gradient-navy py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ScrollReveal className="mb-16 text-center">
            <div className="accent-line mx-auto" />
            <span className="section-eyebrow text-cyan-200">Branchen</span>
            <h2 className="section-title mt-4 text-center text-white">Bereiche, die wir betreuen</h2>
            <p className="hero-body mx-auto mt-4 max-w-2xl text-center text-white/80 dark:text-white/80">
              Von kleinen Büros bis zu Institutionen mit abgestimmter Einsatzplanung.
            </p>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <ScrollReveal key={sector.title} delay={index * 0.1}>
                  <div className="glass-dark rounded-[32px] p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10">
                      <Icon className="text-white" size={30} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{sector.title}</h3>
                    <ul className="mt-5 space-y-3">
                      {sector.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                          <Check size={16} className="mt-0.5 shrink-0 text-cyan-300" />
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
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="accent-line" />
              <p className="section-eyebrow">Ausschreibung</p>
              <h2 className="font-display mt-4 text-3xl font-semibold text-slate-900 dark:text-white md:text-5xl">Projekt anfragen</h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-white/55">
                Beschreiben Sie Projekt, Kategorie, Umfang und Zeitrahmen. Wir nutzen Ihre Angaben für eine belastbare erste Rückmeldung.
              </p>
            </div>

            <div aria-live="polite">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="premium-panel rounded-[32px] p-10 text-center">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Anfrage erhalten</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/55">
                    Vielen Dank. Wir prüfen die Angaben und melden uns mit einer strukturierten Rückmeldung.
                  </p>
                  <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-sky-700 dark:text-cyan-300">
                    Zurück zur Startseite
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="premium-panel rounded-[34px] p-8 md:p-10 space-y-6">
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                      Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Unternehmen *</label>
                      <input required type="text" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} className={inputClasses} placeholder="Firmenname" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-white/80">Ansprechpartner *</label>
                      <input required type="text" value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} className={inputClasses} placeholder="Vor- und Nachname" />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
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
                    <span className="text-sm text-slate-600 dark:text-white/55">
                      Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                      <Link href="/datenschutz" className="text-sky-700 dark:text-cyan-300 underline">
                        Datenschutzerklärung
                      </Link>{" "}
                      zu.
                    </span>
                  </label>

                  <button type="submit" disabled={loading || !gdpr} className="btn-primary-glass w-full gap-2 disabled:opacity-60">
                    {loading ? "Wird gesendet..." : "Ausschreibung absenden"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="gradient-navy relative overflow-hidden py-28">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8 relative z-10">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">Persönliche Rückfrage lieber direkt?</h2>
            <p className="mx-auto mb-8 mt-6 max-w-2xl text-white/60">
              Sprechen Sie direkt mit {company.name} über Ihr Projekt, Zeitfenster und Ablauf.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a href={`tel:${contact.primaryPhone}`} className="btn-secondary-glass gap-2 bg-white text-slate-900">
                <Phone size={20} /> {contact.primaryPhoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="btn-ghost-premium gap-2 border-white/15 bg-white/10 text-white">
                <Mail size={20} /> {contact.email}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
