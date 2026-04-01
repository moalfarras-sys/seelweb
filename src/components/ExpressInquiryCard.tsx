"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";

const serviceOptions = [
  { value: "MOVING", label: "Umzug" },
  { value: "HOME_CLEANING", label: "Wohnungsreinigung" },
  { value: "MOVE_OUT_CLEANING", label: "Endreinigung" },
  { value: "OFFICE_CLEANING", label: "Büroreinigung" },
  { value: "DISPOSAL", label: "Entrümpelung" },
];

const urgencyOptions = [
  "Kurzfristig",
  "Diese Woche",
  "Nächste 2 Wochen",
  "Flexibel planbar",
];

export default function ExpressInquiryCard() {
  const [service, setService] = useState(serviceOptions[0].value);
  const [zip, setZip] = useState("");
  const [urgency, setUrgency] = useState(urgencyOptions[1]);

  const contactHref = useMemo(() => {
    const label = serviceOptions.find((option) => option.value === service)?.label ?? "Anfrage";
    const subject = `Expressanfrage - ${label}${zip ? ` - PLZ ${zip}` : ""} - ${urgency}`;
    return `/kontakt?subject=${encodeURIComponent(subject)}`;
  }, [service, urgency, zip]);

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/40 bg-white/70 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[rgba(8,16,30,0.75)] dark:shadow-[0_28px_80px_rgba(0,0,0,0.40)] md:p-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-400/8 blur-3xl dark:bg-cyan-400/6" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-cyan-400/8 blur-3xl dark:bg-sky-400/6" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/40 bg-sky-500/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 dark:border-cyan-400/15 dark:bg-cyan-400/8 dark:text-cyan-200">
            <Sparkles size={14} />
            Express Anfrage
          </span>
          <span className="text-sm text-slate-500 dark:text-white/45">Schneller Einstieg in die bestehende Anfrage.</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">Leistung</span>
            <select value={service} onChange={(event) => setService(event.target.value)} className="input-glass">
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">PLZ</span>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" />
              <input
                value={zip}
                onChange={(event) => setZip(event.target.value.replace(/[^\d]/g, "").slice(0, 5))}
                placeholder="10115"
                className="input-glass pl-11"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">Zeitfenster</span>
            <div className="relative">
              <CalendarDays size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" />
              <select value={urgency} onChange={(event) => setUrgency(event.target.value)} className="input-glass pl-11">
                {urgencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/55">
            Die Schnellabfrage führt direkt in die bestehende Kontakt- oder Buchungsstrecke, ohne neue Logik oder Datenflüsse einzuführen.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/buchen?service=${encodeURIComponent(service)}`} className="btn-ghost-premium">
              Direkt konfigurieren
            </Link>
            <Link href={contactHref} className="btn-primary-glass gap-2">
              Schnell anfragen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
