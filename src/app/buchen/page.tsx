"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { de } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Home,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Trash2,
  Truck,
  User,
  WandSparkles,
} from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";
import { getMovingPublicRate } from "@/lib/public-service-pricing-shared";
import type { PublicPrices } from "@/lib/public-prices-shared";
import { formatCurrency } from "@/lib/utils";

type ServiceType = "MOVING" | "EXPRESS_MOVING" | "OFFICE_CLEANING" | "HOME_CLEANING" | "MOVE_OUT_CLEANING" | "DISPOSAL";
type Slot = { start: string; end: string; label: string; available: boolean };
type Prices = PublicPrices;
type BookingResult = { trackingNumber?: string; orderNumber?: string; offerNumber: string; offerPdfUrl: string; offerToken: string };
type Config = {
  on: boolean;
  hours: number;
  value: number;
  from: string;
  zipFrom: string;
  cityFrom: string;
  to: string;
  zipTo: string;
  cityTo: string;
  businessMove: boolean;
  express48h: boolean;
};

const steps = ["Service", "Details", "Termin"];

const meta: Record<ServiceType, { label: string; desc: string; badge: string; min: number; icon: typeof Home }> = {
  MOVING: { label: "Privat- & Firmenumzug", desc: "Strukturiert, versichert und sauber koordiniert.", badge: "ab 59 €/Std.", min: 2, icon: Truck },
  EXPRESS_MOVING: { label: "Expressumzug", desc: "Kurzfristige Einsätze mit priorisierter Disposition.", badge: "ab 79 €/Std.", min: 2, icon: Sparkles },
  OFFICE_CLEANING: { label: "Büro- & Gewerbereinigung", desc: "Regelmäßige und einmalige Reinigung für Unternehmen.", badge: "ab 34 €/Std.", min: 2, icon: Building2 },
  HOME_CLEANING: { label: "Wohnungsreinigung", desc: "Flexible Reinigung nach Stunden für private Objekte.", badge: "ab 34 €/Std.", min: 2, icon: Home },
  MOVE_OUT_CLEANING: { label: "Endreinigung", desc: "Abnahmebereit beim Auszug und für Übergaben.", badge: "ab 34 €/Std.", min: 3, icon: WandSparkles },
  DISPOSAL: { label: "Entrümpelung & Entsorgung", desc: "Räumung, Sortierung und fachgerechte Entsorgung.", badge: "ab 59 €/Std.", min: 1, icon: Trash2 },
};

const initial: Record<ServiceType, Config> = {
  MOVING: { on: false, hours: 4, value: 20, from: "", zipFrom: "", cityFrom: "", to: "", zipTo: "", cityTo: "", businessMove: false, express48h: false },
  EXPRESS_MOVING: { on: false, hours: 4, value: 20, from: "", zipFrom: "", cityFrom: "", to: "", zipTo: "", cityTo: "", businessMove: false, express48h: false },
  OFFICE_CLEANING: { on: false, hours: 3, value: 120, from: "", zipFrom: "", cityFrom: "", to: "", zipTo: "", cityTo: "", businessMove: false, express48h: false },
  HOME_CLEANING: { on: false, hours: 2, value: 70, from: "", zipFrom: "", cityFrom: "", to: "", zipTo: "", cityTo: "", businessMove: false, express48h: false },
  MOVE_OUT_CLEANING: { on: false, hours: 4, value: 85, from: "", zipFrom: "", cityFrom: "", to: "", zipTo: "", cityTo: "", businessMove: false, express48h: false },
  DISPOSAL: { on: false, hours: 2, value: 8, from: "", zipFrom: "", cityFrom: "", to: "", zipTo: "", cityTo: "", businessMove: false, express48h: false },
};

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : undefined;
}

export default function BuchenPage() {
  const { company, contact } = useSiteContent();
  const search = useSearchParams();
  const [step, setStep] = useState(0);
  const [prices, setPrices] = useState<Prices | null>(null);
  const [cfg, setCfg] = useState(initial);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"UEBERWEISUNG" | "BAR" | "PAYPAL">("UEBERWEISUNG");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState<BookingResult | null>(null);

  useEffect(() => {
    fetch("/api/prices", { cache: "no-store" }).then((r) => r.json()).then(setPrices).catch(() => undefined);
  }, []);

  useEffect(() => {
    const requested = search.get("service");
    if (!requested) return;
    const mapping: Record<string, ServiceType> = {
      MOVING: "MOVING",
      EXPRESS_MOVING: "EXPRESS_MOVING",
      HOME_CLEANING: "HOME_CLEANING",
      MOVE_OUT_CLEANING: "MOVE_OUT_CLEANING",
      OFFICE_CLEANING: "OFFICE_CLEANING",
      DISPOSAL: "DISPOSAL",
      express: "EXPRESS_MOVING",
    };
    const next = mapping[requested];
    if (!next) return;
    setCfg((current) => ({ ...current, [next]: { ...current[next], on: true } }));
    setStep(1);
  }, [search]);

  const active = useMemo(() => (Object.keys(cfg) as ServiceType[]).filter((key) => cfg[key].on), [cfg]);
  const duration = useMemo(() => Math.max(120, active.reduce((sum, key) => sum + cfg[key].hours * 60, 0)), [active, cfg]);

  const estimate = useMemo(() => {
    if (!prices || active.length === 0) return null;
    const netto = active.reduce((sum, key) => {
      const item = cfg[key];
      const rate =
        key === "MOVING" || key === "EXPRESS_MOVING"
          ? getMovingPublicRate(prices, { businessMove: item.businessMove, express24h: key === "EXPRESS_MOVING", express48h: item.express48h })
          : key === "OFFICE_CLEANING"
            ? prices.reinigungBuero
            : key === "MOVE_OUT_CLEANING"
              ? prices.endreinigung
              : key === "DISPOSAL"
                ? prices.entruempelung
                : prices.reinigungWohnung;
      return sum + rate * item.hours;
    }, 0);
    const mwst = Math.round(netto * 0.19 * 100) / 100;
    return { netto, mwst, total: Math.round((netto + mwst) * 100) / 100 };
  }, [active, cfg, prices]);

  const detailsReady = useMemo(
    () =>
      active.length > 0 &&
      active.every((key) => {
        const item = cfg[key];
        if (item.hours < meta[key].min || !/^\d{5}$/.test(item.zipFrom) || !item.from.trim()) return false;
        if (key === "MOVING" || key === "EXPRESS_MOVING") return Boolean(item.to.trim() && /^\d{5}$/.test(item.zipTo));
        return true;
      }),
    [active, cfg]
  );

  const ready = Boolean(
    estimate &&
      detailsReady &&
      date &&
      slots.some((item) => item.label === slot && item.available) &&
      name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      /^[+0-9\s\-()]{7,}$/.test(phone.trim())
  );

  useEffect(() => {
    if (!date || active.length === 0) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setSlotLoading(true);
    setSlotError("");
    fetch(`/api/availability?date=${encodeURIComponent(date)}&duration=${duration}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) throw new Error(data.error || "Zeitfenster konnten nicht geladen werden.");
        const nextSlots = (data.slots || []) as Slot[];
        setSlots(nextSlots);
        if (!nextSlots.some((item) => item.label === slot && item.available)) setSlot("");
      })
      .catch((error) => !cancelled && setSlotError(error instanceof Error ? error.message : "Zeitfenster konnten nicht geladen werden."))
      .finally(() => !cancelled && setSlotLoading(false));
    return () => {
      cancelled = true;
    };
  }, [active, date, duration, slot]);

  function update(service: ServiceType, patch: Partial<Config>) {
    setCfg((current) => ({ ...current, [service]: { ...current[service], ...patch } }));
  }

  async function submit() {
    if (!ready || !estimate) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const body = {
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
        services: active.map((key) => ({
          serviceType: key,
          hours: cfg[key].hours,
          areaM2: ["OFFICE_CLEANING", "HOME_CLEANING", "MOVE_OUT_CLEANING"].includes(key) ? cfg[key].value : 0,
          volumeM3: ["MOVING", "EXPRESS_MOVING", "DISPOSAL"].includes(key) ? cfg[key].value : 0,
          businessMove: cfg[key].businessMove,
          express24h: key === "EXPRESS_MOVING",
          express48h: cfg[key].express48h,
          hasElevatorFrom: false,
          hasElevatorTo: false,
          addressFrom: { displayName: `${cfg[key].from}, ${cfg[key].zipFrom} ${cfg[key].cityFrom}`, street: cfg[key].from, zip: cfg[key].zipFrom, city: cfg[key].cityFrom },
          addressTo:
            key === "MOVING" || key === "EXPRESS_MOVING"
              ? { displayName: `${cfg[key].to}, ${cfg[key].zipTo} ${cfg[key].cityTo}`, street: cfg[key].to, zip: cfg[key].zipTo, city: cfg[key].cityTo }
              : null,
        })),
        scheduledAt: date,
        timeSlot: slot,
        notes,
        paymentMethod,
        quotedTotal: estimate.total,
      };

      const response = await fetch("/api/buchung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Buchung konnte nicht erstellt werden.");
      setDone(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Buchung konnte nicht erstellt werden.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen px-4 py-14 md:px-8">
        <div className="mx-auto max-w-3xl glass-strong p-6 text-center md:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
            <CheckCircle2 size={34} />
          </div>
          <p className="mt-5 font-ui text-[11px] uppercase tracking-[0.28em] text-brand-teal">Buchung erhalten</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary dark:text-text-on-dark">Vielen Dank für Ihre Anfrage</h1>
          <p className="mt-4 text-sm leading-7 text-text-body dark:text-text-on-dark-muted md:text-base">Wir haben Ihre Buchung registriert und bereiten das Angebot vor.</p>
          <div className="mt-6 rounded-[20px] bg-surface p-4 text-left dark:bg-surface-dark">
            <p className="text-sm"><strong>Angebotsnummer:</strong> {done.offerNumber}</p>
            <p className="mt-2 text-sm"><strong>Tracking:</strong> {done.trackingNumber || done.orderNumber || "wird erstellt"}</p>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={done.offerPdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-glass">Angebot als PDF öffnen</a>
            <a href={`tel:${contact.primaryPhone}`} className="btn-secondary-glass">{contact.primaryPhoneDisplay}</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-14 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto max-w-[1200px]">
        <section className="premium-panel-dark overflow-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-brand-teal-light">Preise & Buchen</p>
              <h1 className="mt-3 font-display text-[2.2rem] font-bold leading-[0.98] text-white md:text-[3.2rem]">Angebot in wenigen Schritten anfragen.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:text-base">Wählen Sie Ihre Leistungen, hinterlegen Sie die Eckdaten und reservieren Sie ein passendes Zeitfenster in einer klaren Premium-Oberfläche.</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/46">Flow</p>
              <div className="mt-3 space-y-2.5 text-sm text-white/72">
                <p className="flex items-center justify-between"><span>Leistung wählen</span><span>01</span></p>
                <p className="flex items-center justify-between"><span>Details ergänzen</span><span>02</span></p>
                <p className="flex items-center justify-between"><span>Termin sichern</span><span>03</span></p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2">
                {steps.map((title, index) => (
                  <div key={title} className="flex flex-1 items-center gap-2">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all ${step > index ? "border-brand-teal bg-brand-teal text-white" : step === index ? "border-brand-teal/30 bg-brand-teal/8 text-brand-teal" : "border-border text-text-muted dark:border-border-dark dark:text-text-on-dark-muted"}`}>
                      {step > index ? <Check size={14} /> : index + 1}
                    </div>
                    <p className={`hidden text-xs font-semibold sm:block ${step === index ? "text-text-primary dark:text-text-on-dark" : "text-text-muted dark:text-text-on-dark-muted"}`}>{title}</p>
                    {index < steps.length - 1 ? <div className={`hidden h-px flex-1 sm:block ${step > index ? "bg-brand-teal" : "bg-border dark:bg-border-dark"}`} /> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-strong p-4 md:p-6">
              {step === 0 ? <div className="space-y-5"><div><p className="font-ui text-[11px] uppercase tracking-[0.28em] text-brand-teal">Schritt 1</p><h2 className="mt-3 flex items-center gap-2 text-xl font-bold text-text-primary dark:text-text-on-dark md:text-2xl"><WandSparkles size={20} className="text-brand-teal" /> Welche Leistung dürfen wir planen?</h2></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{(Object.keys(meta) as ServiceType[]).map((key) => { const Icon = meta[key].icon; return <button key={key} type="button" onClick={() => update(key, { on: !cfg[key].on })} className={`rounded-[20px] border p-4 text-left transition-all duration-300 ${cfg[key].on ? "border-brand-teal bg-brand-teal/8 shadow-[0_18px_42px_rgba(0,197,160,0.12)]" : "border-border bg-white/72 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] dark:border-border-dark dark:bg-white/[0.03]"}`}><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-brand-teal/10 text-brand-teal"><Icon size={20} /></div><span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${cfg[key].on ? "border-brand-teal bg-brand-teal text-white" : "border-border text-transparent dark:border-border-dark"}`}><Check size={11} /></span></div><p className="mt-4 text-sm font-semibold text-text-primary dark:text-text-on-dark">{meta[key].label}</p><p className="mt-2 text-sm leading-6 text-text-body dark:text-text-on-dark-muted">{meta[key].desc}</p><p className="mt-4 font-ui text-[11px] uppercase tracking-[0.22em] text-brand-gold">{meta[key].badge}</p></button>; })}</div><div className="flex justify-end"><button type="button" onClick={() => setStep(1)} disabled={active.length === 0} className="btn-primary-glass gap-2 disabled:opacity-50">Weiter zu Details <ArrowRight size={16} /></button></div></div> : null}

              {step === 1 ? <div className="space-y-5"><div><p className="font-ui text-[11px] uppercase tracking-[0.28em] text-brand-teal">Schritt 2</p><h2 className="mt-3 flex items-center gap-2 text-xl font-bold text-text-primary dark:text-text-on-dark md:text-2xl"><MapPin size={20} className="text-brand-teal" /> Details & Adressen</h2></div><div className="space-y-4">{active.map((key) => <div key={key} className="rounded-[20px] border border-border bg-surface/80 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-border-dark dark:bg-white/[0.03]"><div className="flex items-center gap-3 border-b border-border pb-4 dark:border-border-dark"><div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-brand-teal/10 text-brand-teal">{(() => { const Icon = meta[key].icon; return <Icon size={18} />; })()}</div><div><p className="text-base font-semibold text-text-primary dark:text-text-on-dark">{meta[key].label}</p><p className="text-xs text-text-muted dark:text-text-on-dark-muted">Minimum {meta[key].min} Std. · {meta[key].badge}</p></div></div><div className="mt-4 grid gap-3 md:grid-cols-2"><input type="number" min={meta[key].min} value={cfg[key].hours} onChange={(e) => update(key, { hours: Math.max(meta[key].min, Number(e.target.value || meta[key].min)) })} className="input-glass" placeholder="Stunden" /><input type="number" min={1} value={cfg[key].value} onChange={(e) => update(key, { value: Number(e.target.value || 0) })} className="input-glass" placeholder={["MOVING", "EXPRESS_MOVING", "DISPOSAL"].includes(key) ? "Volumen m³" : "Fläche m²"} /></div><div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_110px_110px]"><input value={cfg[key].from} onChange={(e) => update(key, { from: e.target.value })} placeholder={key === "MOVING" || key === "EXPRESS_MOVING" ? "Startadresse" : "Leistungsadresse"} className="input-glass" /><input value={cfg[key].zipFrom} onChange={(e) => update(key, { zipFrom: e.target.value })} placeholder="PLZ" className="input-glass" /><input value={cfg[key].cityFrom} onChange={(e) => update(key, { cityFrom: e.target.value })} placeholder="Ort" className="input-glass" /></div>{key === "MOVING" || key === "EXPRESS_MOVING" ? <><div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_110px_110px]"><input value={cfg[key].to} onChange={(e) => update(key, { to: e.target.value })} placeholder="Zieladresse" className="input-glass" /><input value={cfg[key].zipTo} onChange={(e) => update(key, { zipTo: e.target.value })} placeholder="PLZ" className="input-glass" /><input value={cfg[key].cityTo} onChange={(e) => update(key, { cityTo: e.target.value })} placeholder="Ort" className="input-glass" /></div><div className="mt-3 grid gap-3 md:grid-cols-2"><label className="rounded-[16px] border border-border bg-white/72 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-border-dark dark:bg-white/[0.04]"><input type="checkbox" checked={cfg[key].businessMove} onChange={(e) => update(key, { businessMove: e.target.checked })} /><span className="ml-2">Gewerblicher Umzug</span></label>{key === "MOVING" ? <label className="rounded-[16px] border border-border bg-white/72 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-border-dark dark:bg-white/[0.04]"><input type="checkbox" checked={cfg[key].express48h} onChange={(e) => update(key, { express48h: e.target.checked })} /><span className="ml-2">Express 48h</span></label> : <div className="rounded-[16px] border border-border bg-white/72 px-4 py-3 text-sm text-text-body shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-border-dark dark:bg-white/[0.04] dark:text-text-on-dark-muted">Express 24h ist automatisch aktiv.</div>}</div></> : null}</div>)}</div><div className="flex flex-col gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep(0)} className="btn-secondary-glass gap-2"><ArrowLeft size={16} /> Zurück</button><button type="button" onClick={() => setStep(2)} disabled={!detailsReady} className="btn-primary-glass gap-2 disabled:opacity-50">Weiter zu Termin <ArrowRight size={16} /></button></div></div> : null}

              {step === 2 ? <div className="space-y-5"><div><p className="font-ui text-[11px] uppercase tracking-[0.28em] text-brand-teal">Schritt 3</p><h2 className="mt-3 flex items-center gap-2 text-xl font-bold text-text-primary dark:text-text-on-dark md:text-2xl"><CalendarDays size={20} className="text-brand-teal" /> Termin & Kontakt</h2></div><div className="rounded-[20px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"><div className="rounded-[20px] border border-border bg-white p-3 dark:border-border-dark dark:bg-surface-dark-card"><DayPicker mode="single" locale={de} weekStartsOn={1} selected={parseDate(date)} onSelect={(value) => value && setDate(iso(value))} disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }} classNames={{ months: "flex justify-center", month: "space-y-3", caption: "flex items-center justify-center py-2 text-base font-bold text-text-primary dark:text-text-on-dark md:text-lg", nav: "flex items-center gap-2", nav_button: "flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-primary transition hover:border-brand-teal hover:text-brand-teal dark:border-border-dark dark:text-text-on-dark", table: "w-full border-collapse", head_row: "grid grid-cols-7 gap-1", row: "grid grid-cols-7 gap-1 mt-1", head_cell: "py-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted dark:text-text-on-dark-muted", cell: "text-center", day: "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-text-primary transition hover:scale-105 hover:bg-brand-teal/10 dark:text-text-on-dark md:h-11 md:w-11 md:text-base", day_today: "font-bold text-brand-teal after:mt-7 after:absolute after:h-1.5 after:w-1.5 after:rounded-full after:bg-brand-teal", day_selected: "bg-brand-teal text-white hover:bg-brand-teal", day_disabled: "cursor-not-allowed text-text-muted/40 dark:text-text-on-dark-muted/40" }} /></div><div className="mt-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">Verfügbare Zeitfenster</p><p className="text-[11px] uppercase tracking-[0.16em] text-text-muted dark:text-text-on-dark-muted">Dauer {Math.round(duration / 6) / 10} Std.</p></div>{slotError ? <p className="mt-3 text-sm text-status-error">{slotError}</p> : null}{!date ? <div className="mt-4 rounded-[16px] border border-border bg-white px-4 py-3 text-sm text-text-body dark:border-border-dark dark:bg-surface-dark-card dark:text-text-on-dark-muted">Bitte wählen Sie zuerst ein Datum.</div> : slotLoading ? <div className="mt-4 flex items-center gap-2 text-sm text-text-body dark:text-text-on-dark-muted"><span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand-teal dark:border-border-dark dark:border-t-brand-teal" /> Zeitfenster werden geladen...</div> : <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">{slots.map((item) => <button key={item.label} type="button" onClick={() => item.available && setSlot(item.label)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${!item.available ? "cursor-not-allowed border-border bg-white text-text-muted line-through opacity-40 dark:border-border-dark dark:bg-surface-dark-card" : slot === item.label ? "border-brand-teal bg-brand-teal text-white" : "border-brand-teal text-brand-teal hover:bg-brand-teal/10"}`}>{item.label}</button>)}</div>}</div></div><div className="rounded-[20px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"><h3 className="flex items-center gap-2 text-base font-semibold text-text-primary dark:text-text-on-dark md:text-lg"><User size={18} className="text-brand-teal" /> Kontaktdaten</h3><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="relative"><User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vollständiger Name" className="input-glass pl-11" /></div><div className="relative"><Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" /><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail-Adresse" className="input-glass pl-11" /></div><div className="relative"><Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" /><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefonnummer" className="input-glass pl-11" /></div><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as "UEBERWEISUNG" | "BAR" | "PAYPAL")} className="input-glass"><option value="UEBERWEISUNG">Überweisung</option><option value="BAR">Barzahlung</option><option value="PAYPAL">PayPal</option></select></div><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Besondere Hinweise oder Zusatzinformationen" className="input-glass mt-4 resize-none" /></div>{submitError ? <div className="rounded-[18px] border border-status-error/20 bg-status-error/10 px-4 py-3 text-sm text-status-error">{submitError}</div> : null}<div className="flex flex-col gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep(1)} className="btn-secondary-glass gap-2"><ArrowLeft size={16} /> Zurück</button><button type="button" onClick={submit} disabled={!ready || submitting} className="btn-primary-glass disabled:opacity-50">{submitting ? "Wird verarbeitet..." : "Verbindlich anfragen"}</button></div></div> : null}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="premium-panel-dark p-5">
              <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-brand-teal-light">Preisschätzung</p>
              <h3 className="mt-3 text-xl font-bold text-white md:text-2xl">Live-Übersicht</h3>
              {active.length === 0 ? <div className="mt-5 rounded-[18px] border border-dashed border-white/12 px-4 py-5 text-center text-sm text-white/56">Wählen Sie zuerst mindestens eine Leistung.</div> : <><div className="mt-5 space-y-3.5">{active.map((key) => <div key={key} className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-white">{meta[key].label}</p><p className="text-xs text-white/52">{cfg[key].hours} Std. · {cfg[key].value} {["MOVING", "EXPRESS_MOVING", "DISPOSAL"].includes(key) ? "m³" : "m²"}</p></div><span className="rounded-full bg-brand-teal/12 px-2.5 py-1 text-[11px] font-semibold text-brand-teal-light">aktiv</span></div>)}</div><div className="mt-5 rounded-[18px] border border-white/10 bg-white/6 p-4"><div className="flex items-center justify-between text-sm text-white/68"><span>Wunschtermin</span><span>{date ? new Date(`${date}T00:00:00`).toLocaleDateString("de-DE") : "offen"}</span></div><div className="mt-2 flex items-center justify-between text-sm text-white/68"><span>Zeitfenster</span><span>{slot || "offen"}</span></div><div className="mt-2 flex items-center justify-between text-sm text-white/68"><span>Gesamtdauer</span><span>{Math.round(duration / 6) / 10} Std.</span></div></div><div className="mt-5 border-t border-white/10 pt-4">{estimate ? <><div className="flex items-center justify-between text-sm text-white/68"><span>Netto</span><span>{formatCurrency(estimate.netto)}</span></div><div className="mt-2 flex items-center justify-between text-sm text-white/68"><span>MwSt. (19%)</span><span>{formatCurrency(estimate.mwst)}</span></div><div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-[11px] uppercase tracking-[0.18em] text-white/42">Preisschätzung</p><p className="mt-1 text-xs text-white/48">Endpreis nach Besichtigung</p></div><p className="text-2xl font-bold text-brand-teal-light md:text-3xl">{formatCurrency(estimate.total)}</p></div></> : <p className="text-sm text-white/56">Preis wird nach Auswahl berechnet.</p>}</div><div className="mt-5 space-y-3 rounded-[18px] border border-white/10 bg-[#081220] px-4 py-4 text-white"><p className="flex items-center gap-2 text-sm text-white/78"><Clock3 size={15} className="text-brand-teal-light" /> {contact.availability}</p><p className="flex items-center gap-2 text-sm text-white/78"><CheckCircle2 size={15} className="text-brand-teal-light" /> Strukturierte Einsatzplanung</p><p className="flex items-center gap-2 text-sm text-white/78"><MapPin size={15} className="text-brand-teal-light" /> {contact.serviceRegion}</p></div></>}<div className="mt-5 rounded-[18px] border border-white/10 bg-white/6 px-4 py-4 text-sm text-white/68"><p className="font-semibold text-white">{company.name}</p><p className="mt-1">{contact.primaryPhoneDisplay}</p><p className="mt-1">{contact.email}</p></div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
