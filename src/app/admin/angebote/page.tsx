"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Send, CheckCircle2, XCircle, Filter, Search, MessageSquare, FileText,
  Plus, Save, Download, Eye, Loader2, X, ExternalLink, Euro, Trash2,
  ChevronDown, AlertCircle, ClipboardList, PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Offer = {
  id: string;
  offerNumber: string;
  token: string;
  status: string;
  validUntil: string;
  totalPrice: number;
  netto: number;
  mwst: number;
  createdAt: string;
  discountAmount: number;
  extraFees: number;
  customer: { name: string; email: string; phone?: string };
  items: Array<{
    id: string;
    position: number;
    title: string;
    description: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  contracts: Array<{ id: string; token: string; status: string }>;
};

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:  { label: "Ausstehend",  color: "text-amber-700 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  MODIFIED: { label: "Überarbeitet", color: "text-blue-700 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
  APPROVED: { label: "Freigegeben", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
  REJECTED: { label: "Abgelehnt",   color: "text-red-700 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
  ACCEPTED: { label: "Angenommen",  color: "text-teal-700 dark:text-teal-400",     bg: "bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusLabels[status] || statusLabels.PENDING;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border", cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
}

export default function AngebotePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALLE");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [messageSubject, setMessageSubject] = useState("Rückfrage zu Ihrem Angebot");
  const [messageBody, setMessageBody] = useState("");
  const [showContact, setShowContact] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const selected = useMemo(
    () => offers.find((o) => o.id === selectedId) || null,
    [offers, selectedId]
  );

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/angebote");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOffers(data);
      setSelectedId((prev) => prev || (data.length > 0 ? data[0].id : null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  async function runAction(url: string, body: unknown = {}) {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Aktion fehlgeschlagen");
      await fetchOffers();
      showToast("Aktion erfolgreich ausgeführt.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Aktion fehlgeschlagen", "err");
    } finally {
      setSaving(false);
    }
  }

  async function saveOffer() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/angebote/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selected.items.map((item) => ({
            id: item.id,
            position: item.position,
            title: item.title,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: Number((item.quantity * item.unitPrice).toFixed(2)),
          })),
          discountAmount: selected.discountAmount,
          extraFees: selected.extraFees,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Speichern fehlgeschlagen");
      setOffers((prev) => prev.map((o) => (o.id === data.id ? data : o)));
      showToast("Änderungen gespeichert.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Speichern fehlgeschlagen", "err");
    } finally {
      setSaving(false);
    }
  }

  function updateItem(index: number, patch: Partial<Offer["items"][number]>) {
    if (!selected) return;
    const next = offers.map((offer) => {
      if (offer.id !== selected.id) return offer;
      const items = [...offer.items];
      items[index] = { ...items[index], ...patch };
      return { ...offer, items };
    });
    setOffers(next);
  }

  function removeItem(index: number) {
    if (!selected) return;
    const next = offers.map((offer) => {
      if (offer.id !== selected.id) return offer;
      return { ...offer, items: offer.items.filter((_, i) => i !== index) };
    });
    setOffers(next);
  }

  function addCustomItem() {
    if (!selected) return;
    const next = offers.map((offer) => {
      if (offer.id !== selected.id) return offer;
      return {
        ...offer,
        items: [
          ...offer.items,
          { id: `tmp-${Date.now()}`, position: offer.items.length + 1, title: "Neue Position", description: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
        ],
      };
    });
    setOffers(next);
  }

  const filtered = offers.filter((o) => {
    const matchStatus = statusFilter === "ALLE" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = o.offerNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const itemsTotal = selected ? selected.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0) : 0;
  const hasContract = selected?.contracts?.some((c) => c.status === "SIGNED" || c.status === "LOCKED");

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 dark:bg-navy-700 rounded-lg" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-96 bg-gray-200 dark:bg-navy-700 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-navy-700 rounded-2xl" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-3">
            <ClipboardList size={28} className="text-teal-500" />
            Angebote
          </h1>
          <p className="text-sm text-silver-500 mt-1">{offers.length} Angebote insgesamt</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Offer List */}
        <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-navy-700/50 space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Suche..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm focus:border-teal-500 outline-none" />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm appearance-none">
                <option value="ALLE">Alle Status</option>
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 pointer-events-none" />
            </div>
          </div>

          <div className="max-h-[70vh] overflow-auto divide-y divide-gray-100 dark:divide-navy-700/30">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-silver-500 text-sm">Keine Angebote gefunden.</div>
            ) : (
              filtered.map((offer) => (
                <button
                  key={offer.id}
                  onClick={() => setSelectedId(offer.id)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-navy-900/30 transition-colors",
                    selectedId === offer.id && "bg-teal-50 dark:bg-teal-500/10 border-l-4 border-l-teal-500"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-teal-600 dark:text-teal-400 text-sm font-semibold">{offer.offerNumber}</p>
                    <StatusBadge status={offer.status} />
                  </div>
                  <p className="text-sm font-medium text-navy-800 dark:text-white">{offer.customer.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-silver-500">
                      {new Date(offer.createdAt).toLocaleDateString("de-DE")}
                    </span>
                    <span className="text-sm font-bold text-navy-800 dark:text-white">{fmt.format(offer.totalPrice)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Offer Detail */}
        <div className="lg:col-span-2 space-y-4">
          {!selected ? (
            <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-12 text-center">
              <FileText size={48} className="text-silver-300 dark:text-navy-600 mx-auto mb-4" />
              <p className="text-silver-500">Bitte ein Angebot aus der Liste wählen.</p>
            </div>
          ) : (
            <>
              {/* Header Bar */}
              <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">{selected.offerNumber}</h2>
                      <StatusBadge status={selected.status} />
                    </div>
                    <p className="text-sm text-silver-500">{selected.customer.name} · {selected.customer.email}</p>
                    <p className="text-xs text-silver-400 mt-1">
                      Erstellt: {new Date(selected.createdAt).toLocaleDateString("de-DE")} · 
                      Gültig bis: {new Date(selected.validUntil).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => runAction(`/api/admin/angebote/${selected.id}/send`)} disabled={saving}
                    className="px-4 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50">
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} An Kunden senden
                  </button>
                  <button onClick={() => runAction(`/api/admin/angebote/${selected.id}/approve`)} disabled={saving}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50">
                    <CheckCircle2 size={15} /> Freigeben
                  </button>
                  {(selected.status === "APPROVED" || selected.status === "ACCEPTED") && !hasContract && (
                    <button onClick={() => runAction(`/api/admin/angebote/${selected.id}/send-contract-signature`)} disabled={saving}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                      <PenTool size={15} /> Vertrag zur Unterschrift
                    </button>
                  )}
                  {hasContract && (
                    <span className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 size={15} /> Vertrag unterschrieben
                    </span>
                  )}
                  <button onClick={() => { if (confirm("Angebot wirklich ablehnen?")) runAction(`/api/admin/angebote/${selected.id}/reject`, { reason: "Manuelle Ablehnung" }); }} disabled={saving}
                    className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 disabled:opacity-50">
                    <XCircle size={15} /> Ablehnen
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-navy-800 dark:text-white flex items-center gap-2">
                    <Euro size={16} className="text-teal-500" /> Positionen bearbeiten
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={addCustomItem} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-navy-700 text-sm flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-navy-800">
                      <Plus size={14} /> Position
                    </button>
                    <button onClick={saveOffer} disabled={saving}
                      className="px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-medium flex items-center gap-1.5 hover:bg-teal-600 disabled:opacity-50">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Speichern
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-navy-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-navy-900/40 border-b border-gray-200 dark:border-navy-700">
                        <th className="text-left px-4 py-3 text-xs font-medium text-silver-500 uppercase w-6">#</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-silver-500 uppercase">Bezeichnung</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-silver-500 uppercase w-24">Menge</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-silver-500 uppercase w-28">Einzelpreis</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-silver-500 uppercase w-28">Gesamt</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-navy-700/30">
                      {selected.items.map((item, idx) => (
                        <tr key={item.id} className="group hover:bg-gray-50 dark:hover:bg-navy-900/20">
                          <td className="px-4 py-3 text-silver-400 text-xs">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <input value={item.title} onChange={(e) => updateItem(idx, { title: e.target.value })}
                              className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-navy-600 focus:border-teal-500 outline-none py-1 text-sm text-navy-800 dark:text-white" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                              className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-navy-600 focus:border-teal-500 outline-none py-1 text-sm text-right" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                              className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-navy-600 focus:border-teal-500 outline-none py-1 text-sm text-right" />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-navy-800 dark:text-white">{fmt.format(item.quantity * item.unitPrice)}</td>
                          <td className="px-2 py-3">
                            <button onClick={() => removeItem(idx)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-500/10 transition-all">
                              <Trash2 size={14} className="text-red-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-4 bg-gray-50 dark:bg-navy-900/40 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-silver-600 dark:text-silver-400">Zwischensumme</span>
                    <span className="font-medium">{fmt.format(itemsTotal)}</span>
                  </div>
                  {selected.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Rabatt</span>
                      <span className="text-red-600 font-medium">-{fmt.format(selected.discountAmount)}</span>
                    </div>
                  )}
                  {selected.extraFees > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-silver-600 dark:text-silver-400">Zuschläge</span>
                      <span className="font-medium">+{fmt.format(selected.extraFees)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-silver-600 dark:text-silver-400">Netto</span>
                    <span className="font-medium">{fmt.format(selected.netto)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-silver-600 dark:text-silver-400">MwSt. (19%)</span>
                    <span className="font-medium">{fmt.format(selected.mwst)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-navy-700">
                    <span className="text-base font-bold text-navy-800 dark:text-white">Gesamtbetrag</span>
                    <span className="text-lg font-bold text-teal-600">{fmt.format(selected.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: PDF + Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* PDF Preview */}
                <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-5">
                  <h3 className="text-sm font-semibold text-navy-800 dark:text-white mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-teal-500" /> PDF-Vorschau
                  </h3>
                  <iframe
                    title="offer-pdf-preview"
                    src={`/api/angebot/${selected.token}/pdf`}
                    className="w-full h-64 rounded-xl border border-gray-200 dark:border-navy-700 bg-white"
                  />
                  <div className="flex gap-2 mt-3">
                    <a href={`/api/angebot/${selected.token}/pdf`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-navy-800">
                      <Eye size={15} /> Ansehen
                    </a>
                    <a href={`/api/angebot/${selected.token}/pdf`} download
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-navy-800">
                      <Download size={15} /> Herunterladen
                    </a>
                  </div>
                </div>

                {/* Customer Contact */}
                <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-5">
                  <h3 className="text-sm font-semibold text-navy-800 dark:text-white mb-3 flex items-center gap-2">
                    <MessageSquare size={16} className="text-teal-500" /> Kundenkontakt
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-silver-500">E-Mail:</span>
                      <a href={`mailto:${selected.customer.email}`} className="text-teal-600 hover:underline">{selected.customer.email}</a>
                    </div>
                    {selected.customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-silver-500">Telefon:</span>
                        <a href={`tel:${selected.customer.phone}`} className="text-teal-600 hover:underline">{selected.customer.phone}</a>
                      </div>
                    )}
                  </div>

                  {!showContact ? (
                    <button onClick={() => setShowContact(true)}
                      className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center justify-center gap-2">
                      <MessageSquare size={15} /> Nachricht senden
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <input value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 px-3 py-2 text-sm" placeholder="Betreff" />
                      <textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} rows={3}
                        className="w-full rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 px-3 py-2 text-sm resize-none" placeholder="Ihre Nachricht..." />
                      <div className="flex gap-2">
                        <button disabled={saving || !messageBody.trim()}
                          onClick={() => { runAction(`/api/admin/angebote/${selected.id}/contact`, { subject: messageSubject, message: messageBody, sendEmail: true }); setMessageBody(""); setShowContact(false); }}
                          className="flex-1 py-2 rounded-lg bg-navy-800 dark:bg-navy-600 text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                          <Send size={14} /> Senden
                        </button>
                        <button onClick={() => setShowContact(false)}
                          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-navy-700 text-sm hover:bg-gray-50 dark:hover:bg-navy-800">
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contracts */}
              {selected.contracts.length > 0 && (
                <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-5">
                  <h3 className="text-sm font-semibold text-navy-800 dark:text-white mb-3 flex items-center gap-2">
                    <PenTool size={16} className="text-teal-500" /> Verträge
                  </h3>
                  <div className="space-y-2">
                    {selected.contracts.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-navy-900/40 border border-gray-100 dark:border-navy-700/30">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                            c.status === "SIGNED" || c.status === "LOCKED"
                              ? "bg-emerald-100 dark:bg-emerald-500/10" : "bg-amber-100 dark:bg-amber-500/10"
                          )}>
                            {c.status === "SIGNED" || c.status === "LOCKED"
                              ? <CheckCircle2 size={16} className="text-emerald-600" />
                              : <PenTool size={16} className="text-amber-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{c.status === "SIGNED" || c.status === "LOCKED" ? "Unterschrieben" : "Warte auf Unterschrift"}</p>
                          </div>
                        </div>
                        <a href={`/vertrag/${c.token}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-700">
                          <ExternalLink size={16} className="text-silver-500" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
