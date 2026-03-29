"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  scheduledAt: string | null;
  timeSlot: string | null;
  notes: string | null;
  isDeleted?: boolean;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  service: {
    nameDe: string;
    category: string;
  };
  offers?: Array<{
    id: string;
    offerNumber: string;
    status: string;
    contracts?: Array<{
      id: string;
      contractNumber: string;
      status: string;
      signedAt?: string | null;
    }>;
  }>;
};

const statusOptions = ["ALLE", "ANFRAGE", "ANGEBOT", "BESTAETIGT", "IN_BEARBEITUNG", "ABGESCHLOSSEN", "STORNIERT"] as const;

const statusLabel: Record<string, string> = {
  ANFRAGE: "Neu",
  ANGEBOT: "Angebot",
  BESTAETIGT: "Bestätigt",
  IN_BEARBEITUNG: "In Bearbeitung",
  ABGESCHLOSSEN: "Abgeschlossen",
  STORNIERT: "Storniert",
};

const statusBadge: Record<string, string> = {
  ANFRAGE: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
  ANGEBOT: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20",
  BESTAETIGT: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20",
  IN_BEARBEITUNG: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  ABGESCHLOSSEN: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  STORNIERT: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20",
};

export default function BuchungenPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("ALLE");
  const [service, setService] = useState("ALLE");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrderRow | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const pageSize = 20;

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/admin/buchungen?showDeleted=${showDeleted}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data);
    } catch {
      setError("Anfragen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [showDeleted]);

  useEffect(() => {
    setPage(1);
  }, [search, status, service, dateFrom, dateTo, showDeleted]);

  function showToast(type: "ok" | "err", text: string) {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3000);
  }

  async function updateStatus(id: string, nextStatus: string) {
    try {
      setSavingId(id);
      const res = await fetch(`/api/admin/buchungen/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, ...updated } : order)));
      if (selected?.id === id) {
        setSelected((current) => (current ? { ...current, status: nextStatus } : current));
      }
      showToast("ok", "Status wurde aktualisiert.");
    } catch {
      showToast("err", "Status konnte nicht aktualisiert werden.");
    } finally {
      setSavingId(null);
    }
  }

  async function softDelete(id: string) {
    try {
      setSavingId(id);
      const res = await fetch(`/api/admin/buchungen/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteTarget(null);
      await loadOrders();
      showToast("ok", "Eintrag wurde gelöscht.");
    } catch {
      showToast("err", "Eintrag konnte nicht gelöscht werden.");
    } finally {
      setSavingId(null);
    }
  }

  const services = useMemo(
    () => ["ALLE", ...Array.from(new Set(orders.map((order) => order.service.nameDe))).sort((a, b) => a.localeCompare(b))],
    [orders]
  );

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const haystack = [order.customer.name, order.customer.email, order.customer.phone, order.service.nameDe, order.orderNumber]
        .join(" ")
        .toLowerCase();
      const searchMatch = haystack.includes(search.toLowerCase());
      const statusMatch = status === "ALLE" || order.status === status;
      const serviceMatch = service === "ALLE" || order.service.nameDe === service;
      const sourceDate = order.scheduledAt ?? order.createdAt;
      const dateMatchFrom = !dateFrom || sourceDate >= dateFrom;
      const dateMatchTo = !dateTo || sourceDate <= `${dateTo}T23:59:59.999Z` || sourceDate <= dateTo;
      return searchMatch && statusMatch && serviceMatch && dateMatchFrom && dateMatchTo;
    });
  }, [orders, search, status, service, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed right-5 top-5 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-xl ${
            toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.text}
        </div>
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Verträge / Anfragen</h1>
          <p className="mt-1 text-sm text-silver-500 dark:text-silver-400">
            Kundenanfragen prüfen, filtern, aktualisieren und sicher löschen.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-silver-600 dark:text-silver-300">
          <input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} />
          Gelöschte anzeigen
        </label>
      </div>

      <div className="grid gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-navy-700/50 dark:bg-navy-800/60 md:grid-cols-5">
        <label className="relative md:col-span-2">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Kundenname, Telefon, Service oder E-Mail"
            className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </label>

        <select value={status} onChange={(event) => setStatus(event.target.value as (typeof statusOptions)[number])} className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option === "ALLE" ? "Alle Status" : statusLabel[option]}
            </option>
          ))}
        </select>

        <select value={service} onChange={(event) => setService(event.target.value)} className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white">
          {services.map((option) => (
            <option key={option} value={option}>
              {option === "ALLE" ? "Alle Services" : option}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3 md:col-span-5">
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-silver-500">Von</span>
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white" />
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-silver-500">Bis</span>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white" />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-white px-5 py-6 text-sm text-silver-500 dark:border-navy-700/50 dark:bg-navy-800/60 dark:text-silver-400">
          <Loader2 size={16} className="animate-spin" />
          Anfragen werden geladen...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-navy-700/50 dark:bg-navy-800/60">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1fr_0.9fr] gap-3 border-b border-gray-100 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-silver-500 dark:border-navy-700/50 md:grid">
              <span>Kundenname</span>
              <span>Telefon</span>
              <span>E-Mail</span>
              <span>Service</span>
              <span>Datum</span>
              <span>Status</span>
              <span>Aktionen</span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-navy-700/50">
              {paginated.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-silver-500 dark:text-silver-400">Keine Einträge gefunden.</div>
              ) : (
                paginated.map((order) => (
                  <div key={order.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1fr_0.9fr] md:items-center">
                    <div>
                      <p className="font-semibold text-navy-800 dark:text-white">{order.customer.name}</p>
                      <p className="mt-1 text-xs text-silver-500 dark:text-silver-400">Erstellt: {new Date(order.createdAt).toLocaleString("de-DE")}</p>
                    </div>
                    <p className="text-sm text-navy-700 dark:text-silver-200">{order.customer.phone || "—"}</p>
                    <p className="truncate text-sm text-navy-700 dark:text-silver-200">{order.customer.email}</p>
                    <p className="text-sm text-navy-700 dark:text-silver-200">{order.service.nameDe}</p>
                    <div className="text-sm text-navy-700 dark:text-silver-200">
                      <p>{new Date(order.scheduledAt ?? order.createdAt).toLocaleDateString("de-DE")}</p>
                      {order.timeSlot && <p className="mt-1 text-xs text-silver-500 dark:text-silver-400">{order.timeSlot}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge[order.status] ?? statusBadge.ANFRAGE}`}>
                        {statusLabel[order.status] ?? order.status}
                      </span>
                      {order.isDeleted && (
                        <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                          Gelöscht
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(order)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-silver-500 transition hover:border-teal-500 hover:text-teal-600 dark:border-navy-700 dark:text-silver-400">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(order)} disabled={Boolean(order.isDeleted)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-silver-500 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-700 dark:text-silver-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white px-5 py-4 text-sm dark:border-navy-700/50 dark:bg-navy-800/60">
            <p className="text-silver-500 dark:text-silver-400">
              Seite {page} von {totalPages} · {filtered.length} Einträge
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 disabled:opacity-50 dark:border-navy-700">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 disabled:opacity-50 dark:border-navy-700">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl dark:bg-navy-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-navy-800 dark:text-white">Anfrage anzeigen</h2>
                <p className="mt-1 text-sm text-silver-500 dark:text-silver-400">{selected.orderNumber}</p>
              </div>
              <button onClick={() => setSelected(null)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 dark:border-navy-700">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-navy-700/50 dark:bg-navy-800/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Status ändern</p>
                <div className="mt-3 flex items-center gap-3">
                  <select
                    value={selected.status}
                    onChange={async (event) => {
                      const nextStatus = event.target.value;
                      setSelected((current) => (current ? { ...current, status: nextStatus } : current));
                      await updateStatus(selected.id, nextStatus);
                    }}
                    className="h-11 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                  >
                    {statusOptions.filter((option) => option !== "ALLE").map((option) => (
                      <option key={option} value={option}>
                        {statusLabel[option]}
                      </option>
                    ))}
                  </select>
                  {savingId === selected.id && <Loader2 size={16} className="animate-spin text-silver-400" />}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard title="Kundenname" value={selected.customer.name} />
                <DetailCard title="Telefon" value={selected.customer.phone || "—"} />
                <DetailCard title="E-Mail" value={selected.customer.email} />
                <DetailCard title="Service" value={selected.service.nameDe} />
                <DetailCard title="Datum" value={new Date(selected.scheduledAt ?? selected.createdAt).toLocaleDateString("de-DE")} />
                <DetailCard title="Erstellt am" value={new Date(selected.createdAt).toLocaleString("de-DE")} />
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-navy-700/50 dark:bg-navy-800/60">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-800 dark:text-white">
                  <Calendar size={16} className="text-teal-500" />
                  Notizen
                </div>
                <p className="mt-3 text-sm leading-6 text-silver-600 dark:text-silver-300">{selected.notes || "Keine zusätzlichen Hinweise vorhanden."}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-navy-700/50 dark:bg-navy-800/60">
                <p className="text-sm font-semibold text-navy-800 dark:text-white">Verknüpfte Angebote / Verträge</p>
                <div className="mt-3 space-y-3">
                  {selected.offers?.length ? (
                    selected.offers.map((offer) => (
                      <div key={offer.id} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-900">
                        <p className="text-sm font-semibold text-navy-800 dark:text-white">{offer.offerNumber}</p>
                        <p className="mt-1 text-xs text-silver-500 dark:text-silver-400">Status: {offer.status}</p>
                        {offer.contracts?.length ? (
                          <div className="mt-3 space-y-2">
                            {offer.contracts.map((contract) => (
                              <div key={contract.id} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                                {contract.contractNumber} · {contract.status}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-xs text-silver-500 dark:text-silver-400">Noch kein Vertrag verknüpft.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-silver-500 dark:text-silver-400">Keine Angebote oder Verträge verknüpft.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-navy-900">
            <h2 className="text-lg font-bold text-navy-800 dark:text-white">Eintrag löschen</h2>
            <p className="mt-3 text-sm leading-6 text-silver-600 dark:text-silver-300">
              Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-medium dark:border-navy-700">
                Abbrechen
              </button>
              <button onClick={() => softDelete(deleteTarget.id)} disabled={savingId === deleteTarget.id} className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {savingId === deleteTarget.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-navy-700/50 dark:bg-navy-800/60">
      <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">{title}</p>
      <p className="mt-2 text-sm font-medium text-navy-800 dark:text-white">{value}</p>
    </div>
  );
}
