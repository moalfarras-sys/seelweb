"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Euro,
  TrendingDown,
  TrendingUp,
  FileText,
  Filter,
  Plus,
  CheckCircle2,
  Download,
  Calculator,
  Receipt,
  Wallet,
  ClipboardList,
} from "lucide-react";

type Tab = "uebersicht" | "rechnungen" | "ausgaben" | "steuerbericht";

interface MonthlyRow {
  month: string;
  revenue: number;
  expenses: number;
  orders: number;
}

interface BerichtData {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  totalOrders: number;
  monthly: MonthlyRow[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  totalAmount: number;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  order: {
    id: string;
    customer: { name: string };
  };
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

const EUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const fmtDate = (v: string) =>
  new Date(v).toLocaleDateString("de-DE");

const CATEGORIES = [
  "Fahrzeug",
  "Personal",
  "Material",
  "Buero",
  "Sonstiges",
] as const;

const TABS: { key: Tab; label: string; icon: typeof Calculator }[] = [
  { key: "uebersicht", label: "Übersicht", icon: ClipboardList },
  { key: "rechnungen", label: "Rechnungen", icon: Receipt },
  { key: "ausgaben", label: "Ausgaben", icon: Wallet },
  { key: "steuerbericht", label: "Steuerbericht", icon: Calculator },
];

function startOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function endOfMonth() {
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}-${String(last.getDate()).padStart(2, "0")}`;
};

function Skeleton({ rows = 4 } : { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-lg bg-navy-800/40 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function BuchhaltungPage() {
  const [tab, setTab] = useState<Tab>("uebersicht");
  const [from, setFrom] = useState(startOfMonth);
  const [to, setTo] = useState(endOfMonth);

  const [bericht, setBericht] = useState<BerichtData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const [expForm, setExpForm] = useState({
    category: "Fahrzeug",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, iRes, eRes] = await Promise.all([
        fetch(`/api/admin/buchhaltung/bericht?from=${from}&to=${to}`),
        fetch("/api/admin/rechnungen"),
        fetch("/api/admin/buchhaltung/ausgabe"),
      ]);
      const [bData, iData, eData] = await Promise.all([
        bRes.json(),
        iRes.json(),
        eRes.json(),
      ]);
      setBericht(bData);
      setInvoices(Array.isArray(iData) ? iData : []);
      setExpenses(Array.isArray(eData) ? eData : []);
    } catch {
      /* silently handle network errors */
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const markPaid = async (id: string) => {
    setMarkingId(id);
    try {
      await fetch(`/api/admin/rechnungen/${id}`, { method: "PATCH" });
      await fetchAll();
    } finally {
      setMarkingId(null);
    }
  };

  const addExpense = async () => {
    if (!expForm.description || !expForm.amount) return;
    setSubmitting(true);
    try {
      await fetch("/api/admin/buchhaltung/ausgabe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...expForm,
          amount: parseFloat(expForm.amount),
        }),
      });
      setExpForm({
        category: "Fahrzeug",
        description: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
      });
      await fetchAll();
    } finally {
      setSubmitting(false);
    }
  };

  const outstandingCount = invoices.filter((i) => !i.paidAt).length;
  const totalRevenue = bericht?.totalRevenue ?? 0;
  const totalExpenses = bericht?.totalExpenses ?? 0;
  const profit = bericht?.profit ?? 0;

  const summaryCards = [
    {
      label: "Gesamtumsatz",
      value: EUR.format(totalRevenue),
      icon: Euro,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Ausgaben",
      value: EUR.format(totalExpenses),
      icon: TrendingDown,
      gradient: "from-rose-500 to-rose-600",
    },
    {
      label: "Gewinn",
      value: EUR.format(profit),
      icon: TrendingUp,
      gradient: "from-teal-500 to-teal-600",
    },
    {
      label: "Offene Rechnungen",
      value: String(outstandingCount),
      icon: FileText,
      gradient: "from-amber-500 to-amber-600",
    },
  ];

  /* ── Tax Report (quarterly) ── */
  const quarterlyData = () => {
    const quarters: Record<
      string,
      { revenue: number; expenses: number }
    > = {};

    for (const inv of invoices) {
      if (!inv.paidAt) continue;
      const d = new Date(inv.paidAt);
      const q = `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
      if (!quarters[q]) quarters[q] = { revenue: 0, expenses: 0 };
      quarters[q].revenue += inv.amount;
    }

    for (const exp of expenses) {
      const d = new Date(exp.date);
      const q = `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
      if (!quarters[q]) quarters[q] = { revenue: 0, expenses: 0 };
      quarters[q].expenses += exp.amount;
    }

    return Object.entries(quarters)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([quartal, d]) => {
        const mwst = d.revenue * 0.19;
        const vorsteuer = d.expenses * 0.19;
        return {
          quartal,
          umsatz: d.revenue,
          mwst,
          vorsteuer,
          zahllast: mwst - vorsteuer,
        };
      });
  };

  const exportCSV = () => {
    const rows = quarterlyData();
    const header = "Quartal;Umsatz;MwSt Einnahmen;Vorsteuer;Zahllast";
    const lines = rows.map(
      (r) =>
        `${r.quartal};${r.umsatz.toFixed(2)};${r.mwst.toFixed(2)};${r.vorsteuer.toFixed(2)};${r.zahllast.toFixed(2)}`,
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `steuerbericht_${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const monthLabel = (key: string) => {
    const [y, m] = key.split("-");
    const d = new Date(Number(y), Number(m) - 1);
    return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  };

  const thClass =
    "text-left text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4";
  const thClassRight =
    "text-right text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4";
  const tdClass = "px-6 py-4 text-sm text-silver-600 dark:text-silver-300";
  const tdBold =
    "px-6 py-4 text-sm font-bold text-navy-800 dark:text-white text-right";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-800 dark:text-white">
          Buchhaltung
        </h1>
        <p className="text-silver-500 dark:text-silver-400 text-sm mt-1">
          Finanzen, Rechnungen und Steuerberichte
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                >
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-navy-800 dark:text-white tracking-tight">
                {loading ? "…" : card.value}
              </p>
              <p className="text-xs text-silver-500 dark:text-silver-400 mt-1.5 font-medium">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Date Range Filter */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 min-w-0">
            <label className="text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider mb-1.5 block">
              Von
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-800/40 dark:bg-navy-800/60 border border-navy-700/30 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider mb-1.5 block">
              Bis
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-800/40 dark:bg-navy-800/60 border border-navy-700/30 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 text-sm font-medium transition-colors shrink-0"
          >
            <Filter size={16} />
            Filtern
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-navy-800/20 dark:bg-navy-800/40 w-fit">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? "bg-teal-500 text-white shadow-sm" : "text-silver-500 dark:text-silver-400 hover:text-navy-800 dark:hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="glass-strong rounded-2xl p-6">
          <Skeleton rows={6} />
        </div>
      ) : (
        <>
          {/* ──────── UEBERSICHT ──────── */}
          {tab === "uebersicht" && (
            <div className="glass-strong rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10 dark:border-navy-700/50">
                <h2 className="text-lg font-bold text-navy-800 dark:text-white">
                  Monatliche Übersicht
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-navy-700/50">
                      <th className={thClass}>Monat</th>
                      <th className={thClassRight}>Umsatz</th>
                      <th className={thClassRight}>Ausgaben</th>
                      <th className={thClassRight}>Gewinn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bericht?.monthly ?? []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-silver-500">
                          Keine Daten für den gewählten Zeitraum.
                        </td>
                      </tr>
                    )}
                    {(bericht?.monthly ?? []).map((row, i) => (
                      <tr
                        key={row.month}
                        className={`border-b border-gray-50 dark:border-navy-800/30 ${i % 2 === 1 ? "bg-black/[0.02] dark:bg-white/[0.02]" : ""}`}
                      >
                        <td className={`${tdClass} font-medium text-navy-800 dark:text-white`}>
                          {monthLabel(row.month)}
                        </td>
                        <td className={tdBold}>
                          {EUR.format(row.revenue)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-rose-600 dark:text-rose-400 text-right">
                          {EUR.format(row.expenses)}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm font-bold text-right ${
                            row.revenue - row.expenses >= 0
                              ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {EUR.format(row.revenue - row.expenses)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ──────── RECHNUNGEN ──────── */}
          {tab === "rechnungen" && (
            <div className="glass-strong rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10 dark:border-navy-700/50">
                <h2 className="text-lg font-bold text-navy-800 dark:text-white">
                  Rechnungen
                </h2>
                <p className="text-xs text-silver-500 dark:text-silver-400 mt-1">
                  {invoices.length} Rechnungen &middot; {outstandingCount} offen
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-navy-700/50">
                      <th className={thClass}>Rechnungsnr.</th>
                      <th className={thClass}>Kunde</th>
                      <th className={thClassRight}>Betrag</th>
                      <th className={thClassRight}>MwSt</th>
                      <th className={thClass}>Fällig</th>
                      <th className={thClass}>Status</th>
                      <th className={thClassRight}>Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv, i) => {
                      const paid = !!inv.paidAt;
                      return (
                        <tr
                          key={inv.id}
                          className={`border-b border-gray-50 dark:border-navy-800/30 ${i % 2 === 1 ? "bg-black/[0.02] dark:bg-white/[0.02]" : ""}`}
                        >
                          <td className="px-6 py-4 text-sm font-mono text-teal-600 dark:text-teal-400 font-semibold">
                            {inv.invoiceNumber}
                          </td>
                          <td className={`${tdClass} font-medium text-navy-800 dark:text-white`}>
                            {inv.order.customer.name || "–"}
                          </td>
                          <td className={tdBold}>
                            {EUR.format(inv.totalAmount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-silver-600 dark:text-silver-300 text-right">
                            {EUR.format(inv.tax)}
                          </td>
                          <td className={tdClass}>
                            {fmtDate(inv.dueDate)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                paid
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {paid ? "Bezahlt" : "Offen"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {!paid && (
                              <button
                                onClick={() => markPaid(inv.id)}
                                disabled={markingId === inv.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 size={14} />
                                {markingId === inv.id ? "…" : "Als bezahlt markieren"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ──────── AUSGABEN ──────── */}
          {tab === "ausgaben" && (
            <div className="space-y-6">
              {/* New Expense Form */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-navy-800 dark:text-white mb-4">
                  Neue Ausgabe
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider mb-1.5 block">
                      Kategorie
                    </label>
                    <select
                      value={expForm.category}
                      onChange={(e) =>
                        setExpForm((p) => ({ ...p, category: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-800/40 dark:bg-navy-800/60 border border-navy-700/30 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider mb-1.5 block">
                      Beschreibung
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. Tankfüllung"
                      value={expForm.description}
                      onChange={(e) =>
                        setExpForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-800/40 dark:bg-navy-800/60 border border-navy-700/30 text-navy-800 dark:text-white text-sm placeholder:text-silver-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider mb-1.5 block">
                      Betrag (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={expForm.amount}
                      onChange={(e) =>
                        setExpForm((p) => ({ ...p, amount: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-800/40 dark:bg-navy-800/60 border border-navy-700/30 text-navy-800 dark:text-white text-sm placeholder:text-silver-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider mb-1.5 block">
                      Datum
                    </label>
                    <input
                      type="date"
                      value={expForm.date}
                      onChange={(e) =>
                        setExpForm((p) => ({ ...p, date: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-navy-800/40 dark:bg-navy-800/60 border border-navy-700/30 text-navy-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addExpense}
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 text-sm font-medium transition-colors disabled:opacity-50 w-full justify-center"
                    >
                      <Plus size={16} />
                      {submitting ? "Speichern…" : "Hinzufügen"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expenses Table */}
              <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 dark:border-navy-700/50">
                  <h2 className="text-lg font-bold text-navy-800 dark:text-white">
                    Ausgaben
                  </h2>
                  <p className="text-xs text-silver-500 dark:text-silver-400 mt-1">
                    {expenses.length} Einträge
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-navy-700/50">
                        <th className={thClass}>Kategorie</th>
                        <th className={thClass}>Beschreibung</th>
                        <th className={thClassRight}>Betrag</th>
                        <th className={thClass}>Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-10 text-center text-sm text-silver-500"
                          >
                            Noch keine Ausgaben erfasst.
                          </td>
                        </tr>
                      )}
                      {expenses.map((exp, i) => (
                        <tr
                          key={exp.id}
                          className={`border-b border-gray-50 dark:border-navy-800/30 ${i % 2 === 1 ? "bg-black/[0.02] dark:bg-white/[0.02]" : ""}`}
                        >
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400">
                              {exp.category}
                            </span>
                          </td>
                          <td className={`${tdClass} font-medium text-navy-800 dark:text-white`}>
                            {exp.description}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-rose-600 dark:text-rose-400 text-right">
                            {EUR.format(exp.amount)}
                          </td>
                          <td className={tdClass}>{fmtDate(exp.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ──────── STEUERBERICHT ──────── */}
          {tab === "steuerbericht" && (
            <div className="space-y-6">
              <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 dark:border-navy-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-navy-800 dark:text-white">
                      Umsatzsteuer-Voranmeldung
                    </h2>
                    <p className="text-xs text-silver-500 dark:text-silver-400 mt-1">
                      Quartalsweise Aufstellung für das Finanzamt
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportCSV}
                      className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 text-sm font-medium transition-colors"
                    >
                      <Download size={16} />
                      Als CSV exportieren
                    </button>
                    <button
                      onClick={exportCSV}
                      className="flex items-center gap-2 px-4 py-2.5 bg-navy-800/40 dark:bg-navy-700/40 text-navy-800 dark:text-white border border-navy-700/30 rounded-xl hover:bg-navy-700/50 text-sm font-medium transition-colors"
                    >
                      <Download size={16} />
                      Nochmal als CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-navy-700/50">
                        <th className={thClass}>Quartal</th>
                        <th className={thClassRight}>Umsatz (netto)</th>
                        <th className={thClassRight}>MwSt Einnahmen (19%)</th>
                        <th className={thClassRight}>Vorsteuer</th>
                        <th className={thClassRight}>Zahllast</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quarterlyData().length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-sm text-silver-500"
                          >
                            Keine Steuerdaten verfügbar.
                          </td>
                        </tr>
                      )}
                      {quarterlyData().map((row, i) => (
                        <tr
                          key={row.quartal}
                          className={`border-b border-gray-50 dark:border-navy-800/30 ${i % 2 === 1 ? "bg-black/[0.02] dark:bg-white/[0.02]" : ""}`}
                        >
                          <td className={`${tdClass} font-semibold text-navy-800 dark:text-white`}>
                            {row.quartal}
                          </td>
                          <td className={tdBold}>
                            {EUR.format(row.umsatz)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400 text-right">
                            {EUR.format(row.mwst)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-rose-600 dark:text-rose-400 text-right">
                            {EUR.format(row.vorsteuer)}
                          </td>
                          <td
                            className={`px-6 py-4 text-sm font-bold text-right ${
                              row.zahllast >= 0
                                ? "text-navy-800 dark:text-white" : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {EUR.format(row.zahllast)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
