"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Save, Euro } from "lucide-react";

type PricingSettings = {
  publicMovingStandardEur: number;
  publicMovingExpressEur: number;
  publicMovingExpressSurchargePct: number;
  publicHomeCleaningEur: number;
  publicOfficeMovingEur: number;
  publicOfficeCleaningEur: number;
  publicDisposalEur: number;
  publicMoveOutCleaningEur: number;
  updatedAt: string;
};

const emptyState: PricingSettings = {
  publicMovingStandardEur: 59,
  publicMovingExpressEur: 75,
  publicMovingExpressSurchargePct: 40,
  publicHomeCleaningEur: 34,
  publicOfficeMovingEur: 59,
  publicOfficeCleaningEur: 34,
  publicDisposalEur: 49,
  publicMoveOutCleaningEur: 34,
  updatedAt: new Date().toISOString(),
};

const fields: Array<{ key: keyof PricingSettings; label: string; unit: string }> = [
  { key: "publicMovingStandardEur", label: "Umzug Standard", unit: "EUR/Std." },
  { key: "publicMovingExpressEur", label: "Expressumzug", unit: "EUR/Std." },
  { key: "publicMovingExpressSurchargePct", label: "Expresszuschlag", unit: "%" },
  { key: "publicHomeCleaningEur", label: "Wohnungsreinigung", unit: "EUR/Std." },
  { key: "publicOfficeMovingEur", label: "Büro- & Gewerbeumzug", unit: "EUR/Std." },
  { key: "publicOfficeCleaningEur", label: "Büroreinigung", unit: "EUR/Std." },
  { key: "publicDisposalEur", label: "Entrümpelung", unit: "EUR/Std." },
  { key: "publicMoveOutCleaningEur", label: "Endreinigung", unit: "EUR/Std." },
];

export default function PreisePage() {
  const [form, setForm] = useState<PricingSettings>(emptyState);
  const [initialForm, setInitialForm] = useState<PricingSettings>(emptyState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/pricing-settings", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const merged = { ...emptyState, ...data };
        setForm(merged);
        setInitialForm(merged);
      } catch {
        setMessage({ type: "err", text: "Preise konnten nicht geladen werden." });
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch("/api/admin/pricing-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();
      const merged = { ...form, ...saved };
      setForm(merged);
      setInitialForm(merged);
      setMessage({ type: "ok", text: "Preise wurden gespeichert" });
    } catch {
      setMessage({ type: "err", text: "Die Preise konnten nicht gespeichert werden. Bitte versuchen Sie es erneut." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Preise verwalten</h1>
        <p className="mt-1 text-sm text-silver-500 dark:text-silver-400">
          Zentrale Startpreise für Website, Service-Seiten und Buchungsflow.
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          }`}
        >
          {message.type === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-navy-700/50 dark:bg-navy-800/60 md:p-8">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-silver-500 dark:text-silver-400">
            <Loader2 size={16} className="animate-spin" />
            Preise werden geladen...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-navy-700/50 dark:bg-navy-900/40">
                  <span className="mb-2 block text-sm font-semibold text-navy-800 dark:text-white">{field.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Euro size={18} />
                    </div>
                    <input
                      type="number"
                      step={field.unit === "%" ? "1" : "0.5"}
                      min="0"
                      value={String(form[field.key] ?? "")}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.key]: Number(event.target.value),
                        }))
                      }
                      className="h-11 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-navy-800 outline-none transition focus:border-teal-500 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                    />
                    <span className="w-20 text-right text-xs font-semibold uppercase tracking-wide text-silver-500 dark:text-silver-400">
                      {field.unit}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-navy-700/50 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-silver-500 dark:text-silver-400">
                Zuletzt aktualisiert: {new Date(form.updatedAt).toLocaleString("de-DE")}
              </p>
              <button
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Speichert..." : "Speichern"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
