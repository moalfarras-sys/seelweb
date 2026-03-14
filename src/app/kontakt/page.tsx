"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, Check, ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { CONTACT, whatsappDefaultUrl } from "@/config/contact";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import Link from "next/link";

type ContactLine = { label: string; href?: string };
type ContactItem = { icon: typeof Phone; title: string; lines: ContactLine[] };

const contactItems: ContactItem[] = [
  {
    icon: Phone,
    title: "Telefon",
    lines: [
      { label: "+49 172 8003410", href: "tel:+491728003410" },
      { label: "+49 160 7746966", href: "tel:+491607746966" },
    ],
  },
  {
    icon: Mail,
    title: "E-Mail",
    lines: [{ label: CONTACT.EMAIL, href: `mailto:${CONTACT.EMAIL}` }],
  },
  {
    icon: MapPin,
    title: "Standort",
    lines: [{ label: `${CONTACT.CITY}, ${CONTACT.COUNTRY}` }],
  },
  {
    icon: Clock,
    title: "Erreichbarkeit",
    lines: [{ label: CONTACT.AVAILABILITY }],
  },
];

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
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
      const res = await fetch("/api/kontakt", {
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
          <div className="absolute top-10 right-20 w-72 h-72 bg-teal-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 glass rounded-full text-teal-400 px-5 py-2.5 text-sm mb-8 border-glow">
              <Mail size={16} />
              Kontakt
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-3 mb-6">
              Sprechen Sie{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">uns an</span>
            </h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Wir sind {CONTACT.AVAILABILITY}. Nutzen Sie das Kontaktformular oder rufen Sie uns direkt an.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact section */}
      <section className="section-padding bg-white dark:bg-navy-950 gradient-mesh">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact cards */}
            <div className="space-y-5">
              {contactItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={i * 0.08}>
                    <TiltCard intensity={5}>
                      <div className="group flex items-start gap-4 p-6 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900/70 dark:to-navy-800/70 rounded-2xl border border-gray-200 dark:border-navy-700/50 hover:shadow-xl hover:shadow-teal-500/10 transition-all glass-reflect">
                        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-500/10 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-teal-200/60 dark:ring-teal-500/20">
                          <Icon className="text-teal-600 dark:text-teal-400" size={22} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy-800 dark:text-white mb-1">{item.title}</h3>
                          {item.lines.map((line) => (
                            <p key={line.label} className="text-silver-600 dark:text-silver-200 text-sm leading-6">
                              {line.href ? (
                                <a
                                  href={line.href}
                                  target={line.href.startsWith("http") ? "_blank" : undefined}
                                  rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                  className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 group-hover:translate-x-0.5"
                                >
                                  {line.label}
                                </a>
                              ) : line.label}
                            </p>
                          ))}
                        </div>
                      </div>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}

              <ScrollReveal delay={0.4}>
                <div className="p-6 bg-teal-50 dark:bg-teal-500/10 rounded-xl border border-teal-200 dark:border-teal-500/20">
                  <h3 className="font-semibold text-navy-800 dark:text-white mb-2 flex items-center gap-2">
                    <MessageCircle size={18} className="text-green-600" />
                    WhatsApp Direktnachricht
                  </h3>
                  <p className="text-silver-600 dark:text-silver-200 text-sm mb-3">Schreiben Sie uns direkt auf WhatsApp!</p>
                  <a
                    href={whatsappDefaultUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all shadow-md btn-shine"
                  >
                    WhatsApp öffnen
                    <ArrowRight size={16} />
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div aria-live="polite">
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-12 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={32} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-800 dark:text-white mb-3">Nachricht gesendet!</h3>
                    <p className="text-silver-600 dark:text-silver-200 mb-6">Wir melden uns schnellstmöglich bei Ihnen.</p>
                    <Link href="/" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
                      Zurück zur Startseite
                    </Link>
                  </motion.div>
                ) : (
                  <ScrollReveal delay={0.1}>
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-200 dark:border-navy-700/50 shadow-sm p-8 md:p-12 space-y-6">
                      {error && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
                          Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Name *</label>
                          <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} placeholder="Ihr Name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">E-Mail *</label>
                          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} placeholder="email@beispiel.de" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Telefon</label>
                          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClasses} placeholder="+49 ..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Betreff *</label>
                          <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClasses}>
                            <option value="">Bitte wählen...</option>
                            <option value="umzug-privat">Privatumzug</option>
                            <option value="umzug-buero">Büroumzug</option>
                            <option value="umzug-fern">Fernumzug</option>
                            <option value="reinigung">Reinigung</option>
                            <option value="entruempelung">Entrümpelung</option>
                            <option value="angebot">Angebotsanfrage</option>
                            <option value="firmenvertrag">Firmenvertrag</option>
                            <option value="sonstiges">Sonstiges</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-2">Nachricht *</label>
                        <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClasses} resize-none`} placeholder="Ihre Nachricht..." />
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
                            Nachricht senden
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
