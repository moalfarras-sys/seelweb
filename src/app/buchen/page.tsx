"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { de } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import AddressAutocomplete, { type AddressResult } from "@/components/maps/AddressAutocomplete";
import RouteMap from "@/components/maps/RouteMap";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
  Wand2,
  Building2,
  Home,
  Trash2,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  FileText
} from "lucide-react";

type ServiceType = "HOME_CLEANING" | "MOVE_OUT_CLEANING" | "OFFICE_CLEANING" | "MOVING" | "DISPOSAL";

type ServiceCfg = {
  hours: number;
  addressFrom: AddressResult | null;
  addressTo: AddressResult | null;
  distanceKm: number;
  durationMin: number;
  volumeM3: number;
  areaM2: number;
  floorFrom: number;
  floorTo: number;
  hasElevatorFrom: boolean;
  hasElevatorTo: boolean;
  express24h: boolean;
  express48h: boolean;
};

type QuoteServiceInput = {
  serviceType: ServiceType;
  zip: string;
  hours: number;
  workers: number;
  distanceKm?: number;
  volumeM3?: number;
  areaM2?: number;
  floorFrom?: number;
  floorTo?: number;
  hasElevatorFrom: boolean;
  hasElevatorTo: boolean;
  express24h: boolean;
  express48h: boolean;
  extras: string[];
};

type QuoteResult = {
  subtotal: number;
  discountAmount: number;
  netto: number;
  mwst: number;
  total: number;
  quoteFingerprint: string;
};

type BookingResult = {
  trackingNumber?: string;
  orderNumber?: string;
  offerNumber: string;
  offerPdfUrl: string;
  offerToken: string;
  paypalRedirectUrl?: string | null;
};

type AvailabilitySlot = { start: string; end: string; label: string };

type PaymentMethod = "UEBERWEISUNG" | "BAR" | "PAYPAL";

const MIN_HOURS: Record<ServiceType, number> = {
  HOME_CLEANING: 2,
  MOVE_OUT_CLEANING: 3,
  OFFICE_CLEANING: 2,
  MOVING: 2,
  DISPOSAL: 1,
};

const LABELS: Record<ServiceType, string> = {
  HOME_CLEANING: "Wohnungsreinigung",
  MOVE_OUT_CLEANING: "Endreinigung",
  OFFICE_CLEANING: "Büro Reinigung",
  MOVING: "Umzug",
  DISPOSAL: "Entrümpelung",
};

const SERVICE_META: Record<ServiceType, { desc: string; icon: typeof Home; color: string }> = {
  HOME_CLEANING: { desc: "Flexible Reinigung nach Stunden", icon: Home, color: "text-blue-500" },
  MOVE_OUT_CLEANING: { desc: "Abnahmebereit beim Auszug", icon: Sparkles, color: "text-amber-500" },
  OFFICE_CLEANING: { desc: "Regelmäßige Gewerbereinigung", icon: Building2, color: "text-indigo-500" },
  MOVING: { desc: "Umzug inkl. Route und Express", icon: Truck, color: "text-teal-500" },
  DISPOSAL: { desc: "Entrümpelung inkl. Entsorgung", icon: Trash2, color: "text-rose-500" },
};

const EMPTY_CFG: ServiceCfg = {
  hours: 2,
  addressFrom: null,
  addressTo: null,
  distanceKm: 0,
  durationMin: 0,
  volumeM3: 15,
  areaM2: 50,
  floorFrom: 0,
  floorTo: 0,
  hasElevatorFrom: false,
  hasElevatorTo: false,
  express24h: false,
  express48h: false,
};

const SMART_PRESETS: Record<
  ServiceType,
  Array<{ label: string; hint: string; patch: Partial<ServiceCfg> }>
> = {
  HOME_CLEANING: [
    { label: "Schnell", hint: "2h · kleine Wohnung", patch: { hours: 2, areaM2: 50 } },
    { label: "Standard", hint: "3h · 2-3 Zimmer", patch: { hours: 3, areaM2: 75 } },
    { label: "Intensiv", hint: "5h · gründlich", patch: { hours: 5, areaM2: 120 } },
  ],
  MOVE_OUT_CLEANING: [
    { label: "Kompakt", hint: "4h · bis 70m²", patch: { hours: 4, areaM2: 70 } },
    { label: "Standard", hint: "6h · 80-110m²", patch: { hours: 6, areaM2: 100 } },
    { label: "Groß", hint: "8h · ab 120m²", patch: { hours: 8, areaM2: 130 } },
  ],
  OFFICE_CLEANING: [
    { label: "Morgen", hint: "3h · vor Öffnung", patch: { hours: 3, areaM2: 90 } },
    { label: "Standard", hint: "4h · Tagesbetrieb", patch: { hours: 4, areaM2: 120 } },
    { label: "Abend", hint: "5h · nach Betrieb", patch: { hours: 5, areaM2: 150 } },
  ],
  MOVING: [
    { label: "Studio", hint: "4h · 15m³", patch: { hours: 4, volumeM3: 15 } },
    { label: "Wohnung", hint: "6h · 25m³", patch: { hours: 6, volumeM3: 25 } },
    { label: "Familie", hint: "8h · 40m³", patch: { hours: 8, volumeM3: 40 } },
  ],
  DISPOSAL: [
    { label: "Klein", hint: "2h · 4m³", patch: { hours: 2, volumeM3: 4 } },
    { label: "Mittel", hint: "3h · 8m³", patch: { hours: 3, volumeM3: 8 } },
    { label: "Groß", hint: "5h · 15m³", patch: { hours: 5, volumeM3: 15 } },
  ],
};

const steps = [
  { id: 1, title: "Service wählen" },
  { id: 2, title: "Details & Adresse" },
  { id: 3, title: "Termin & Kontakt" }
];

export default function BuchenPage() {
  const search = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [cfgs, setCfgs] = useState<Record<string, ServiceCfg>>({});
  const [discountCode, setDiscountCode] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UEBERWEISUNG");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [done, setDone] = useState<BookingResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [slotNotice, setSlotNotice] = useState("");

  const doneTracking = done?.trackingNumber || done?.orderNumber || "";

  useEffect(() => {
    const raw = search.get("service");
    if (!raw) return;
    const mapped = raw === "EXPRESS_MOVING" || raw === "express" ? "MOVING" : raw;
    if (["HOME_CLEANING", "MOVE_OUT_CLEANING", "OFFICE_CLEANING", "MOVING", "DISPOSAL"].includes(mapped)) {
      const s = mapped as ServiceType;
      setServices([s]);
      setCfgs((p) => ({ ...p, [s]: { ...EMPTY_CFG, hours: MIN_HOURS[s], express24h: raw !== mapped } }));
      setCurrentStep(2); // Auto-advance if service pre-selected
    }
  }, [search]);

  const ensureCfg = useCallback((s: ServiceType) => cfgs[s] || { ...EMPTY_CFG, hours: MIN_HOURS[s] }, [cfgs]);

  const setCfg = useCallback((s: ServiceType, patch: Partial<ServiceCfg>) => {
    setCfgs((p) => ({ ...p, [s]: { ...ensureCfg(s), ...patch } }));
  }, [ensureCfg]);

  const toggleService = useCallback((s: ServiceType) => {
    setServices((prev) => {
      if (prev.includes(s)) {
        return prev.filter((x) => x !== s);
      }
      return [...prev, s];
    });
    setCfg(s, { hours: MIN_HOURS[s] });
  }, [setCfg]);

  const quotePayload = useMemo<QuoteServiceInput[]>(() => {
    return services.map((s) => {
      const c = ensureCfg(s);
      return {
        serviceType: s,
        zip: c.addressFrom?.zip || c.addressTo?.zip || "",
        hours: c.hours,
        workers: s === "MOVING" ? 2 : 1,
        distanceKm: s === "MOVING" ? c.distanceKm : undefined,
        volumeM3: s === "MOVING" || s === "DISPOSAL" ? c.volumeM3 : undefined,
        areaM2: s === "MOVE_OUT_CLEANING" ? c.areaM2 : undefined,
        floorFrom: s === "MOVING" || s === "DISPOSAL" ? c.floorFrom : undefined,
        floorTo: s === "MOVING" ? c.floorTo : undefined,
        hasElevatorFrom: c.hasElevatorFrom,
        hasElevatorTo: c.hasElevatorTo,
        express24h: s === "MOVING" ? c.express24h : false,
        express48h: s === "MOVING" ? c.express48h : false,
        extras: [],
      };
    });
  }, [services, ensureCfg]);

  const computedDurationMin = useMemo(() => {
    const total = services.reduce((sum, s) => {
      const c = ensureCfg(s);
      if (s === "MOVING") {
        const routePart = Math.max(0, Math.ceil((c.durationMin || 0) / 30) * 30);
        const floorPart = Math.max(0, (c.floorFrom + c.floorTo) * 10);
        const volumePart = Math.max(0, Math.ceil((c.volumeM3 || 0) / 15) * 20);
        return sum + c.hours * 60 + routePart + floorPart + volumePart;
      }
      if (s === "MOVE_OUT_CLEANING") {
        const areaPart = Math.max(0, Math.ceil((c.areaM2 || 0) / 20) * 15);
        return sum + c.hours * 60 + areaPart;
      }
      if (s === "DISPOSAL") {
        const volumePart = Math.max(0, Math.ceil((c.volumeM3 || 0) / 5) * 15);
        return sum + c.hours * 60 + volumePart;
      }
      return sum + c.hours * 60;
    }, 0);
    return Math.max(60, Math.ceil(total / 30) * 30);
  }, [services, ensureCfg]);

  const isStep2Valid = useMemo(() => {
    if (services.length === 0) return false;
    return quotePayload.every((r) => /^\d{4,5}$/.test(String(r.zip || "")) && Number(r.hours || 0) >= MIN_HOURS[r.serviceType]);
  }, [services, quotePayload]);

  useEffect(() => {
    if (!isStep2Valid) {
      if (services.length === 0) {
        setQuote(null);
      }
      return;
    }
    const t = setTimeout(async () => {
      setQuoteError("");
      setIsCalculating(true);
      try {
        const isWeekend = selectedDate ? new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6 : false;
        const res = await fetch("/api/preisrechner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            services: quotePayload,
            isWeekend,
            discountCode,
            customerEmail,
            customerPhone,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setQuote(null);
          setQuoteError(data.error || "Preisberechnung fehlgeschlagen");
          setIsCalculating(false);
          return;
        }
        setQuote(data.pricing as QuoteResult);
      } catch {
        setQuote(null);
        setQuoteError("Preisberechnung fehlgeschlagen");
      } finally {
        setIsCalculating(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [isStep2Valid, quotePayload, discountCode, customerEmail, customerPhone, selectedDate]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedDate || services.length === 0) {
      setAvailableSlots([]);
      setSlotError("");
      return;
    }

    const fetchAvailability = async () => {
      setSlotLoading(true);
      setSlotError("");
      try {
        const serviceKey = services.join(",");
        const res = await fetch(
          `/api/availability?date=${encodeURIComponent(selectedDate)}&duration=${computedDurationMin}&service=${encodeURIComponent(serviceKey)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          if (!cancelled) {
            setAvailableSlots([]);
            setSlotError(data.error || "Zeitfenster konnten nicht geladen werden.");
          }
          return;
        }
        const slots = Array.isArray(data.slots) ? (data.slots as AvailabilitySlot[]) : [];
        if (!cancelled) {
          setAvailableSlots(slots);
          if (timeSlot && !slots.some((s) => s.label === timeSlot)) {
            setTimeSlot("");
            setSlotNotice("Ihr vorheriges Zeitfenster passt nicht mehr zur aktuellen Dauer.");
          } else {
            setSlotNotice("");
          }
        }
      } catch {
        if (!cancelled) {
          setAvailableSlots([]);
          setSlotError("Zeitfenster konnten nicht geladen werden.");
        }
      } finally {
        if (!cancelled) setSlotLoading(false);
      }
    };

    fetchAvailability();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, services, computedDurationMin, timeSlot]);

  const bookingReady = Boolean(
    quote &&
      selectedDate &&
      timeSlot &&
      customerName &&
      customerEmail &&
      customerPhone &&
      services.length > 0 &&
      (availableSlots.length === 0 || availableSlots.some((s) => s.label === timeSlot))
  );

  async function submit() {
    const currentQuote = quote;
    const errors: Record<string, string> = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim());
    const phoneOk = /^[+0-9\s\-()]{7,}$/.test(customerPhone.trim());
    if (!customerName.trim()) errors.customerName = "Bitte Namen eingeben.";
    if (!emailOk) errors.customerEmail = "Bitte gültige E-Mail eingeben.";
    if (!phoneOk) errors.customerPhone = "Bitte gültige Telefonnummer eingeben.";
    if (!selectedDate) errors.selectedDate = "Bitte Datum wählen.";
    if (!timeSlot) errors.timeSlot = "Bitte Zeitfenster wählen.";

    const invalidZip = services.find((s) => {
      const c = ensureCfg(s);
      const z = c.addressFrom?.zip || c.addressTo?.zip || "";
      return !/^\d{5}$/.test(z);
    });
    if (invalidZip) errors.zip = "Bitte gültige PLZ (5-stellig) in der Adresse eintragen.";

    if (!currentQuote) {
      errors.quote = "Preis konnte nicht berechnet werden.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const finalQuote = currentQuote as QuoteResult;

    setSubmitting(true);
    setSubmitError("");
    try {
      const body = {
        customer: { name: customerName, email: customerEmail, phone: customerPhone },
        services: services.map((s) => ({ serviceType: s, ...ensureCfg(s) })),
        scheduledAt: selectedDate,
        timeSlot,
        notes,
        paymentMethod,
        discountCode,
        quotedTotal: finalQuote.total,
        quoteFingerprint: finalQuote.quoteFingerprint,
      };
      const res = await fetch("/api/buchung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorId = data.requestId ? ` (Fehler-ID: ${data.requestId})` : "";
        setSubmitError(`${data.error || "Buchung fehlgeschlagen"}${errorId}`);
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const booking = data as BookingResult;
      setDone(booking);
      if (paymentMethod === "PAYPAL" && booking.paypalRedirectUrl) {
        window.location.href = booking.paypalRedirectUrl;
      }
    } catch {
      setSubmitError("Technischer Fehler. Bitte versuchen Sie es später erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1 && services.length > 0) setCurrentStep(2);
    if (currentStep === 2 && isStep2Valid) setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-slate-50 dark:bg-navy-950 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xl w-full mx-auto relative z-10"
        >
          <div className="backdrop-blur-2xl bg-white/70 dark:bg-navy-900/40 border border-white/50 dark:border-navy-700/50 shadow-2xl rounded-3xl p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-blue-500" />

            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 border-4 border-white dark:border-navy-800 shadow-lg">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
            </div>

            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
                Buchung erfolgreich!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Vielen Dank für Ihr Vertrauen. Wir haben Ihre Anfrage erhalten.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-navy-950/50 rounded-2xl p-6 border border-slate-200/50 dark:border-navy-700/50 space-y-4 mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-navy-800">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Tracking-Nummer</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{doneTracking}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Angebots-ID</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{done.offerNumber}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <a href={done.offerPdfUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-navy-900 hover:opacity-90 transition-opacity font-medium">
                <FileText size={18} />
                PDF Herunterladen
              </a>
              <a href={`/angebot/${done.offerToken}`} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors font-medium">
                Angebot ansehen
              </a>
              <a href={`/track?tracking=${encodeURIComponent(doneTracking)}`} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors font-medium sm:col-span-2">
                Sendungsverfolgung
              </a>
              {done.paypalRedirectUrl && (
                <a href={done.paypalRedirectUrl} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0070ba] text-white hover:bg-[#005ea6] transition-colors font-medium sm:col-span-2">
                  <CreditCard size={18} /> Bezahlen mit PayPal
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-navy-950 relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Glassmorphic Backgrounds */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 dark:bg-teal-600/10 blur-[140px] pointer-events-none transition-transform duration-1000 ease-in-out" style={{ transform: `translate(${currentStep * 5}%, ${currentStep * 5}%)` }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[140px] pointer-events-none transition-transform duration-1000 ease-in-out" style={{ transform: `translate(-${currentStep * 5}%, -${currentStep * 5}%)` }} />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-10">

        {/* Left Column: Form Steps */}
        <div className="flex-1 w-full space-y-6">

          {/* Header & Progress Bar */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
              Service Buchen
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Konfigurieren Sie jetzt Ihre gewünschten Leistungen schnell und einfach.
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-navy-800 rounded-full z-0 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>

                {steps.map((step) => {
                  const isActive = step.id === currentStep;
                  const isPast = step.id < currentStep;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          if (isPast || (step.id === 2 && services.length > 0) || (step.id === 3 && isStep2Valid)) {
                            setCurrentStep(step.id);
                          }
                        }}
                        disabled={step.id > currentStep && !(step.id === 2 && services.length > 0) && !(step.id === 3 && isStep2Valid)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-sm
                                            ${isActive ? 'bg-teal-600 text-white shadow-teal-500/30 scale-110 shadow-lg' :
                            isPast ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800' : 'bg-white dark:bg-navy-800 border-2 border-slate-200 dark:border-navy-700 text-slate-400 dark:text-slate-500'}
                                        `}
                      >
                        {isPast ? <CheckCircle2 size={18} /> : step.id}
                      </button>
                      <span className={`text-xs font-medium hidden sm:block absolute top-12 whitespace-nowrap ${isActive ? 'text-slate-900 dark:text-white' : isPast ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Form Container - Glassmorphic */}
          <div className="glass-strong rounded-[2rem] p-6 sm:p-10 min-h-[500px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Wand2 className="text-teal-500" /> Womit können wir helfen?
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Wählen Sie einen oder mehrere Services aus, die Sie benötigen.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(Object.keys(LABELS) as ServiceType[]).map((s) => {
                      const Icon = SERVICE_META[s].icon;
                      const isSelected = services.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleService(s)}
                          className={`p-6 rounded-2xl border text-left transition-all duration-500 relative overflow-hidden group
                                            ${isSelected
                              ? "border-teal-500 ring-1 ring-teal-500 bg-teal-50/80 dark:bg-teal-900/40 shadow-lg shadow-teal-500/10 transform -translate-y-1"
                              : "glass hover:-translate-y-1"
                            }`}
                        >
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="flex items-start gap-4 relative z-10">
                            <div className={`p-3 rounded-xl transition-colors ${isSelected ? 'bg-teal-100 dark:bg-teal-800/50' : 'bg-slate-100 dark:bg-navy-900'}`}>
                              <Icon size={24} className={isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold mb-1 ${isSelected ? 'text-teal-900 dark:text-teal-100' : 'text-slate-800 dark:text-slate-200'}`}>
                                {LABELS[s]}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {SERVICE_META[s].desc}
                              </p>
                            </div>
                            <div className="mt-1">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                {isSelected && <CheckCircle2 size={12} className="text-white" />}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      disabled={services.length === 0}
                      onClick={handleNextStep}
                      className="btn-shine flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-navy-900 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-xl"
                    >
                      Weiter zu Details <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MapPin className="text-blue-500" /> Konfiguration
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Passen Sie die Details für Ihre gewählten Services an.</p>
                  </div>

                  <div className="space-y-6">
                    {services.map((s) => {
                      const c = ensureCfg(s);
                      const Icon = SERVICE_META[s].icon;
                      return (
                        <div key={s} className="bg-white/50 dark:bg-navy-800/40 border border-white/60 dark:border-navy-700 p-5 rounded-2xl shadow-sm space-y-5">
                          <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-navy-700/50 pb-3">
                            <div className="p-2 bg-slate-100 dark:bg-navy-900 rounded-lg">
                              <Icon size={18} className="text-slate-700 dark:text-slate-300" />
                            </div>
                            <h3 className="font-semibold text-lg">{LABELS[s]}</h3>
                            <span className="ml-auto text-xs font-medium bg-slate-200/50 dark:bg-navy-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                              Min. {MIN_HOURS[s]} Std.
                            </span>
                          </div>

                          {/* Smart Presets */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Schnellauswahl</label>
                            <div className="grid grid-cols-3 gap-2">
                              {SMART_PRESETS[s].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => setCfg(s, preset.patch)}
                                  className="p-2 rounded-xl border border-slate-200/60 dark:border-navy-700 bg-white/70 dark:bg-navy-900/50 hover:border-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all text-left flex flex-col justify-center items-center text-center"
                                >
                                  <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{preset.label}</span>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{preset.hint}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dauer (Stunden)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min={MIN_HOURS[s]}
                                  value={c.hours}
                                  onChange={(e) => setCfg(s, { hours: Math.max(MIN_HOURS[s], Number(e.target.value)) })}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-teal-500 outline-none transition-shadow"
                                />
                              </div>
                            </div>

                            {(s === "MOVING" || s === "DISPOSAL" || s === "MOVE_OUT_CLEANING") && (
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                  {s === "MOVE_OUT_CLEANING" ? "Fläche (m²)" : "Volumen (m³)"}
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  value={s === "MOVE_OUT_CLEANING" ? c.areaM2 : c.volumeM3}
                                  onChange={(e) => setCfg(s, s === "MOVE_OUT_CLEANING" ? { areaM2: Number(e.target.value) } : { volumeM3: Number(e.target.value) })}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-teal-500 outline-none transition-shadow"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="relative">
                              <AddressAutocomplete
                                label={s === "MOVING" ? "Startadresse" : "Leistungsadresse"}
                                placeholder="Straße, Hausnummer, PLZ..."
                                value={c.addressFrom}
                                onChange={(a) => setCfg(s, { addressFrom: a })}
                                onOpenMapPicker={() => { }}
                                mapButtonLabel=""
                              />
                            </div>

                            {s === "MOVING" && (
                              <div className="relative">
                                <AddressAutocomplete
                                  label="Zieladresse"
                                  placeholder="Straße, Hausnummer, PLZ..."
                                  value={c.addressTo}
                                  onChange={(a) => setCfg(s, { addressTo: a })}
                                  onOpenMapPicker={() => { }}
                                  mapButtonLabel=""
                                />
                              </div>
                            )}
                          </div>

                          {s === "MOVING" && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Express Option</label>
                                <select
                                  value={c.express24h ? "24" : c.express48h ? "48" : "0"}
                                  onChange={(e) => setCfg(s, { express24h: e.target.value === "24", express48h: e.target.value === "48" })}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                                >
                                  <option value="0">Standard Planung</option>
                                  <option value="48">Express 48h (Aufpreis)</option>
                                  <option value="24">Express 24h (Aufpreis)</option>
                                </select>
                              </div>

                              {c.addressFrom && c.addressTo && (
                                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-navy-700">
                                  <RouteMap
                                    fromLat={c.addressFrom?.lat ?? null}
                                    fromLon={c.addressFrom?.lon ?? null}
                                    toLat={c.addressTo?.lat ?? null}
                                    toLon={c.addressTo?.lon ?? null}
                                    onRouteCalculated={(km, min) => setCfg(s, { distanceKm: km, durationMin: min })}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-8 flex justify-between items-center">
                    <button
                      onClick={handlePrevStep}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      <ArrowLeft size={18} /> Zurück
                    </button>
                    <button
                      disabled={!isStep2Valid}
                      onClick={handleNextStep}
                      className="btn-shine flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-navy-900 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-xl"
                    >
                      Weiter <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <CalendarDays className="text-teal-500" /> Letzte Details
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Wählen Sie Ihren Wunschtermin und hinterlegen Sie Ihre Kontaktdaten.</p>
                  </div>

                  <div className="bg-white/50 dark:bg-navy-800/40 border border-white/60 dark:border-navy-700 p-5 rounded-2xl shadow-sm space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-slate-200/50 dark:border-navy-700/50 pb-3">
                      <Calendar size={18} className="text-teal-500" /> Wunschtermin
                    </h3>

                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kalender (DE)</label>
                      <div className="rounded-2xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 p-3 sm:p-4">
                        <DayPicker
                          mode="single"
                          locale={de}
                          weekStartsOn={1}
                          selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
                          onSelect={(d) => {
                            if (!d) return;
                            const asIso = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
                            setSelectedDate(asIso);
                          }}
                          disabled={[
                            { before: new Date(new Date().setHours(0, 0, 0, 0)) },
                            { dayOfWeek: [0] },
                          ]}
                          classNames={{
                            months: "flex justify-center",
                            month: "space-y-2",
                            caption: "flex justify-center py-2 text-sm font-semibold",
                            table: "w-full border-collapse",
                            head_row: "grid grid-cols-7",
                            row: "grid grid-cols-7 mt-1",
                            head_cell: "text-center text-[11px] font-semibold text-slate-500 py-1",
                            cell: "text-center",
                            day: "h-10 w-10 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-navy-800 transition",
                            day_selected: "bg-teal-500 text-white hover:bg-teal-600",
                            day_today: "ring-2 ring-blue-400 text-blue-600 dark:text-blue-300",
                            day_disabled: "opacity-30",
                          }}
                        />
                      </div>
                      {fieldErrors.selectedDate && <p className="text-xs text-red-500">{fieldErrors.selectedDate}</p>}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verfügbare Zeitfenster</label>
                        <span className="text-xs text-slate-500">Dauer: {Math.round(computedDurationMin / 60 * 10) / 10} Std. (automatisch)</span>
                      </div>
                      {slotNotice && <p className="text-xs text-amber-600">{slotNotice}</p>}
                      {slotError && <p className="text-xs text-red-500">{slotError}</p>}
                      {slotLoading ? (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-teal-500 rounded-full animate-spin" />
                          Zeitfenster werden geladen...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-700">
                          Kein freies Zeitfenster für diesen Tag. Bitte wählen Sie ein anderes Datum.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.label}
                              type="button"
                              onClick={() => setTimeSlot(slot.label)}
                              className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                                timeSlot === slot.label
                                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                                  : "bg-white/80 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {fieldErrors.timeSlot && <p className="text-xs text-red-500">{fieldErrors.timeSlot}</p>}
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-navy-800/40 border border-white/60 dark:border-navy-700 p-5 rounded-2xl shadow-sm space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-slate-200/50 dark:border-navy-700/50 pb-3">
                      <User size={18} className="text-blue-500" /> Kontakt & Zahlung
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-slate-400" />
                        </div>
                        <input value={customerName} onChange={(e) => { setCustomerName(e.target.value); setFieldErrors((p) => ({ ...p, customerName: "" })); }} placeholder="Vollständiger Name" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-slate-400" />
                        </div>
                        <input type="email" value={customerEmail} onChange={(e) => { setCustomerEmail(e.target.value); setFieldErrors((p) => ({ ...p, customerEmail: "" })); }} placeholder="E-Mail Adresse" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={16} className="text-slate-400" />
                        </div>
                        <input type="tel" value={customerPhone} onChange={(e) => { setCustomerPhone(e.target.value); setFieldErrors((p) => ({ ...p, customerPhone: "" })); }} placeholder="Telefonnummer" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
                      </div>
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                        <option value="UEBERWEISUNG">Überweisung (Rechnung)</option>
                        <option value="BAR">Barzahlung vor Ort</option>
                        <option value="PAYPAL">PayPal</option>
                      </select>
                    </div>
                    {(fieldErrors.customerName || fieldErrors.customerEmail || fieldErrors.customerPhone || fieldErrors.zip || fieldErrors.quote) && (
                      <div className="space-y-1 text-xs text-red-500">
                        {fieldErrors.customerName && <p>{fieldErrors.customerName}</p>}
                        {fieldErrors.customerEmail && <p>{fieldErrors.customerEmail}</p>}
                        {fieldErrors.customerPhone && <p>{fieldErrors.customerPhone}</p>}
                        {fieldErrors.zip && <p>{fieldErrors.zip}</p>}
                        {fieldErrors.quote && <p>{fieldErrors.quote}</p>}
                      </div>
                    )}
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Besondere Hinweise oder Notizen für uns..." rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white/80 dark:bg-navy-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none" />
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-red-500" />
                      {submitError}
                    </div>
                  )}

                  <div className="pt-8 flex justify-between items-center">
                    <button
                      onClick={handlePrevStep}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      <ArrowLeft size={18} /> Zurück
                    </button>
                    <button
                      disabled={!bookingReady || submitting || isCalculating}
                      onClick={submit}
                      className="btn-shine flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-blue-700 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all duration-300 font-bold text-lg"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verarbeite...
                        </span>
                      ) : (
                        <>Verbindlich buchen <CheckCircle2 size={20} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Sticky Live-Preis Widget */}
        <div className="lg:w-[400px] w-full shrink-0">
          <div className="sticky top-8 glass-strong rounded-[2rem] p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-xl font-bold flex items-center justify-between mb-6">
              Zusammenfassung
              <span className="relative flex h-3 w-3">
                {quote ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 hidden sm:block"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-300 dark:bg-slate-600"></span>
                )}
              </span>
            </h3>

            {services.length === 0 ? (
              <div className="py-8 text-center bg-slate-50/50 dark:bg-navy-800/30 rounded-2xl border border-slate-200/50 dark:border-navy-700/50 border-dashed">
                <Sparkles className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={32} />
                <p className="text-sm text-slate-500 dark:text-slate-400">Wählen Sie Services aus, um den Preis zu sehen.</p>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                <ul className="space-y-3 mb-6">
                  {services.map(s => (
                    <li key={s} className="flex justify-between items-start text-sm">
                      <div className="font-medium text-slate-700 dark:text-slate-200">
                        {LABELS[s]}
                        {cfgs[s] && (
                          <div className="text-xs text-slate-500 font-normal mt-0.5">
                            {cfgs[s].hours} Std.
                            {s === "MOVING" && cfgs[s].distanceKm > 0 && ` • ${cfgs[s].distanceKm.toFixed(1)} km`}
                          </div>
                        )}
                      </div>
                      <div className="p-1 rounded bg-slate-100 dark:bg-navy-800">
                        <CheckCircle2 size={12} className="text-teal-500" />
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl border border-slate-200/70 dark:border-navy-700/70 bg-white/50 dark:bg-navy-900/30 p-3 text-xs space-y-1 mb-4">
                  <p><span className="text-slate-500">Termin:</span> {selectedDate ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("de-DE") : "Nicht gewählt"}</p>
                  <p><span className="text-slate-500">Zeitfenster:</span> {timeSlot || "Nicht gewählt"}</p>
                  <p><span className="text-slate-500">Dauer:</span> {Math.round(computedDurationMin / 60 * 10) / 10} Std.</p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-navy-700">
                  {quoteError ? (
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                      Bitte füllen Sie notwendige Felder (wie PLZ) aus.
                    </div>
                  ) : quote ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>Zwischensumme</span>
                        <span>{formatCurrency(quote.subtotal)}</span>
                      </div>
                      {quote.discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600 font-medium">
                          <span>Rabatt</span>
                          <span>-{formatCurrency(quote.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>MwSt. (19%)</span>
                        <span>{formatCurrency(quote.mwst)}</span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-200 dark:border-navy-700 flex justify-between items-end">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Gesamtbetrag</p>
                        </div>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
                          {formatCurrency(quote.total)}
                        </div>
                      </div>
                      {services.includes("MOVING") && (
                        <p className="text-[11px] text-amber-600 mt-2">
                          Distanzkosten sind als Richtwert/Schätzung ausgewiesen bis zur finalen Einsatzplanung.
                        </p>
                      )}

                      {/* Discount Input inside widget */}
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-navy-700">
                        <input
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          placeholder="Gutscheincode"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-navy-700 bg-white/50 dark:bg-navy-900/30 focus:border-teal-500 outline-none text-center uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6">
                      <div className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                      <span className="ml-2 text-sm text-slate-500">Berechne...</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-navy-700 space-y-2">
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck size={14} className="text-teal-500" /> Preisfixierung & Garantie
                  </p>
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 size={14} className="text-teal-500" /> Live-Preisberechnung
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
