"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  FileText,
  FileCheck2,
  CalendarClock,
  ScanSearch,
  ShieldCheck,
  CircleDot,
  CheckCircle2,
  Clock3,
} from "lucide-react";

type TrackingPayload = {
  trackingNumber: string;
  orderNumber: string;
  status: string;
  customer: { name: string; email: string };
  service: { category: string; name: string };
  scheduledAt: string | null;
  timeSlot: string | null;
  price: { subtotal: number; discountAmount: number; total: number };
  offer: null | { number: string; status: string; token: string; pdfUrl: string; pageUrl: string };
  contract: null | { number: string; status: string; token: string; pageUrl: string };
  timeline: Array<{ key: string; label: string; at: string }>;
};

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

const STATUS_META: Record<string, { label: string; className: string }> = {
  ANFRAGE: { label: "Anfrage eingegangen", className: "bg-amber-100 text-amber-800" },
  ANGEBOT: { label: "Angebot erstellt", className: "bg-orange-100 text-orange-800" },
  BESTAETIGT: { label: "Bestaetigt", className: "bg-blue-100 text-blue-800" },
  IN_BEARBEITUNG: { label: "In Bearbeitung", className: "bg-violet-100 text-violet-800" },
  ABGESCHLOSSEN: { label: "Abgeschlossen", className: "bg-emerald-100 text-emerald-800" },
  STORNIERT: { label: "Storniert", className: "bg-rose-100 text-rose-800" },
};

export default function TrackPage() {
  const params = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TrackingPayload | null>(null);

  const statusMeta = useMemo(() => {
    if (!data) return null;
    return STATUS_META[data.status] || { label: data.status, className: "bg-slate-100 text-slate-700" };
  }, [data]);

  async function lookup() {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const normalized = trackingNumber.trim().toUpperCase();
      if (!normalized) {
        setError("Bitte Trackingnummer eingeben.");
        return;
      }
      const res = await fetch(`/api/tracking/${encodeURIComponent(normalized)}`);
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || "Trackingnummer nicht gefunden.");
        return;
      }
      setData(payload);
    } catch {
      setError("Technischer Fehler bei der Abfrage.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const p = params.get("tracking");
    if (p) setTrackingNumber(p);
  }, [params]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ccfbf1_0%,_#f8fafc_45%,_#e2e8f0_100%)] dark:bg-navy-950 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <section className="rounded-2xl overflow-hidden border border-teal-100 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-5 text-white">
            <h1 className="text-2xl font-bold">Auftrag verfolgen</h1>
            <p className="text-sm text-cyan-50 mt-1">
              Live Status, Dokumente und Zeitverlauf mit Ihrer Trackingnummer.
            </p>
          </div>
          <div className="bg-white dark:bg-navy-800/80 p-5">
            <div className="flex gap-2">
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="T-2603-00012"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-900/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
              />
              <button
                onClick={lookup}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Search size={16} />
                {loading ? "Suche..." : "Suchen"}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-3">
          <div className="bg-white/90 border border-gray-100 rounded-xl p-4">
            <ScanSearch size={18} className="text-teal-600 mb-2" />
            <p className="text-sm font-semibold text-navy-800">Nummer eingeben</p>
            <p className="text-xs text-slate-500">Z.B. T-2603-00012 aus Ihrer Bestätigung.</p>
          </div>
          <div className="bg-white/90 border border-gray-100 rounded-xl p-4">
            <Clock3 size={18} className="text-teal-600 mb-2" />
            <p className="text-sm font-semibold text-navy-800">Status live sehen</p>
            <p className="text-xs text-slate-500">Schritt fuer Schritt vom Angebot bis Abschluss.</p>
          </div>
          <div className="bg-white/90 border border-gray-100 rounded-xl p-4">
            <ShieldCheck size={18} className="text-teal-600 mb-2" />
            <p className="text-sm font-semibold text-navy-800">Dokumente zentral</p>
            <p className="text-xs text-slate-500">Angebot und Vertrag direkt abrufbar.</p>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white/90 border border-gray-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-navy-800 mb-3">Status-Legende</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <span key={key} className={`px-2 py-1 rounded-full font-medium ${meta.className}`}>
                  {meta.label}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white/90 border border-gray-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-navy-800 mb-2">Hinweis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nach dem Absenden Ihrer Buchung erhalten Sie eine Trackingnummer und koennen den kompletten
              Ablauf hier jederzeit einsehen. Dokumente werden automatisch verlinkt, sobald sie verfuegbar sind.
            </p>
          </div>
        </section>

        {data && (
          <>
            <section className="bg-white dark:bg-navy-800/70 border border-gray-100 dark:border-navy-700/50 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-silver-500 uppercase tracking-wide">Trackingnummer</p>
                  <p className="font-mono text-xl font-bold text-teal-600">{data.trackingNumber}</p>
                </div>
                <div className={`text-xs font-semibold px-3 py-1 rounded-full ${statusMeta?.className || ""}`}>
                  {statusMeta?.label || data.status}
                </div>
              </div>
              <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-silver-500">Service</p>
                  <p className="font-medium text-navy-800 dark:text-white">{data.service.name}</p>
                </div>
                <div>
                  <p className="text-silver-500">Gesamt</p>
                  <p className="font-medium text-navy-800 dark:text-white">{fmt.format(data.price.total)}</p>
                </div>
                <div>
                  <p className="text-silver-500">Termin</p>
                  <p className="font-medium text-navy-800 dark:text-white">
                    {data.scheduledAt ? new Date(data.scheduledAt).toLocaleDateString("de-DE") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-silver-500">Zeitfenster</p>
                  <p className="font-medium text-navy-800 dark:text-white">{data.timeSlot || "-"}</p>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-navy-800/70 border border-gray-100 dark:border-navy-700/50 rounded-2xl p-6 space-y-3">
              <h2 className="font-semibold text-navy-800 dark:text-white">Dokumente</h2>
              {data.offer && (
                <div className="flex items-center justify-between border border-gray-100 dark:border-navy-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-sm text-navy-800 dark:text-white">
                    <FileText size={16} className="text-teal-500" />
                    Angebot {data.offer.number} ({data.offer.status})
                  </div>
                  <div className="flex gap-2">
                    <a href={data.offer.pdfUrl} className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold">PDF</a>
                    <a href={data.offer.pageUrl} className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-navy-600 text-xs font-semibold text-navy-800 dark:text-silver-200">Oeffnen</a>
                  </div>
                </div>
              )}
              {data.contract && (
                <div className="flex items-center justify-between border border-gray-100 dark:border-navy-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-sm text-navy-800 dark:text-white">
                    <FileCheck2 size={16} className="text-teal-500" />
                    Vertrag {data.contract.number} ({data.contract.status})
                  </div>
                  <a href={data.contract.pageUrl} className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-navy-600 text-xs font-semibold text-navy-800 dark:text-silver-200">Oeffnen</a>
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-navy-800/70 border border-gray-100 dark:border-navy-700/50 rounded-2xl p-6">
              <h2 className="font-semibold text-navy-800 dark:text-white mb-3">Zeitverlauf</h2>
              <div className="space-y-3">
                {data.timeline.map((step, idx) => (
                  <div key={step.key} className="grid grid-cols-[18px_1fr_auto] items-start gap-3 text-sm">
                    <div className="pt-0.5">
                      {idx === data.timeline.length - 1 ? (
                        <CheckCircle2 size={15} className="text-teal-600" />
                      ) : (
                        <CircleDot size={15} className="text-teal-500" />
                      )}
                    </div>
                    <span className="text-navy-800 dark:text-white">{step.label}</span>
                    <span className="text-silver-500">{new Date(step.at).toLocaleString("de-DE")}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500 inline-flex items-center gap-1.5">
                <CalendarClock size={13} className="text-teal-500" />
                Alle Zeiten in lokaler Zeitzone.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
