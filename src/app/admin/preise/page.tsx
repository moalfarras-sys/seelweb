"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Euro,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  X,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicePricing {
  id: string;
  serviceId: string;
  zone: string;
  hourlyRate: number;
  minimumHours: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
  isActive: boolean;
  service: { id: string; category: string; nameDe: string };
}

interface Extra {
  id: string;
  code: string;
  nameDe: string;
  descDe: string | null;
  timeAddMin: number;
  extraFee: number;
  allowCustom: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface Discount {
  id: string;
  code: string;
  description: string | null;
  amount: number;
  isPercent: boolean;
  validFrom: string;
  validTo: string;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
}

type Tab = "rates" | "extras" | "discounts";

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function PreisePage() {
  const [tab, setTab] = useState<Tab>("rates");
  const [pricing, setPricing] = useState<ServicePricing[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [showExtraForm, setShowExtraForm] = useState(false);
  const [newExtra, setNewExtra] = useState({ code: "", nameDe: "", timeAddMin: 30, extraFee: 0 });
  const [creatingExtra, setCreatingExtra] = useState(false);

  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [newDiscount, setNewDiscount] = useState({ code: "", description: "", amount: 10, isPercent: true, validFrom: "", validTo: "" });
  const [creatingDiscount, setCreatingDiscount] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/preise");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPricing(data.pricing || []);
      setExtras(data.extras || []);
      setDiscounts(data.discounts || []);
    } catch {
      setError("Preisdaten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

function updateLocalRate<K extends keyof ServicePricing>(id: string, key: K, val: ServicePricing[K]) {
    setPricing((prev) => prev.map((r) => (r.id === id ? { ...r, [key] : val } : r)));
  } async function saveRate(rate: ServicePricing) {
    setSaving(rate.id);
    try {
      const res = await fetch(`/api/admin/preise/${rate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hourlyRate: rate.hourlyRate,
          minimumHours: rate.minimumHours,
          weekendMultiplier: rate.weekendMultiplier,
          holidayMultiplier: rate.holidayMultiplier,
        }),
      });
      if (!res.ok) throw new Error();
      const updated: ServicePricing = await res.json();
      setPricing((prev) => prev.map((r) => (r.id === rate.id ? updated : r)));
      setSaved(rate.id);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      alert("Preis konnte nicht gespeichert werden.");
    } finally {
      setSaving(null);
    }
  } async function deleteExtra(id: string) {
    if (!confirm("Extra wirklich löschen")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/extras/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setExtras((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Extra konnte nicht gelöscht werden.");
    } finally {
      setDeleting(null);
    }
  }

  async function createExtra() {
    if (!newExtra.code || !newExtra.nameDe) return;
    setCreatingExtra(true);
    try {
      const res = await fetch("/api/admin/extras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExtra),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Extra konnte nicht erstellt werden.");
        return;
      };

const created: Extra = await res.json();
      setExtras((prev) => [...prev, created]);
      setNewExtra({ code: "", nameDe: "", timeAddMin: 30, extraFee: 0 });
      setShowExtraForm(false);
    } catch {
      alert("Extra konnte nicht erstellt werden.");
    } finally {
      setCreatingExtra(false);
    }
  }

  async function createDiscount() {
    if (!newDiscount.code || !newDiscount.validFrom || !newDiscount.validTo) return;
    setCreatingDiscount(true);
    try {
      const res = await fetch("/api/admin/rabatte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDiscount),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Rabatt konnte nicht erstellt werden.");
        return;
      };

const created: Discount = await res.json();
      setDiscounts((prev) => [created, ...prev]);
      setNewDiscount({ code: "", description: "", amount: 10, isPercent: true, validFrom: "", validTo: "" });
      setShowDiscountForm(false);
    } catch {
      alert("Rabatt konnte nicht erstellt werden.");
    } finally {
      setCreatingDiscount(false);
    }
  };

const tabs: { id: Tab; label: string; icon: typeof Euro }[] = [
    { id: "rates", label: "Stundenpreise", icon: Euro },
    { id: "extras", label: "Extras", icon: Sparkles },
    { id: "discounts", label: "Rabattcodes", icon: Tag },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
        <div className="h-10 w-80 bg-gray-200 dark:bg-navy-700 rounded-xl animate-pulse" />
        <div className="bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 border-b border-gray-50 dark:border-navy-700/30 bg-gray-100/50 dark:bg-navy-700/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button onClick={() => { setError(""); fetchData(); }} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl text-sm hover:bg-teal-600 transition-colors">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Preiskonfiguration</h1>
          <p className="text-silver-500 dark:text-silver-400 text-sm">Stundenpreise, Extras und Rabatte verwalten</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-navy-800/50 p-1 rounded-xl w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-white dark:bg-navy-700 text-navy-800 dark:text-white shadow-sm" : "text-silver-500 hover:text-navy-700 dark:hover:text-silver-300",
              )}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "rates" && (
        <div className="bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-navy-800/40 border-b border-gray-100 dark:border-navy-700/50">
                  <th className="text-left text-xs font-semibold text-silver-500 uppercase px-5 py-3">Service</th>
                  <th className="text-left text-xs font-semibold text-silver-500 uppercase px-5 py-3">Zone</th>
                  <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3">€/Std.</th>
                  <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3">Min. Std.</th>
                  <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3">WE-Faktor</th>
                  <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3">Feiertag</th>
                  <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {pricing.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 dark:border-navy-700/30 hover:bg-gray-50/50 dark:hover:bg-navy-800/20 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-navy-800 dark:text-white">{r.service.nameDe}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 font-medium">
                        {r.zone}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input
                        type="number"
                        step="0.5"
                        value={r.hourlyRate}
                        onChange={(e) => updateLocalRate(r.id, "hourlyRate", Number(e.target.value))}
                        className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 focus:border-teal-500 outline-none text-sm text-right text-navy-800 dark:text-white"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={r.minimumHours}
                        onChange={(e) => updateLocalRate(r.id, "minimumHours", Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 focus:border-teal-500 outline-none text-sm text-right text-navy-800 dark:text-white"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input
                        type="number"
                        step="0.05"
                        min="1"
                        value={r.weekendMultiplier}
                        onChange={(e) => updateLocalRate(r.id, "weekendMultiplier", Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 focus:border-teal-500 outline-none text-sm text-right text-navy-800 dark:text-white"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input
                        type="number"
                        step="0.05"
                        min="1"
                        value={r.holidayMultiplier}
                        onChange={(e) => updateLocalRate(r.id, "holidayMultiplier", Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 focus:border-teal-500 outline-none text-sm text-right text-navy-800 dark:text-white"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => saveRate(r)}
                        disabled={saving === r.id}
                        className="px-3 py-1.5 bg-teal-500 text-white text-xs font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {saving === r.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : saved === r.id ? (
                          <Check size={14} />
                        ) : (
                          <Save size={14} />
                        )}
{saved === r.id ? "Gespeichert" : "Speichern"}
                      </button>
                    </td>
                  </tr>
                ))}
                {pricing.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-silver-500 dark:text-silver-400">
                      Keine Preise konfiguriert.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50 dark:bg-navy-800/40 border-t border-gray-100 dark:border-navy-700/50">
            <p className="text-xs text-silver-500 dark:text-silver-400">
              <strong>WE-Faktor:</strong> Multiplikator am Wochenende (z.B. 1.25 = +25%).
              <strong className="ml-2">Feiertag:</strong> Multiplikator an Feiertagen (z.B. 1.5 = +50%).
            </p>
          </div>
        </div>
      )}

      {tab === "extras" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy-800/40 border-b border-gray-100 dark:border-navy-700/50">
                    <th className="text-left text-xs font-semibold text-silver-500 uppercase px-5 py-3">Extra</th>
                    <th className="text-left text-xs font-semibold text-silver-500 uppercase px-5 py-3">Code</th>
                    <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3">+Min.</th>
                    <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3">+Gebühr</th>
                    <th className="text-center text-xs font-semibold text-silver-500 uppercase px-5 py-3">Aktiv</th>
                    <th className="text-right text-xs font-semibold text-silver-500 uppercase px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {extras.map((e) => (
                    <tr key={e.id} className="border-b border-gray-50 dark:border-navy-700/30 hover:bg-gray-50/50 dark:hover:bg-navy-800/20 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-navy-800 dark:text-white">{e.nameDe}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-mono text-silver-500">{e.code}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-navy-800 dark:text-white">{e.timeAddMin}</td>
                      <td className="px-5 py-3 text-sm text-right text-navy-800 dark:text-white">{fmt.format(e.extraFee)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          e.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
                        )}>
                          {e.isActive ? "Aktiv" : "Inaktiv"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => deleteExtra(e.id)}
                          disabled={deleting === e.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-silver-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deleting === e.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {extras.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-silver-500 dark:text-silver-400">
                        Keine Extras konfiguriert.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showExtraForm ? (
            <div className="bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-navy-800 dark:text-white">Neues Extra</h3>
                <button onClick={() => setShowExtraForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700">
                  <X size={16} className="text-silver-400" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Code</label>
                  <input
                    type="text" value={newExtra.code} onChange={(e) => setNewExtra((p) => ({ ...p, code : e.target.value.toUpperCase() }))}
                    placeholder="z.B. WINDOW"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Name</label>
                  <input
                    type="text" value={newExtra.nameDe} onChange={(e) => setNewExtra((p) => ({ ...p, nameDe : e.target.value }))}
                    placeholder="z.B. Fensterreinigung"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Zusätzliche Minuten</label>
                  <input
                    type="number"
                    min="5"
                    step="5" value={newExtra.timeAddMin} onChange={(e) => setNewExtra((p) => ({ ...p, timeAddMin : Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Extra-Gebühr (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5" value={newExtra.extraFee} onChange={(e) => setNewExtra((p) => ({ ...p, extraFee : Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={createExtra}
                  disabled={creatingExtra || !newExtra.code || !newExtra.nameDe}
                  className="px-5 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {creatingExtra && <Loader2 size={14} className="animate-spin" />}
                  Erstellen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowExtraForm(true)}
              className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium px-1"
            >
              <Plus size={16} /> Neues Extra hinzufügen
            </button>
          )}
        </div>
      )}

      {tab === "discounts" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50 p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-navy-700/50">
                    <th className="text-left text-xs font-semibold text-silver-500 uppercase py-2 pr-4">Code</th>
                    <th className="text-left text-xs font-semibold text-silver-500 uppercase py-2 pr-4">Rabatt</th>
                    <th className="text-left text-xs font-semibold text-silver-500 uppercase py-2 pr-4">Gültig bis</th>
                    <th className="text-left text-xs font-semibold text-silver-500 uppercase py-2 pr-4">Nutzungen</th>
                    <th className="text-left text-xs font-semibold text-silver-500 uppercase py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((d) => (
                    <tr key={d.id} className="border-b border-gray-50 dark:border-navy-700/30">
                      <td className="py-3 pr-4 font-mono text-sm text-teal-600 dark:text-teal-400">{d.code}</td>
                      <td className="py-3 pr-4 text-sm text-navy-800 dark:text-white">
                        {d.isPercent ? `${d.amount}%` : `${fmt.format(d.amount)} (fest)`}
                      </td>
                      <td className="py-3 pr-4 text-sm text-silver-600 dark:text-silver-400">
                        {new Date(d.validTo).toLocaleDateString("de-DE")}
                      </td>
                      <td className="py-3 pr-4 text-sm text-silver-600 dark:text-silver-400">
                        {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : ""}
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          d.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
                        )}>
                          {d.isActive ? "Aktiv" : "Inaktiv"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {discounts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-silver-500 dark:text-silver-400">
                        Keine Rabattcodes vorhanden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showDiscountForm ? (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-navy-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-navy-800 dark:text-white">Neuer Rabattcode</h3>
                  <button onClick={() => setShowDiscountForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700">
                    <X size={16} className="text-silver-400" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Code</label>
                    <input
                      type="text" value={newDiscount.code} onChange={(e) => setNewDiscount((p) => ({ ...p, code : e.target.value.toUpperCase() }))}
                      placeholder="z.B. NEUKUNDE10"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Beschreibung</label>
                    <input
                      type="text" value={newDiscount.description} onChange={(e) => setNewDiscount((p) => ({ ...p, description : e.target.value }))}
                      placeholder="Optional"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Betrag</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1" value={newDiscount.amount} onChange={(e) => setNewDiscount((p) => ({ ...p, amount : Number(e.target.value) }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                      />
                      <select value={newDiscount.isPercent ? "percent" : "fixed"} onChange={(e) => setNewDiscount((p) => ({ ...p, isPercent: e.target.value === "percent" }))}
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                      >
                        <option value="percent">%</option>
                        <option value="fixed">€ (fest)</option>
                      </select>
                    </div>
                  </div>
                  <div />
                  <div>
                    <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Gültig von</label>
                    <input
                      type="date" value={newDiscount.validFrom} onChange={(e) => setNewDiscount((p) => ({ ...p, validFrom : e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-silver-500 dark:text-silver-400 mb-1">Gültig bis</label>
                    <input
                      type="date" value={newDiscount.validTo} onChange={(e) => setNewDiscount((p) => ({ ...p, validTo : e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={createDiscount}
                    disabled={creatingDiscount || !newDiscount.code || !newDiscount.validFrom || !newDiscount.validTo}
                    className="px-5 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {creatingDiscount && <Loader2 size={14} className="animate-spin" />}
                    Erstellen
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDiscountForm(true)}
                className="mt-4 flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
              >
                <Plus size={16} /> Neuen Rabattcode erstellen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
