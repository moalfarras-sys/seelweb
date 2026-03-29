"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { PublicSiteContent } from "@/types/site-content";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function EinstellungenPage() {
  const [settings, setSettings] = useState<PublicSiteContent | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as PublicSiteContent;
      setSettings(data);
    }

    load();
  }, []);

  function update<K extends keyof PublicSiteContent>(key: K, value: PublicSiteContent[K]) {
    setSettings((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSave() {
    if (!settings) return;
    setSaveState("saving");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("save_failed");
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-slate-500">
        <Loader2 size={18} className="animate-spin" />
        Einstellungen werden geladen...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Einstellungen</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Zentrale Pflege für Kontakt-, Firmen-, Vertrauens- und Homepage-Inhalte.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
        >
          {saveState === "saving" ? <Loader2 size={16} className="animate-spin" /> : saveState === "saved" ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saveState === "saving" ? "Speichert..." : saveState === "saved" ? "Gespeichert" : "Änderungen speichern"}
        </button>
      </div>

      <section className="glass-card rounded-[28px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Firmendaten</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Diese Angaben werden in Impressum, Footer und Dokumenten wiederverwendet.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input className={inputClass} value={settings.company.name} onChange={(event) => update("company", { ...settings.company, name: event.target.value })} placeholder="Firmenname" />
          <input className={inputClass} value={settings.company.addressLine1} onChange={(event) => update("company", { ...settings.company, addressLine1: event.target.value })} placeholder="Adresse" />
          <input className={inputClass} value={settings.company.city} onChange={(event) => update("company", { ...settings.company, city: event.target.value })} placeholder="Stadt" />
          <input className={inputClass} value={settings.company.country} onChange={(event) => update("company", { ...settings.company, country: event.target.value })} placeholder="Land" />
          <input className={inputClass} value={settings.company.vatId} onChange={(event) => update("company", { ...settings.company, vatId: event.target.value })} placeholder="USt-IdNr." />
          <input className={inputClass} value={settings.company.taxNo} onChange={(event) => update("company", { ...settings.company, taxNo: event.target.value })} placeholder="Steuernummer" />
          <input className={inputClass} value={settings.company.registerCourt} onChange={(event) => update("company", { ...settings.company, registerCourt: event.target.value })} placeholder="Registergericht" />
          <input className={inputClass} value={settings.company.registerNo} onChange={(event) => update("company", { ...settings.company, registerNo: event.target.value })} placeholder="Registernummer" />
        </div>
      </section>

      <section className="glass-card rounded-[28px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-700 dark:text-sky-300">
            <Phone size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kontakt</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Zentrale Nummern und Kontakttexte für Header, Footer und Kontaktflächen.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input className={inputClass} value={settings.contact.primaryPhone} onChange={(event) => update("contact", { ...settings.contact, primaryPhone: event.target.value })} placeholder="Telefon intern" />
          <input className={inputClass} value={settings.contact.primaryPhoneDisplay} onChange={(event) => update("contact", { ...settings.contact, primaryPhoneDisplay: event.target.value })} placeholder="Telefon sichtbar" />
          <input className={inputClass} value={settings.contact.secondaryPhone} onChange={(event) => update("contact", { ...settings.contact, secondaryPhone: event.target.value })} placeholder="Sekundäre Nummer intern" />
          <input className={inputClass} value={settings.contact.secondaryPhoneDisplay} onChange={(event) => update("contact", { ...settings.contact, secondaryPhoneDisplay: event.target.value })} placeholder="Sekundäre Nummer sichtbar" />
          <input className={inputClass} value={settings.contact.email} onChange={(event) => update("contact", { ...settings.contact, email: event.target.value })} placeholder="E-Mail" />
          <input className={inputClass} value={settings.contact.whatsappNumber} onChange={(event) => update("contact", { ...settings.contact, whatsappNumber: event.target.value })} placeholder="WhatsApp Nummer ohne +" />
          <input className={inputClass} value={settings.contact.websiteUrl} onChange={(event) => update("contact", { ...settings.contact, websiteUrl: event.target.value })} placeholder="Website URL" />
          <input className={inputClass} value={settings.contact.websiteDisplay} onChange={(event) => update("contact", { ...settings.contact, websiteDisplay: event.target.value })} placeholder="Website sichtbar" />
          <div className="md:col-span-2">
            <input className={inputClass} value={settings.contact.availability} onChange={(event) => update("contact", { ...settings.contact, availability: event.target.value })} placeholder="Erreichbarkeit" />
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[28px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-700 dark:text-violet-300">
            <Mail size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bankdaten</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Nur pflegen, wenn die Daten auf Dokumenten und im Impressum erscheinen sollen.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input className={inputClass} value={settings.bank.name} onChange={(event) => update("bank", { ...settings.bank, name: event.target.value })} placeholder="Bank" />
          <input className={inputClass} value={settings.bank.accountHolder} onChange={(event) => update("bank", { ...settings.bank, accountHolder: event.target.value })} placeholder="Kontoinhaber" />
          <input className={inputClass} value={settings.bank.iban} onChange={(event) => update("bank", { ...settings.bank, iban: event.target.value })} placeholder="IBAN" />
          <input className={inputClass} value={settings.bank.bic} onChange={(event) => update("bank", { ...settings.bank, bic: event.target.value })} placeholder="BIC" />
        </div>
      </section>

      <section className="glass-card rounded-[28px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Homepage Inhalte</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hero-Texte, Abschluss-CTA sowie echte Vertrauensargumente.</p>
          </div>
        </div>

        <div className="space-y-4">
          <input className={inputClass} value={settings.homepage.heroBadge} onChange={(event) => update("homepage", { ...settings.homepage, heroBadge: event.target.value })} placeholder="Hero Badge" />
          <input className={inputClass} value={settings.homepage.heroTitle} onChange={(event) => update("homepage", { ...settings.homepage, heroTitle: event.target.value })} placeholder="Hero Titel" />
          <textarea className={`${inputClass} min-h-28`} value={settings.homepage.heroDescription} onChange={(event) => update("homepage", { ...settings.homepage, heroDescription: event.target.value })} placeholder="Hero Beschreibung" />
          <div className="grid gap-4 md:grid-cols-2">
            <input className={inputClass} value={settings.homepage.primaryCtaLabel} onChange={(event) => update("homepage", { ...settings.homepage, primaryCtaLabel: event.target.value })} placeholder="Primäre CTA" />
            <input className={inputClass} value={settings.homepage.secondaryCtaLabel} onChange={(event) => update("homepage", { ...settings.homepage, secondaryCtaLabel: event.target.value })} placeholder="Sekundäre CTA" />
          </div>
          <input className={inputClass} value={settings.homepage.finalCtaTitle} onChange={(event) => update("homepage", { ...settings.homepage, finalCtaTitle: event.target.value })} placeholder="Abschluss CTA Titel" />
          <textarea className={`${inputClass} min-h-24`} value={settings.homepage.finalCtaDescription} onChange={(event) => update("homepage", { ...settings.homepage, finalCtaDescription: event.target.value })} placeholder="Abschluss CTA Beschreibung" />
        </div>
      </section>

      <section className="glass-card rounded-[28px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vertrauen & Positionierung</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Vier kurze Trust-Claims und vier Argumente für den Bereich „Warum wir“.</p>
          </div>
        </div>

        <div className="space-y-4">
          {settings.trustBar.map((item, index) => (
            <input
              key={item.id}
              className={inputClass}
              value={item.label}
              onChange={(event) =>
                update(
                  "trustBar",
                  settings.trustBar.map((currentItem, currentIndex) =>
                    currentIndex === index ? { ...currentItem, label: event.target.value } : currentItem,
                  ),
                )
              }
              placeholder={`Trust Claim ${index + 1}`}
            />
          ))}

          {settings.whyChooseUs.map((item, index) => (
            <input
              key={`${item}-${index}`}
              className={inputClass}
              value={item}
              onChange={(event) =>
                update(
                  "whyChooseUs",
                  settings.whyChooseUs.map((currentItem, currentIndex) =>
                    currentIndex === index ? event.target.value : currentItem,
                  ),
                )
              }
              placeholder={`Warum wir ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
