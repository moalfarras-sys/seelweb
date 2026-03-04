"use client";

import Link from "next/link";
import { CONTACT } from "@/config/contact";
import { motion } from "framer-motion";
import {
  Building2, GraduationCap, Landmark, FileText, Shield, BarChart3,
  ArrowRight, Check, Phone, Mail, Handshake, CalendarRange, BadgePercent,
} from "lucide-react";
import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";

const benefits = [
  { icon: CalendarRange, title: "Jahresverträge", desc: "Planbare Kosten durch feste Jahresverträge für regelmäßige Dienstleistungen." },
  { icon: BadgePercent, title: "Mengenrabatte", desc: "Attraktive Konditionen für Großaufträge und regelmäßige Buchungen." },
  { icon: FileText, title: "Transparente Abrechnung", desc: "Detaillierte Rechnungen und quartalsweise Finanzberichte." },
  { icon: Shield, title: "Erweiterte Versicherung", desc: "Umfassender Versicherungsschutz für Ihre Unternehmensanlagen." },
  { icon: Handshake, title: "Persönlicher Ansprechpartner", desc: "Ein fester Projektmanager für Ihre Anfragen und Koordination." },
  { icon: BarChart3, title: "Reporting & Controlling", desc: "Regelmäßige Berichte über erbrachte Leistungen und Kosten." },
];

const sectors = [
  {
    icon: Building2, title: "Büros & Firmen", gradient: "from-teal-500 to-teal-700",
    items: ["Regelmäßige Büroreinigung", "Firmenumzüge", "Möbelentsorgung", "IT-Equipment-Transport"],
  },
  {
    icon: GraduationCap, title: "Schulen & Kindergärten", gradient: "from-amber-500 to-orange-600",
    items: ["Schulreinigung", "Umzüge in Ferienzeiten", "Spielgeräte-Transport", "Renovierungsbegleitung"],
  },
  {
    icon: Landmark, title: "Öffentliche Einrichtungen", gradient: "from-blue-500 to-navy-700",
    items: ["Behördenumzüge", "Gebäudereinigung", "Aktenvernichtung", "Sonderentsorgung"],
  },
];

export default function UnternehmenPage() {
  const [form, setForm] = useState({
    company: "", contact: "", email: "", phone: "",
    category: "", description: "", budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gdpr, setGdpr] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdpr) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-800 dark:text-white placeholder-silver-400 dark:placeholder-silver-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all";

  return (
    <>
      {/* Hero */}
      <section className="gradient-navy py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-20 w-72 h-72 bg-teal-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <span className="inline-flex items-center gap-2 glass rounded-full text-teal-400 px-5 py-2.5 text-sm mb-8 border-glow">
              <Building2 size={16} />
              Für Unternehmen & Institutionen
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-3 mb-6">
              Maßgeschneiderte Lösungen
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">für Ihr Unternehmen</span>
            </h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Jahresverträge, Ausschreibungen und individuelle Vereinbarungen für Büros, Schulen und öffentliche Einrichtungen.
            </p>
            <div className="mt-8">
              <a href="#ausschreibung" className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25 btn-shine">
                Ausschreibung einreichen <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white dark:bg-navy-950 gradient-mesh">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider">Warum Seel Transport</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mt-3 mb-4">Ihre Vorteile als Geschäftskunde</h2>
            <p className="text-silver-600 dark:text-silver-200 max-w-2xl mx-auto">
              Profitieren Sie von unseren Unternehmensangeboten mit transparenter Preisgestaltung und zuverlässigem Service.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <ScrollReveal key={b.title} delay={i * 0.08}>
                  <TiltCard className="h-full">
                    <div className="bg-white dark:bg-navy-800/60 rounded-2xl p-8 border border-gray-200 dark:border-navy-700/50 shadow-sm hover:shadow-xl dark:hover:shadow-teal-500/5 transition-all duration-300 h-full glass-reflect">
                      <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center mb-5">
                        <Icon className="text-teal-600 dark:text-teal-400" size={28} />
                      </div>
                      <h3 className="text-lg font-semibold text-navy-800 dark:text-white mb-2">{b.title}</h3>
                      <p className="text-silver-600 dark:text-silver-200 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="section-padding bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider">Branchen</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mt-3 mb-4">Branchen, die wir betreuen</h2>
            <p className="text-silver-600 dark:text-silver-200 max-w-2xl mx-auto">
              Individuelle Lösungen für verschiedene Sektoren — von kleinen Büros bis zu öffentlichen Einrichtungen.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {sectors.map((s, i) => {
              const Icon = s.icon;
              return (
                <ScrollReveal key={s.title} delay={i * 0.1}>
                  <TiltCard className="h-full">
                    <div className="bg-white dark:bg-navy-800/60 rounded-2xl p-8 border border-gray-200 dark:border-navy-700/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full glass-reflect">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                        <Icon className="text-white" size={30} />
                      </div>
                      <h3 className="text-xl font-semibold text-navy-800 dark:text-white mb-4">{s.title}</h3>
                      <ul className="space-y-3">
                        {s.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-silver-600 dark:text-silver-200">
                            <Check size={16} className="text-teal-500 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tender Form */}
      <section className="section-padding bg-white dark:bg-navy-950 gradient-mesh" id="ausschreibung">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider">Ausschreibung</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mt-3 mb-4">Ausschreibung einreichen</h2>
            <p className="text-silver-600 dark:text-silver-200">
              Beschreiben Sie Ihr Projekt und wir erstellen Ihnen ein individuelles Angebot.
            </p>
          </ScrollReveal>

          <div aria-live="polite">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-12 text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-navy-800 dark:text-white mb-3">Anfrage erhalten!</h3>
                <p className="text-silver-600 dark:text-silver-200 mb-6">
                  Vielen Dank für Ihre Ausschreibung. Wir melden uns innerhalb von 24 Stunden.
                </p>
                <Link href="/" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
                  Zurück zur Startseite
                </Link>
              </motion.div>
            ) : (
              <ScrollReveal>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-200 dark:border-navy-700/50 shadow-sm p-8 md:p-12 space-y-6">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
                      Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Unternehmen *</label>
                      <input required type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClasses} placeholder="Firmenname" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Ansprechpartner *</label>
                      <input required type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className={inputClasses} placeholder="Vor- und Nachname" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">E-Mail *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} placeholder="email@unternehmen.de" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Telefon *</label>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClasses} placeholder="+49 ..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Kategorie *</label>
                    <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClasses}>
                      <option value="">Bitte wählen...</option>
                      <option value="BUEROUMZUG">Büroumzug</option>
                      <option value="SCHULUMZUG">Schulumzug</option>
                      <option value="REINIGUNG">Reinigungsservice</option>
                      <option value="ENTRUEMPELUNG">Entrümpelung</option>
                      <option value="SONSTIGES">Sonstiges</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Projektbeschreibung *</label>
                    <textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClasses} resize-none`} placeholder="Beschreiben Sie Ihr Projekt..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Budget (optional)</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputClasses}>
                      <option value="">Bitte wählen...</option>
                      <option value="unter-5000">Unter 5.000 €</option>
                      <option value="5000-10000">5.000 – 10.000 €</option>
                      <option value="10000-25000">10.000 – 25.000 €</option>
                      <option value="25000-50000">25.000 – 50.000 €</option>
                      <option value="ueber-50000">Über 50.000 €</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gdpr}
                      onChange={(e) => setGdpr(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-navy-600 text-teal-500 focus:ring-teal-500"
                      required
                    />
                    <span className="text-sm text-silver-600 dark:text-silver-200">
                      Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                      <Link href="/datenschutz" className="text-teal-600 dark:text-teal-400 underline">Datenschutzerklärung</Link>{" "}
                      zu. *
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !gdpr}
                    className="group w-full py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 flex items-center justify-center gap-2 btn-shine disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        Ausschreibung absenden
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="gradient-navy section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-teal-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Persönliche Beratung gewünscht</h2>
            <p className="text-silver-300 mb-8 max-w-2xl mx-auto">
              Kontaktieren Sie uns direkt für eine individuelle Beratung zu Ihren Unternehmensanforderungen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25 btn-shine">
                <Phone size={20} /> {CONTACT.PRIMARY_PHONE_DISPLAY}
              </a>
              <a href={`mailto:${CONTACT.EMAIL}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 glass rounded-xl text-white hover:bg-white/15 transition-all">
                <Mail size={20} /> {CONTACT.EMAIL}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
