"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, AlertCircle, CheckCircle2, Loader2, X, Download, Send, Eye,
  Euro, FileText, Clock, Search, Filter, ChevronDown, RefreshCw,
  CreditCard, Receipt, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  totalAmount: number;
  paidAt: string | null;
  dueDate: string;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    customer: { id: string; name: string; email: string; phone?: string };
    service?: { nameDe: string };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  totalPrice: number;
  customer: { name: string };
  service: { nameDe: string };
}

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function RechnungenPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALLE" | "OFFEN" | "BEZAHLT">("ALLE");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [creating, setCreating] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/rechnungen");
      if (!res.ok) throw new Error();
      const data: Invoice[] = await res.json();
      setInvoices(data);
    } catch {
      setError("Rechnungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  async function markAsPaid(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/rechnungen/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paidAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error();
      const updated: Invoice = await res.json();
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
      showToast("Rechnung als bezahlt markiert.");
    } catch {
      showToast("Rechnung konnte nicht aktualisiert werden.", "err");
    } finally {
      setActionLoading(null);
    }
  }

  async function openCreateModal() {
    setShowModal(true);
    try {
      const res = await fetch("/api/admin/buchungen");
      if (!res.ok) throw new Error();
      const data: Order[] = await res.json();
      const invoicedOrderIds = new Set(invoices.map((inv) => inv.orderId));
      setOrders(data.filter((o) => !invoicedOrderIds.has(o.id)));
    } catch {
      showToast("Buchungen konnten nicht geladen werden.", "err");
      setShowModal(false);
    }
  }

  async function createInvoice() {
    if (!selectedOrderId) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/rechnungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrderId }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || "Rechnung konnte nicht erstellt werden.", "err");
        return;
      }
      setShowModal(false);
      setSelectedOrderId("");
      await fetchInvoices();
      showToast("Rechnung erfolgreich erstellt.");
    } catch {
      showToast("Rechnung konnte nicht erstellt werden.", "err");
    } finally {
      setCreating(false);
    }
  }

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(q)
      || inv.order.customer.name.toLowerCase().includes(q)
      || inv.order.orderNumber.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALLE"
      || (statusFilter === "BEZAHLT" && !!inv.paidAt)
      || (statusFilter === "OFFEN" && !inv.paidAt);
    return matchSearch && matchStatus;
  });

  const selected = invoices.find((i) => i.id === selectedId) ?? null;

  const openAmount = invoices.filter((i) => !i.paidAt).reduce((sum, i) => sum + i.totalAmount, 0);
  const paidAmount = invoices.filter((i) => i.paidAt).reduce((sum, i) => sum + i.totalAmount, 0);
  const totalTax = invoices.reduce((sum, i) => sum + i.tax, 0);
  const openCount = invoices.filter((i) => !i.paidAt).length;
  const paidCount = invoices.filter((i) => i.paidAt).length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-navy-700 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-navy-700 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-navy-700 rounded-2xl" />
      </div>
    );
  }

  if (error && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button onClick={() => { setError(""); fetchInvoices(); }} className="mt-4 px-5 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-3",
          toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        )}>
          {toast.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={16} /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-3">
            <Receipt size={28} className="text-teal-500" />
            Rechnungsverwaltung
          </h1>
          <p className="text-silver-500 text-sm mt-1">{invoices.length} Rechnungen insgesamt</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchInvoices} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2">
            <RefreshCw size={16} /> Aktualisieren
          </button>
          <button onClick={openCreateModal}
            className="px-4 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 flex items-center gap-2 shadow-lg shadow-teal-500/20">
            <Plus size={18} /> Rechnung erstellen
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase">Ausstehend</span>
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{fmt.format(openAmount)}</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/60 mt-1">{openCount} Rechnung{openCount !== 1 ? "en" : ""}</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase">Bezahlt</span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{fmt.format(paidAmount)}</p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/60 mt-1">{paidCount} Rechnung{paidCount !== 1 ? "en" : ""}</p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Euro size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase">MwSt. gesamt</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{fmt.format(totalTax)}</p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/60 mt-1">19% MwSt.</p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase">Umsatz</span>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{fmt.format(openAmount + paidAmount)}</p>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/60 mt-1">{invoices.length} Rechnungen</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche nach Rechnungsnr., Kunde oder Buchungsnr..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "ALLE" | "OFFEN" | "BEZAHLT")}
            className="pl-11 pr-10 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm appearance-none">
            <option value="ALLE">Alle Status</option>
            <option value="OFFEN">Ausstehend</option>
            <option value="BEZAHLT">Bezahlt</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Invoices List */}
        <div className={cn("space-y-2", selected ? "lg:col-span-2" : "lg:col-span-5")}>
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-12 text-center">
              <FileText size={48} className="text-silver-300 dark:text-navy-600 mx-auto mb-4" />
              <p className="text-silver-500">Keine Rechnungen gefunden.</p>
            </div>
          ) : (
            filtered.map((invoice) => {
              const isPaid = !!invoice.paidAt;
              const isSelected = selectedId === invoice.id;
              const isOverdue = !isPaid && new Date(invoice.dueDate) < new Date();
              return (
                <button
                  key={invoice.id}
                  onClick={() => setSelectedId(isSelected ? null : invoice.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all hover:shadow-md",
                    isSelected
                      ? "bg-teal-50 dark:bg-teal-500/10 border-teal-300 dark:border-teal-500/30 shadow-md"
                      : "bg-white dark:bg-navy-800/60 border-gray-100 dark:border-navy-700/50 hover:border-teal-200 dark:hover:border-teal-500/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        isPaid ? "bg-emerald-50 dark:bg-emerald-500/10" : isOverdue ? "bg-red-50 dark:bg-red-500/10" : "bg-amber-50 dark:bg-amber-500/10"
                      )}>
                        {isPaid ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                          : isOverdue ? <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                          : <Clock size={18} className="text-amber-600 dark:text-amber-400" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-teal-600 dark:text-teal-400 text-sm font-semibold">{invoice.invoiceNumber}</p>
                        <p className="text-sm font-medium text-navy-800 dark:text-white truncate">{invoice.order.customer.name}</p>
                        <p className="text-xs text-silver-500">{invoice.order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-navy-800 dark:text-white">{fmt.format(invoice.totalAmount)}</p>
                      <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1",
                        isPaid ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : isOverdue ? "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400"
                          : "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      )}>
                        {isPaid ? "Bezahlt" : isOverdue ? "Überfällig" : "Ausstehend"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="lg:col-span-3 space-y-4">
            {/* Detail Header */}
            <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-navy-800 dark:text-white">{selected.invoiceNumber}</h2>
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                      selected.paidAt
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                    )}>
                      {selected.paidAt ? <><CheckCircle2 size={13} /> Bezahlt</> : <><Clock size={13} /> Ausstehend</>}
                    </span>
                  </div>
                  <p className="text-sm text-silver-500">Buchung: {selected.order.orderNumber}</p>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700">
                  <X size={18} className="text-silver-400" />
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 dark:bg-navy-900/40 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-silver-600 dark:text-silver-400">Netto</span>
                  <span className="text-sm font-medium">{fmt.format(selected.amount)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-silver-600 dark:text-silver-400">MwSt. (19%)</span>
                  <span className="text-sm font-medium">{fmt.format(selected.tax)}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-navy-700">
                  <span className="text-base font-bold text-navy-800 dark:text-white">Gesamt</span>
                  <span className="text-lg font-bold text-teal-600">{fmt.format(selected.totalAmount)}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-silver-500">Erstellt am</p>
                    <p className="text-sm font-medium">{new Date(selected.createdAt).toLocaleDateString("de-DE")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center",
                    !selected.paidAt && new Date(selected.dueDate) < new Date()
                      ? "bg-red-50 dark:bg-red-500/10" : "bg-amber-50 dark:bg-amber-500/10"
                  )}>
                    <Clock size={16} className={
                      !selected.paidAt && new Date(selected.dueDate) < new Date()
                        ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                    } />
                  </div>
                  <div>
                    <p className="text-xs text-silver-500">Fällig am</p>
                    <p className={cn("text-sm font-medium",
                      !selected.paidAt && new Date(selected.dueDate) < new Date() && "text-red-600 dark:text-red-400"
                    )}>
                      {new Date(selected.dueDate).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>
              </div>

              {selected.paidAt && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Bezahlt am {new Date(selected.paidAt).toLocaleDateString("de-DE")}
                  </p>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-6">
              <h3 className="text-sm font-semibold text-navy-800 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-teal-500" /> Kundendaten
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-silver-500">Name</p>
                  <p className="text-sm font-medium text-navy-800 dark:text-white">{selected.order.customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-silver-500">E-Mail</p>
                  <a href={`mailto:${selected.order.customer.email}`} className="text-sm text-teal-600 hover:underline">{selected.order.customer.email}</a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-6">
              <h3 className="text-sm font-semibold text-navy-800 dark:text-white mb-4 flex items-center gap-2">
                <Receipt size={16} className="text-teal-500" /> Aktionen
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {!selected.paidAt && (
                  <button onClick={() => markAsPaid(selected.id)} disabled={actionLoading === selected.id}
                    className="col-span-2 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    {actionLoading === selected.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Als bezahlt markieren
                  </button>
                )}
                <a href={`/api/rechnung/${selected.id}/pdf`} target="_blank" rel="noopener noreferrer"
                  className="py-3 border border-gray-200 dark:border-navy-700 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center justify-center gap-2">
                  <Eye size={16} /> PDF ansehen
                </a>
                <a href={`/api/rechnung/${selected.id}/pdf`} download
                  className="py-3 border border-gray-200 dark:border-navy-700 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center justify-center gap-2">
                  <Download size={16} /> Herunterladen
                </a>
                <a href={`mailto:${selected.order.customer.email}`}
                  className="col-span-2 py-3 border border-gray-200 dark:border-navy-700 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center justify-center gap-2">
                  <Send size={16} /> Rechnung per E-Mail senden
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-navy-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-800 dark:text-white flex items-center gap-2">
                <Plus size={20} className="text-teal-500" /> Rechnung erstellen
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700">
                <X size={18} className="text-silver-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-white mb-2">Buchung auswählen</label>
                <div className="relative">
                  <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm appearance-none pr-10 focus:border-teal-500 outline-none">
                    <option value="">Bitte wählen...</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.orderNumber} – {order.customer.name} ({fmt.format(order.totalPrice)})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 pointer-events-none" />
                </div>
                {orders.length === 0 && (
                  <p className="text-xs text-silver-500 mt-2">Alle Buchungen haben bereits eine Rechnung.</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 dark:border-navy-700 text-navy-700 dark:text-silver-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-700">
                  Abbrechen
                </button>
                <button onClick={createInvoice} disabled={!selectedOrderId || creating}
                  className="flex-1 py-3 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20">
                  {creating && <Loader2 size={16} className="animate-spin" />}
                  Erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
