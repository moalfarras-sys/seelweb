"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, Clock, CheckCircle2, Truck, AlertCircle, FileText,
  ChevronDown, Send, Loader2, Phone, Mail, MapPin,
  Calendar, CreditCard, ArrowRight, RefreshCw,
  ClipboardList, Package, Download, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  netto: number;
  mwst: number;
  scheduledAt: string | null;
  timeSlot: string | null;
  paymentMethod: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  fromAddress: Record<string, string> | null;
  toAddress: Record<string, string> | null;
  distanceKm: number | null;
  customer: { id: string; name: string; email: string; phone: string; company?: string };
  service: { nameDe: string; category: string };
  offers?: Array<{ id: string; offerNumber: string; token: string; status: string; totalPrice: number }>;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock; next?: string; nextLabel?: string }> = {
  ANFRAGE:         { label: "Anfrage",          color: "text-amber-700 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",     icon: Clock,        next: "ANGEBOT",        nextLabel: "Angebot senden" },
  ANGEBOT:         { label: "Angebot gesendet", color: "text-orange-700 dark:text-orange-400",   bg: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20", icon: FileText,     next: "BESTAETIGT",     nextLabel: "Bestätigen" },
  BESTAETIGT:      { label: "Bestätigt",        color: "text-blue-700 dark:text-blue-400",       bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",         icon: CheckCircle2, next: "IN_BEARBEITUNG", nextLabel: "Starten" },
  IN_BEARBEITUNG:  { label: "In Bearbeitung",   color: "text-purple-700 dark:text-purple-400",   bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20", icon: Truck,        next: "ABGESCHLOSSEN",  nextLabel: "Abschließen" },
  ABGESCHLOSSEN:   { label: "Abgeschlossen",    color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20", icon: CheckCircle2 },
  STORNIERT:       { label: "Storniert",        color: "text-red-700 dark:text-red-400",         bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",             icon: AlertCircle },
};

const statusFlow = ["ANFRAGE", "ANGEBOT", "BESTAETIGT", "IN_BEARBEITUNG", "ABGESCHLOSSEN"];
const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function ProgressDots({ current }: { current: string }) {
  const idx = statusFlow.indexOf(current);
  if (current === "STORNIERT") return <span className="text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">Storniert</span>;
  return (
    <div className="flex items-center gap-0.5">
      {statusFlow.map((_, i) => (
        <div key={i} className={cn("h-1.5 rounded-full transition-all", i <= idx ? "w-5 bg-teal-500" : "w-3 bg-gray-200 dark:bg-navy-700")} />
      ))}
    </div>
  );
}

export default function BuchungenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALLE");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/buchungen");
      if (!res.ok) throw new Error();
      setOrders(await res.json());
    } catch {
      setError("Buchungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(id: string, status: string) {
    setActionLoading(`status-${id}`);
    try {
      const res = await fetch(`/api/admin/buchungen/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error();
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      showToast(`Status → ${statusConfig[status]?.label || status}`);
    } catch { showToast("Status konnte nicht geändert werden.", "err"); }
    finally { setActionLoading(null); }
  }

  async function sendAngebot(id: string) {
    setActionLoading(`angebot-${id}`);
    try {
      const res = await fetch(`/api/admin/buchungen/${id}/angebot`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      if (!res.ok) throw new Error();
      await fetchOrders();
      showToast("Angebot erstellt & gesendet");
    } catch { showToast("Fehler beim Erstellen.", "err"); }
    finally { setActionLoading(null); }
  }

  async function approveOrder(id: string) {
    setActionLoading(`approve-${id}`);
    try {
      const res = await fetch(`/api/admin/buchungen/${id}/approve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      if (!res.ok) throw new Error();
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      showToast("Buchung bestätigt");
    } catch { showToast("Fehler.", "err"); }
    finally { setActionLoading(null); }
  }

  const filtered = orders.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = b.customer.name.toLowerCase().includes(q) || b.orderNumber.toLowerCase().includes(q) || b.customer.email.toLowerCase().includes(q);
    return (statusFilter === "ALLE" || b.status === statusFilter) && matchSearch;
  });

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-navy-700 rounded-lg" />
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-navy-700 rounded-2xl" />)}
    </div>
  );

  if (error && orders.length === 0) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <button onClick={() => { setError(""); fetchOrders(); }} className="mt-4 px-5 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600">Erneut versuchen</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {toast && (
        <div className={cn("fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2", toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
          {toast.type === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-2.5">
            <ClipboardList size={26} className="text-teal-500" /> Buchungen
          </h1>
          <p className="text-silver-500 text-sm mt-0.5">{orders.length} Buchungen</p>
        </div>
        <button onClick={fetchOrders} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-700 text-sm hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2">
          <RefreshCw size={15} /> Aktualisieren
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusConfig).map(([key, val]) => {
          const c = counts[key] || 0;
          if (c === 0 && statusFilter !== key) return null;
          return (
            <button key={key} onClick={() => setStatusFilter(statusFilter === key ? "ALLE" : key)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all", val.bg, val.color, statusFilter === key && "ring-2 ring-teal-500")}>
              <val.icon size={13} /> {c} {val.label}
            </button>
          );
        })}
        {statusFilter !== "ALLE" && (
          <button onClick={() => setStatusFilter("ALLE")} className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-navy-700 text-silver-500 hover:bg-gray-50 dark:hover:bg-navy-800">
            Alle anzeigen
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Suche..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 focus:border-teal-500 outline-none text-sm" />
      </div>

      {/* Orders - Each is a self-contained card */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-12 text-center">
          <Package size={48} className="text-silver-300 mx-auto mb-3" />
          <p className="text-silver-500">Keine Buchungen gefunden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const config = statusConfig[order.status] || statusConfig.ANFRAGE;
            const Icon = config.icon;
            const isExpanded = expanded === order.id;
            const isLoading = (key: string) => actionLoading === `${key}-${order.id}`;

            return (
              <div key={order.id} className={cn(
                "bg-white dark:bg-navy-800/60 rounded-2xl border overflow-hidden transition-all",
                isExpanded ? "border-teal-300 dark:border-teal-500/30 shadow-lg" : "border-gray-100 dark:border-navy-700/50 hover:border-gray-200 dark:hover:border-navy-700"
              )}>
                {/* Card Header - Always Visible */}
                <button onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border", config.bg)}>
                    <Icon size={20} className={config.color} />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-teal-600 dark:text-teal-400 text-sm font-bold">{order.orderNumber}</span>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", config.bg, config.color)}>{config.label}</span>
                    </div>
                    <p className="text-sm font-medium text-navy-800 dark:text-white">{order.customer.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-silver-500">{order.service.nameDe}</span>
                      <span className="text-xs text-silver-400">·</span>
                      <span className="text-xs text-silver-500">{new Date(order.scheduledAt || order.createdAt).toLocaleDateString("de-DE")}</span>
                    </div>
                  </div>

                  {/* Price + Progress */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-lg font-bold text-navy-800 dark:text-white">{fmt.format(order.totalPrice)}</p>
                    <div className="mt-1.5"><ProgressDots current={order.status} /></div>
                  </div>

                  <ChevronRight size={18} className={cn("text-silver-400 shrink-0 transition-transform", isExpanded && "rotate-90")} />
                </button>

                {/* Expanded Content - Management from within the order */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-navy-700/50">
                    {/* Smart Action Bar */}
                    <div className="px-5 py-3 bg-gray-50 dark:bg-navy-900/30 flex flex-wrap items-center gap-2">
                      {/* Primary smart action based on current status */}
                      {order.status === "ANFRAGE" && (
                        <button onClick={() => sendAngebot(order.id)} disabled={!!actionLoading}
                          className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-teal-500/20">
                          {isLoading("angebot") ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          Angebot erstellen & senden
                        </button>
                      )}
                      {order.status === "ANGEBOT" && (
                        <button onClick={() => approveOrder(order.id)} disabled={!!actionLoading}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                          {isLoading("approve") ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          Buchung bestätigen
                        </button>
                      )}
                      {config.next && order.status !== "ANFRAGE" && order.status !== "ANGEBOT" && (
                        <button onClick={() => updateStatus(order.id, config.next!)} disabled={!!actionLoading}
                          className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2">
                          {isLoading("status") ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                          {config.nextLabel}
                        </button>
                      )}

                      {/* Status dropdown for manual override */}
                      <div className="relative">
                        <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} disabled={!!actionLoading}
                          className="pl-3 pr-7 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs appearance-none disabled:opacity-50">
                          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-silver-400 pointer-events-none" />
                      </div>

                      {/* Quick contact */}
                      <a href={`mailto:${order.customer.email}`} className="p-2 rounded-lg border border-gray-200 dark:border-navy-700 hover:bg-white dark:hover:bg-navy-800" title="E-Mail">
                        <Mail size={15} className="text-silver-500" />
                      </a>
                      <a href={`tel:${order.customer.phone}`} className="p-2 rounded-lg border border-gray-200 dark:border-navy-700 hover:bg-white dark:hover:bg-navy-800" title="Anrufen">
                        <Phone size={15} className="text-silver-500" />
                      </a>

                      {order.status !== "STORNIERT" && order.status !== "ABGESCHLOSSEN" && (
                        <button onClick={() => updateStatus(order.id, "STORNIERT")} disabled={!!actionLoading}
                          className="ml-auto px-3 py-2 rounded-lg border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50">
                          Stornieren
                        </button>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Customer */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-silver-400 uppercase tracking-wider">Kunde</p>
                        <p className="text-sm font-medium text-navy-800 dark:text-white">{order.customer.name}</p>
                        <p className="text-xs text-silver-500">{order.customer.email}</p>
                        <p className="text-xs text-silver-500">{order.customer.phone}</p>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-silver-400 uppercase tracking-wider">Termin</p>
                        <p className="text-sm font-medium text-navy-800 dark:text-white flex items-center gap-1.5">
                          <Calendar size={13} className="text-teal-500" />
                          {new Date(order.scheduledAt || order.createdAt).toLocaleDateString("de-DE")}
                        </p>
                        {order.timeSlot && <p className="text-xs text-silver-500">{order.timeSlot}</p>}
                      </div>

                      {/* Route */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-silver-400 uppercase tracking-wider">Route</p>
                        {order.fromAddress ? (
                          <>
                            <p className="text-xs text-navy-800 dark:text-white flex items-center gap-1"><MapPin size={11} className="text-teal-500 shrink-0" /> {(order.fromAddress as Record<string,string>)?.street || "–"}</p>
                            {order.toAddress && <p className="text-xs text-navy-800 dark:text-white flex items-center gap-1"><ArrowRight size={11} className="text-silver-400 shrink-0" /> {(order.toAddress as Record<string,string>)?.street || "–"}</p>}
                            {order.distanceKm && <p className="text-[10px] text-silver-500">{order.distanceKm.toFixed(1)} km</p>}
                          </>
                        ) : <p className="text-xs text-silver-400">–</p>}
                      </div>

                      {/* Pricing */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-silver-400 uppercase tracking-wider">Preis</p>
                        <p className="text-sm text-silver-600 dark:text-silver-400">Netto: {fmt.format(order.netto)}</p>
                        <p className="text-sm text-silver-600 dark:text-silver-400">MwSt: {fmt.format(order.mwst)}</p>
                        <p className="text-base font-bold text-teal-600">{fmt.format(order.totalPrice)}</p>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          order.paymentStatus === "BEZAHLT" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                        )}>
                          <CreditCard size={10} /> {order.paymentStatus === "BEZAHLT" ? "Bezahlt" : "Ausstehend"}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="px-5 pb-4">
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm text-amber-800 dark:text-amber-300">
                          <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Anmerkungen: </span>{order.notes}
                        </div>
                      </div>
                    )}

                    {/* Linked Offers */}
                    {order.offers && order.offers.length > 0 && (
                      <div className="px-5 pb-4">
                        <div className="flex flex-wrap gap-2">
                          {order.offers.map((o) => (
                            <div key={o.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-navy-900/40 border border-gray-100 dark:border-navy-700/30 text-sm">
                              <FileText size={14} className="text-teal-500" />
                              <span className="font-mono text-teal-600 text-xs">{o.offerNumber}</span>
                              <span className="text-xs text-silver-500">{o.status}</span>
                              <span className="text-xs font-medium">{fmt.format(o.totalPrice)}</span>
                              <a href={`/api/angebot/${o.token}/pdf`} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-navy-700">
                                <Download size={12} className="text-silver-500" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
