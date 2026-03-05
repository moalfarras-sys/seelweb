"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

type ServiceRef = { id: string; nameDe: string; category: string };
type AreaRef = { id: string; regionName: string };
type PriceRule = {
  id: string;
  serviceId: string;
  regionId: string;
  baseFee: number;
  unitType: "hourly" | "km" | "m2" | "m3" | "flat";
  unitPrice: number;
  minUnits: number;
  enabled: boolean;
  priority: number;
  service: ServiceRef;
  region: AreaRef;
};

type PricingSettings = {
  kmPriceEur: number;
  roundTripMultiplier: number;
  minimumFeeEur: number;
  vatEnabled: boolean;
  estimateLabelEnabled: boolean;
  baseMovingEur: number;
  baseDisposalEur: number;
  baseHomeCleaningEur: number;
  baseMoveOutCleaningEur: number;
  baseOfficeCleaningEur: number;
};

const emptySettings: PricingSettings = {
  kmPriceEur: 0.75,
  roundTripMultiplier: 1,
  minimumFeeEur: 0,
  vatEnabled: true,
  estimateLabelEnabled: true,
  baseMovingEur: 0,
  baseDisposalEur: 0,
  baseHomeCleaningEur: 0,
  baseMoveOutCleaningEur: 0,
  baseOfficeCleaningEur: 0,
};

export default function PreisregelnPage() {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [services, setServices] = useState<ServiceRef[]>([]);
  const [areas, setAreas] = useState<AreaRef[]>([]);
  const [settings, setSettings] = useState<PricingSettings>(emptySettings);
  const [newRule, setNewRule] = useState({
    serviceId: "",
    regionId: "",
    unitType: "km" as PriceRule["unitType"],
    baseFee: 0,
    unitPrice: 0.75,
    minUnits: 0,
    priority: 20,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [preiseRes, settingsRes] = await Promise.all([
        fetch("/api/admin/preise", { cache: "no-store" }),
        fetch("/api/admin/pricing-settings", { cache: "no-store" }),
      ]);

      const preiseJson = await preiseRes.json();
      const settingsJson = await settingsRes.json();

      const loadedRules = (preiseJson.priceRules || []) as PriceRule[];
      const loadedAreas = (preiseJson.serviceAreas || []) as AreaRef[];
      const loadedServices = (preiseJson.serviceDefinitions || [])
        .map((x: { service: ServiceRef }) => x.service)
        .filter((x: ServiceRef, idx: number, arr: ServiceRef[]) => arr.findIndex((a) => a.id === x.id) === idx)
        .sort((a: ServiceRef, b: ServiceRef) => a.nameDe.localeCompare(b.nameDe));

      setRules(loadedRules);
      setAreas(loadedAreas);
      setServices(loadedServices);
      setSettings({ ...emptySettings, ...settingsJson });
      setNewRule((p) => ({
        ...p,
        serviceId: p.serviceId || loadedServices[0]?.id || "",
        regionId: p.regionId || loadedAreas[0]?.id || "",
        unitPrice: settingsJson?.kmPriceEur ?? p.unitPrice,
      }));
      setLoading(false);
    })();
  }, []);

  const movingKmRules = useMemo(
    () => rules.filter((r) => r.unitType === "km" && r.service?.category === "MOVING"),
    [rules]
  );

  async function saveSettings() {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/pricing-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("save settings");
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveRule(rule: PriceRule) {
    const res = await fetch(`/api/admin/price-rules/${rule.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
    if (!res.ok) return;
    const updated = (await res.json()) as PriceRule;
    setRules((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
  }

  async function createRule() {
    const res = await fetch("/api/admin/price-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newRule,
        enabled: true,
      }),
    });
    if (!res.ok) return;
    const created = (await res.json()) as PriceRule;
    const service = services.find((s) => s.id === created.serviceId);
    const region = areas.find((a) => a.id === created.regionId);
    setRules((prev) => [{ ...created, service: service!, region: region! }, ...prev]);
  }

  async function deleteRule(id: string) {
    const res = await fetch(`/api/admin/price-rules/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Lade Preisregeln…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Preisregeln</h1>
        <p className="text-sm text-silver-500 dark:text-silver-400">Distanzpreis (€/km), Basispreise, Mindestbetrag und MwSt.</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-navy-700 p-4 bg-white dark:bg-navy-900/40 space-y-4">
        <h2 className="font-semibold">Globale Einstellungen</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="text-sm">€/km (Richtwert)
            <input type="number" step="0.01" value={settings.kmPriceEur} onChange={(e) => setSettings((p) => ({ ...p, kmPriceEur: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
          <label className="text-sm">Fahrtfaktor
            <input type="number" step="0.01" value={settings.roundTripMultiplier} onChange={(e) => setSettings((p) => ({ ...p, roundTripMultiplier: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
          <label className="text-sm">Mindestbetrag (€)
            <input type="number" step="0.01" value={settings.minimumFeeEur} onChange={(e) => setSettings((p) => ({ ...p, minimumFeeEur: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="text-sm">Basispreis Umzug (€)
            <input type="number" step="0.01" value={settings.baseMovingEur} onChange={(e) => setSettings((p) => ({ ...p, baseMovingEur: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
          <label className="text-sm">Basispreis Entsorgung (€)
            <input type="number" step="0.01" value={settings.baseDisposalEur} onChange={(e) => setSettings((p) => ({ ...p, baseDisposalEur: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
          <label className="text-sm">Basispreis Home Cleaning (€)
            <input type="number" step="0.01" value={settings.baseHomeCleaningEur} onChange={(e) => setSettings((p) => ({ ...p, baseHomeCleaningEur: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
          <label className="text-sm">Basispreis Endreinigung (€)
            <input type="number" step="0.01" value={settings.baseMoveOutCleaningEur} onChange={(e) => setSettings((p) => ({ ...p, baseMoveOutCleaningEur: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
          <label className="text-sm">Basispreis Büro (€)
            <input type="number" step="0.01" value={settings.baseOfficeCleaningEur} onChange={(e) => setSettings((p) => ({ ...p, baseOfficeCleaningEur: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
          </label>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.vatEnabled} onChange={(e) => setSettings((p) => ({ ...p, vatEnabled: e.target.checked }))} /> MwSt. aktiv</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.estimateLabelEnabled} onChange={(e) => setSettings((p) => ({ ...p, estimateLabelEnabled: e.target.checked }))} /> Label „Richtwert / Schätzung“</label>
        </div>
        <button onClick={saveSettings} disabled={savingSettings} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-teal-600 text-white text-sm">
          {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Einstellungen speichern
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-navy-700 p-4 bg-white dark:bg-navy-900/40 space-y-4">
        <h2 className="font-semibold">Distanzregeln (Umzug)</h2>
        <p className="text-xs text-slate-500">Aktive km-Regeln: {movingKmRules.length}. Diese werden live im Preisrechner genutzt.</p>
        <div className="space-y-2">
          {movingKmRules.map((r) => (
            <div key={r.id} className="grid md:grid-cols-8 gap-2 items-end border rounded p-2">
              <div className="md:col-span-2 text-xs text-slate-500">{r.service?.nameDe} · {r.region?.regionName}</div>
              <label className="text-xs">Basis
                <input type="number" step="0.01" value={r.baseFee} onChange={(e) => setRules((prev) => prev.map((x) => x.id === r.id ? { ...x, baseFee: Number(e.target.value) } : x))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
              </label>
              <label className="text-xs">€/Einheit
                <input type="number" step="0.01" value={r.unitPrice} onChange={(e) => setRules((prev) => prev.map((x) => x.id === r.id ? { ...x, unitPrice: Number(e.target.value) } : x))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
              </label>
              <label className="text-xs">Min Einheiten
                <input type="number" step="0.1" value={r.minUnits} onChange={(e) => setRules((prev) => prev.map((x) => x.id === r.id ? { ...x, minUnits: Number(e.target.value) } : x))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
              </label>
              <label className="text-xs">Priorität
                <input type="number" step="1" value={r.priority} onChange={(e) => setRules((prev) => prev.map((x) => x.id === r.id ? { ...x, priority: Number(e.target.value) } : x))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
              </label>
              <div className="flex gap-2">
                <button onClick={() => saveRule(r)} className="px-2 py-1 rounded bg-teal-600 text-white text-xs"><Save size={12} /></button>
                <button onClick={() => deleteRule(r.id)} className="px-2 py-1 rounded bg-rose-600 text-white text-xs"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3">
          <h3 className="text-sm font-medium mb-2">Neue Regel</h3>
          <div className="grid md:grid-cols-7 gap-2 items-end">
            <label className="text-xs">Service
              <select value={newRule.serviceId} onChange={(e) => setNewRule((p) => ({ ...p, serviceId: e.target.value }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent">
                {services.map((s) => <option key={s.id} value={s.id}>{s.nameDe}</option>)}
              </select>
            </label>
            <label className="text-xs">Region
              <select value={newRule.regionId} onChange={(e) => setNewRule((p) => ({ ...p, regionId: e.target.value }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent">
                {areas.map((a) => <option key={a.id} value={a.id}>{a.regionName}</option>)}
              </select>
            </label>
            <label className="text-xs">Typ
              <select value={newRule.unitType} onChange={(e) => setNewRule((p) => ({ ...p, unitType: e.target.value as PriceRule["unitType"] }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent">
                <option value="km">km</option>
                <option value="hourly">hourly</option>
                <option value="m2">m2</option>
                <option value="m3">m3</option>
                <option value="flat">flat</option>
              </select>
            </label>
            <label className="text-xs">Basis
              <input type="number" step="0.01" value={newRule.baseFee} onChange={(e) => setNewRule((p) => ({ ...p, baseFee: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
            </label>
            <label className="text-xs">Preis
              <input type="number" step="0.01" value={newRule.unitPrice} onChange={(e) => setNewRule((p) => ({ ...p, unitPrice: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
            </label>
            <label className="text-xs">Min
              <input type="number" step="0.1" value={newRule.minUnits} onChange={(e) => setNewRule((p) => ({ ...p, minUnits: Number(e.target.value) }))} className="mt-1 w-full rounded border px-2 py-1 bg-transparent" />
            </label>
            <button onClick={createRule} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-navy-700 text-white text-sm"><Plus size={14} /> Regel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
