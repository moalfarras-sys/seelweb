"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CalendarRange, Handshake, Shield, Users } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

const values = [
  {
    title: "Struktur",
    text: "Klare Ansprechpartner, saubere Einsatzpläne und verbindliche Rückmeldungen statt improvisierter Abstimmung.",
    icon: CalendarRange,
  },
  {
    title: "Vertrauen",
    text: "Transparente Preise, verlässliche Kommunikation und Durchführung mit Blick auf echte Verantwortung.",
    icon: Handshake,
  },
  {
    title: "Sorgfalt",
    text: "Premium-Ausführung für Privatkunden, Unternehmen und öffentliche Einrichtungen mit Fokus auf Details.",
    icon: Shield,
  },
];

const timeline = [
  { title: "Juni 2025", text: "Gründung in Berlin mit Fokus auf Umzug, Reinigung und Entrümpelung." },
  { title: "Sommer 2025", text: "Erste gewerbliche Einsätze und strukturierte Angebotsprozesse für Firmenkunden." },
  { title: "2026", text: "Ausbau als kombinierter Partner für private und gewerbliche Einsätze in Berlin und Brandenburg." },
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
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function submitTender() {
    if (!gdpr || !form.company.trim() || !form.contact.trim() || !form.email.trim() || !form.phone.trim() || !form.category.trim() || !form.description.trim()) {
      setError("Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie den Datenschutz.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Projektanfrage konnte nicht gesendet werden.");
      }
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Projektanfrage konnte nicht gesendet werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-4 pb-14 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <section className="page-hero-shell">
          <div className="page-hero-grid">
            <div>
              <p className="page-kicker">Unternehmen</p>
              <h1 className="page-title max-w-[11ch]">Vertrauen entsteht durch Struktur.</h1>
              <p className="page-copy">
                {company.name} arbeitet seit 2025 in Berlin mit einem klaren Anspruch: Premium-Ausführung, kurze Wege und saubere Planung für Privat- und Geschäftskunden.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#ausschreibung" className="btn-primary-glass px-5 py-3 text-sm font-semibold text-white">
                  Projekt anfragen
                </a>
                <a href={`tel:${contact.primaryPhone}`} className="btn-secondary-glass px-5 py-3 text-sm font-semibold">
                  {contact.primaryPhoneDisplay}
                </a>
              </div>
              <div className="page-chip-row">
                <span className="page-chip">~10 Mitarbeitende</span>
                <span className="page-chip">Berlin seit 2025</span>
                <span className="page-chip">Privat bis Gewerbe</span>
              </div>
            </div>

            <div className="page-info-card p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Standort", value: company.city },
                  { label: "Telefon", value: contact.primaryPhoneDisplay },
                  { label: "Servicegebiet", value: contact.serviceRegion },
                  { label: "Öffnungszeiten", value: contact.availability },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/7 p-4 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/46">{item.label}</p>
                    <p className="mt-2 text-base font-semibold leading-7">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "~10 Mitarbeiter", text: "Einsatzteams und Koordination aus Berlin.", icon: Users },
                { title: "Seit Juni 2025", text: "Jung, fokussiert und mit klarer Handschrift.", icon: CalendarRange },
                { title: "Berlin bis bundesweit", text: "Privat, Gewerbe und Institutionen.", icon: Building2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="page-info-card-light p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-brand-teal/10 text-brand-teal">
                      <Icon size={20} />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-text-primary dark:text-text-on-dark">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-text-body dark:text-text-on-dark-muted">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="page-info-card-light rounded-[30px] p-6">
              <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Unsere Haltung</p>
              <h2 className="mt-3 text-3xl font-bold text-text-primary dark:text-text-on-dark">Drei Säulen, auf denen SEEL arbeitet.</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="glass-card p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-teal/10 text-brand-teal">
                        <Icon size={18} />
                      </div>
                      <p className="mt-4 text-lg font-semibold text-text-primary dark:text-text-on-dark">{value.title}</p>
                      <p className="mt-2 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{value.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="page-info-card-light rounded-[30px] p-6">
              <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Timeline</p>
              <div className="mt-6 space-y-4">
                {timeline.map((entry) => (
                  <div key={entry.title} className="glass-card grid gap-3 p-5 md:grid-cols-[180px_minmax(0,1fr)]">
                    <p className="text-sm font-semibold text-brand-teal">{entry.title}</p>
                    <p className="text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{entry.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="page-info-card p-6">
              <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal-light">Direktkontakt</p>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Für Rückfragen, Ausschreibungen und gewerbliche Projekte erreichen Sie uns direkt.
              </p>
              <div className="mt-5 space-y-3">
                <a href={`tel:${contact.primaryPhone}`} className="btn-secondary-glass w-full justify-center">
                  {contact.primaryPhoneDisplay}
                </a>
                <a href={`mailto:${contact.email}`} className="btn-secondary-glass w-full justify-center">
                  {contact.email}
                </a>
              </div>
            </div>
          </aside>
        </section>

        <section id="ausschreibung" className="page-info-card-light mt-8 rounded-[32px] p-6 md:p-8">
          {submitted ? (
            <div className="rounded-[24px] bg-brand-teal/8 p-8 text-center">
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-on-dark">Projektanfrage erhalten</h2>
              <p className="mt-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                Vielen Dank. Wir prüfen Ihr Projekt und melden uns mit einer strukturierten Rückmeldung.
              </p>
              <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-brand-teal">
                Zur Startseite
              </Link>
            </div>
          ) : (
            <>
              <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Ausschreibung</p>
              <h2 className="mt-3 text-3xl font-bold text-text-primary dark:text-text-on-dark">Projekt anfragen</h2>
              {error ? (
                <div className="mt-5 rounded-[20px] border border-status-error/20 bg-status-error/10 px-4 py-3 text-sm text-status-error">
                  {error}
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} placeholder="Unternehmen" className="input-glass" />
                <input value={form.contact} onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))} placeholder="Ansprechpartner" className="input-glass" />
                <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="E-Mail" className="input-glass" />
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Telefon" className="input-glass" />
                <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="input-glass">
                  <option value="">Kategorie wählen</option>
                  <option value="BUEROUMZUG">Büroumzug</option>
                  <option value="SCHULUMZUG">Schulumzug</option>
                  <option value="REINIGUNG">Reinigung</option>
                  <option value="ENTRUEMPELUNG">Entrümpelung</option>
                  <option value="SONSTIGES">Sonstiges</option>
                </select>
                <select value={form.budget} onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))} className="input-glass">
                  <option value="">Budget optional</option>
                  <option value="unter-5000">Unter 5.000 EUR</option>
                  <option value="5000-10000">5.000 - 10.000 EUR</option>
                  <option value="10000-25000">10.000 - 25.000 EUR</option>
                  <option value="25000-50000">25.000 - 50.000 EUR</option>
                  <option value="ueber-50000">Über 50.000 EUR</option>
                </select>
              </div>

              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={7} placeholder="Beschreiben Sie Projekt, Umfang und Rahmenbedingungen." className="input-glass mt-4 resize-none" />

              <label className="mt-4 flex items-start gap-3 text-sm text-text-body dark:text-text-on-dark-muted">
                <input type="checkbox" checked={gdpr} onChange={(event) => setGdpr(event.target.checked)} className="mt-1" />
                <span>
                  Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                  <Link href="/datenschutz" className="font-semibold text-brand-teal">
                    Datenschutzerklärung
                  </Link>{" "}
                  zu.
                </span>
              </label>

              <button type="button" onClick={submitTender} disabled={loading} className="mt-6 btn-primary-glass px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {loading ? "Wird gesendet..." : <>Ausschreibung absenden <ArrowRight size={16} className="ml-2 inline-flex" /></>}
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
