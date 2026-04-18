"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calculator, Download, Loader2, Plus, Receipt, Trash2, Upload, Wallet } from "lucide-react";
import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_DOCUMENT_TYPE_OPTIONS,
  EXPENSE_PAYMENT_METHOD_OPTIONS,
  EXPENSE_PAYMENT_STATUS_OPTIONS,
  getExpenseCategoryLabel,
  getExpenseDocumentTypeLabel,
  getExpensePaymentStatusLabel,
  getQuarterKey,
} from "@/lib/accounting-expenses";

type Report = {
  totalRevenue: number;
  totalVat: number;
  totalInputVat: number;
  totalExpenses: number;
  profit: number;
  quarterly: Array<{
    quarter: string;
    revenue: number;
    vat: number;
    inputVat: number;
    expenses: number;
    vatPayable: number;
  }>;
};

type Expense = {
  id: string;
  category: string;
  documentType: string;
  description: string;
  supplierName: string | null;
  documentNumber: string | null;
  accountCode: string | null;
  amount: number;
  netAmount: number;
  taxAmount: number;
  taxRate: number;
  date: string;
  serviceDate: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  attachmentUrl: string | null;
  notes: string | null;
};

type FormState = {
  category: string;
  documentType: string;
  description: string;
  supplierName: string;
  documentNumber: string;
  accountCode: string;
  amount: string;
  netAmount: string;
  taxAmount: string;
  taxRate: string;
  date: string;
  serviceDate: string;
  paymentMethod: string;
  paymentStatus: string;
  notes: string;
};

const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function quarterStart() {
  const now = new Date();
  const startMonth = Math.floor(now.getMonth() / 3) * 3;
  return new Date(now.getFullYear(), startMonth, 1).toISOString().slice(0, 10);
}

function quarterEnd() {
  const now = new Date();
  const endMonth = Math.floor(now.getMonth() / 3) * 3 + 3;
  return new Date(now.getFullYear(), endMonth, 0).toISOString().slice(0, 10);
}

function emptyForm(): FormState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    category: "fuel",
    documentType: "RECHNUNG",
    description: "",
    supplierName: "",
    documentNumber: "",
    accountCode: "",
    amount: "",
    netAmount: "",
    taxAmount: "",
    taxRate: "19",
    date: today,
    serviceDate: today,
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    notes: "",
  };
}

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function BuchhaltungPage() {
  const [from, setFrom] = useState(quarterStart);
  const [to, setTo] = useState(quarterEnd);
  const [report, setReport] = useState<Report | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [reportRes, expensesRes] = await Promise.all([
        fetch(`/api/admin/buchhaltung/bericht?from=${from}&to=${to}`, { cache: "no-store" }),
        fetch("/api/admin/buchhaltung/ausgabe", { cache: "no-store" }),
      ]);
      setReport(await reportRes.json());
      setExpenses(await expensesRes.json());
    } catch {
      setNotice({ type: "err", text: "Buchhaltungsdaten konnten nicht geladen werden." });
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleExpenses = useMemo(() => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date >= fromDate && date <= toDate;
    });
  }, [expenses, from, to]);

  async function createExpense() {
    if (!form.description.trim() || Number(form.amount || 0) <= 0) {
      setNotice({ type: "err", text: "Beschreibung und Bruttobetrag sind erforderlich." });
      return;
    }

    setSaving(true);
    try {
      const body = new FormData();
      Object.entries({
        category: form.category,
        documentType: form.documentType,
        description: form.description,
        supplierName: form.supplierName,
        documentNumber: form.documentNumber,
        accountCode: form.accountCode,
        amount: form.amount,
        netAmount: form.netAmount,
        taxAmount: form.taxAmount,
        taxRate: form.taxRate,
        date: form.date,
        serviceDate: form.serviceDate,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentStatus,
        notes: form.notes,
      }).forEach(([key, value]) => {
        if (value) body.append(key, value);
      });
      if (selectedFile) body.append("file", selectedFile);

      const res = await fetch("/api/admin/buchhaltung/ausgabe", { method: "POST", body });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Beleg konnte nicht gespeichert werden.");
      setForm(emptyForm());
      setSelectedFile(null);
      setNotice({ type: "ok", text: "Beleg wurde gespeichert." });
      await load();
    } catch (error) {
      setNotice({ type: "err", text: error instanceof Error ? error.message : "Beleg konnte nicht gespeichert werden." });
    } finally {
      setSaving(false);
    }
  }

  async function removeExpense(id: string) {
    if (!window.confirm("Diesen Beleg wirklich löschen?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/buchhaltung/ausgabe/${id}`, { method: "DELETE" });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Beleg konnte nicht gelöscht werden.");
      await load();
    } catch (error) {
      setNotice({ type: "err", text: error instanceof Error ? error.message : "Beleg konnte nicht gelöscht werden." });
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    const header = [
      "Quartal", "Buchungsdatum", "Leistungsdatum", "Belegart", "Belegnummer", "Lieferant", "Kategorie", "Konto",
      "Beschreibung", "Netto", "MwSt", "Brutto", "Status", "Datei", "Notiz",
    ];
    const lines = visibleExpenses.map((expense) =>
      [
        getQuarterKey(expense.date),
        expense.date,
        expense.serviceDate || "",
        getExpenseDocumentTypeLabel(expense.documentType),
        expense.documentNumber || "",
        expense.supplierName || "",
        getExpenseCategoryLabel(expense.category),
        expense.accountCode || "",
        expense.description,
        expense.netAmount.toFixed(2),
        expense.taxAmount.toFixed(2),
        expense.amount.toFixed(2),
        getExpensePaymentStatusLabel(expense.paymentStatus),
        expense.attachmentUrl ? `https://seeltransport.de${expense.attachmentUrl}` : "",
        expense.notes || "",
      ].map(csvEscape).join(";"),
    );

    const blob = new Blob([[header.join(";"), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seel-finanzamt-${from}-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${
          notice.type === "ok"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        }`}>
          {notice.text}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Buchhaltung</h1>
        <p className="mt-1 text-sm text-silver-500 dark:text-silver-400">Betriebsausgaben mit Belegarchiv und quartalsweiser Export für Buchhaltung und Finanzamt.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-silver-500">Umsatz</p><p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{EUR.format(report?.totalRevenue ?? 0)}</p></div>
        <div className="glass-card rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-silver-500">Ausgaben</p><p className="mt-2 text-3xl font-bold text-rose-600 dark:text-rose-400">{EUR.format(report?.totalExpenses ?? 0)}</p></div>
        <div className="glass-card rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-silver-500">Vorsteuer</p><p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">{EUR.format(report?.totalInputVat ?? 0)}</p></div>
        <div className="glass-card rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-silver-500">Zahllast</p><p className="mt-2 text-3xl font-bold text-navy-800 dark:text-white">{EUR.format((report?.totalVat ?? 0) - (report?.totalInputVat ?? 0))}</p></div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
          <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Von</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" /></label>
          <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Bis</span><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" /></label>
          <button onClick={load} className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600">Neu laden</button>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-navy-800 hover:bg-gray-50 dark:border-navy-700 dark:text-white dark:hover:bg-navy-800"><Download size={15} />CSV Export</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white"><Upload size={18} /></div>
            <div>
              <h2 className="text-lg font-bold text-navy-800 dark:text-white">Beleg erfassen</h2>
              <p className="text-xs text-silver-500 dark:text-silver-400">Für Tankbelege, Einkäufe, Verträge und laufende Betriebskosten.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Kategorie</span><select value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white">{EXPENSE_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Belegart</span><select value={form.documentType} onChange={(e) => setForm((v) => ({ ...v, documentType: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white">{EXPENSE_DOCUMENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
            <label className="md:col-span-2"><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Beschreibung</span><input value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="z.B. Diesel Fahrzeug 1" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Lieferant</span><input value={form.supplierName} onChange={(e) => setForm((v) => ({ ...v, supplierName: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="ARAL, OBI, Amazon..." /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Belegnummer</span><input value={form.documentNumber} onChange={(e) => setForm((v) => ({ ...v, documentNumber: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="Bon / Rechnung" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Konto</span><input value={form.accountCode} onChange={(e) => setForm((v) => ({ ...v, accountCode: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="SKR03 / SKR04" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Status</span><select value={form.paymentStatus} onChange={(e) => setForm((v) => ({ ...v, paymentStatus: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white">{EXPENSE_PAYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Buchungsdatum</span><input type="date" value={form.date} onChange={(e) => setForm((v) => ({ ...v, date: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Leistungsdatum</span><input type="date" value={form.serviceDate} onChange={(e) => setForm((v) => ({ ...v, serviceDate: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Zahlungsart</span><select value={form.paymentMethod} onChange={(e) => setForm((v) => ({ ...v, paymentMethod: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white">{EXPENSE_PAYMENT_METHOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Brutto</span><input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm((v) => ({ ...v, amount: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="119.00" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Netto</span><input type="number" step="0.01" min="0" value={form.netAmount} onChange={(e) => setForm((v) => ({ ...v, netAmount: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="100.00" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">MwSt</span><input type="number" step="0.01" min="0" value={form.taxAmount} onChange={(e) => setForm((v) => ({ ...v, taxAmount: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="19.00" /></label>
            <label><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Steuersatz %</span><input type="number" step="0.01" min="0" value={form.taxRate} onChange={(e) => setForm((v) => ({ ...v, taxRate: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-2.5 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="19" /></label>
            <label className="md:col-span-2"><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Notiz</span><textarea rows={3} value={form.notes} onChange={(e) => setForm((v) => ({ ...v, notes: e.target.value }))} className="w-full rounded-xl border border-navy-700/30 bg-navy-800/40 px-4 py-3 text-sm text-navy-800 dark:bg-navy-800/60 dark:text-white" placeholder="Optionaler Hinweis für Steuerberater oder Buchhaltung" /></label>
            <label className="md:col-span-2"><span className="mb-1.5 block text-xs uppercase tracking-wider text-silver-500">Datei</span><input type="file" accept=".pdf,image/png,image/jpeg,image/webp" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="block w-full rounded-xl border border-dashed border-navy-700/30 bg-navy-800/30 px-4 py-3 text-sm text-navy-800 dark:bg-navy-800/50 dark:text-white" /></label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-sm text-silver-500 dark:text-silver-400">{selectedFile ? `Anhang: ${selectedFile.name}` : "PDF oder Scan kann direkt mitgespeichert werden."}</div>
            <button onClick={createExpense} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Beleg speichern
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-3"><Receipt size={18} className="text-teal-500" /><h2 className="text-lg font-bold text-navy-800 dark:text-white">Quartalsübersicht</h2></div>
            <div className="space-y-3 text-sm">
              {(report?.quarterly ?? []).map((row) => (
                <div key={row.quarter} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between"><span className="font-semibold text-navy-800 dark:text-white">{row.quarter}</span><span className="text-silver-500 dark:text-silver-400">{EUR.format(row.vatPayable)}</span></div>
                  <div className="mt-2 grid gap-2 text-xs text-silver-500 dark:text-silver-400">
                    <div className="flex justify-between"><span>USt Erlöse</span><span>{EUR.format(row.vat)}</span></div>
                    <div className="flex justify-between"><span>Vorsteuer</span><span>{EUR.format(row.inputVat)}</span></div>
                    <div className="flex justify-between"><span>Ausgaben</span><span>{EUR.format(row.expenses)}</span></div>
                  </div>
                </div>
              ))}
              {(report?.quarterly ?? []).length === 0 && <p className="text-silver-500 dark:text-silver-400">Noch keine Quartalswerte vorhanden.</p>}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-3"><Calculator size={18} className="text-sky-500" /><h2 className="text-lg font-bold text-navy-800 dark:text-white">Für Finanzamt & Steuerberater</h2></div>
            <ul className="space-y-2 text-sm text-silver-500 dark:text-silver-300">
              <li>Belege werden mit Betrag, Steuer und Lieferant sauber archiviert.</li>
              <li>Der CSV Export enthält alle Pflichtdaten pro Beleg.</li>
              <li>PDF/JPG/PNG können direkt am Datensatz hängen bleiben.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-strong overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-6 dark:border-navy-700/50">
          <div>
            <h2 className="text-lg font-bold text-navy-800 dark:text-white">Belegarchiv</h2>
            <p className="mt-1 text-xs text-silver-500 dark:text-silver-400">{visibleExpenses.length} Belege im gewählten Zeitraum</p>
          </div>
          {loading && <Loader2 size={16} className="animate-spin text-silver-500" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">Beleg</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">Lieferant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">Kategorie</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">Netto</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">MwSt</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">Brutto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-silver-500 dark:text-silver-400">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {visibleExpenses.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-sm text-silver-500">Noch keine Belege im gewählten Zeitraum gespeichert.</td></tr>
              )}
              {visibleExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-50 dark:border-navy-800/30">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400">{getExpenseDocumentTypeLabel(expense.documentType)}</div>
                      <p className="text-sm font-semibold text-navy-800 dark:text-white">{expense.description}</p>
                      <p className="text-xs text-silver-500 dark:text-silver-400">{expense.documentNumber || "Ohne Nummer"} · {getQuarterKey(expense.date)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-800 dark:text-white">{expense.supplierName || "—"}</td>
                  <td className="px-6 py-4 text-sm text-silver-600 dark:text-silver-300">{getExpenseCategoryLabel(expense.category)}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-navy-800 dark:text-white">{EUR.format(expense.netAmount)}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-sky-600 dark:text-sky-400">{EUR.format(expense.taxAmount)}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-rose-600 dark:text-rose-400">{EUR.format(expense.amount)}</td>
                  <td className="px-6 py-4 text-sm text-silver-600 dark:text-silver-300">{getExpensePaymentStatusLabel(expense.paymentStatus)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {expense.attachmentUrl && <a href={expense.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-navy-800 hover:bg-gray-50 dark:border-navy-700 dark:text-white dark:hover:bg-navy-800"><Receipt size={13} />Beleg</a>}
                      <button onClick={() => removeExpense(expense.id)} disabled={deletingId === expense.id} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10">
                        {deletingId === expense.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
