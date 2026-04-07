"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Download, Eye, FilePlus2, Files, Loader2, Mail, Plus, Save, Search, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateManualDocumentTotals } from "@/lib/manual-document-utils";

type ManualDocumentType = "OFFER" | "CONTRACT" | "INVOICE";
type ManualDocumentStatus = "DRAFT" | "SENT" | "APPROVED" | "SIGNED" | "PAID" | "CANCELLED";
type ManualItem = { id: string; title: string; description: string | null; quantity: number; unitPrice: number; totalPrice: number };
type Customer = { id: string; name: string; email: string; phone: string; company?: string | null };
type Order = {
  id: string;
  orderNumber: string;
  scheduledAt?: string | null;
  timeSlot?: string | null;
  totalPrice: number;
  customer: Customer;
  service?: { nameDe: string } | null;
  fromAddress?: Record<string, string> | null;
  toAddress?: Record<string, string> | null;
  distanceKm?: number | null;
  breakdownJson?: { services?: Array<{ pricing?: { lines?: Array<{ label: string; amount: number; detail?: string }> } }> } | null;
};
type ManualDocument = {
  id: string;
  type: ManualDocumentType;
  status: ManualDocumentStatus;
  documentNumber: string;
  customerId: string | null;
  sourceOrderId: string | null;
  title: string;
  introText: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerCompany: string | null;
  serviceSummary: string;
  serviceDate: string | null;
  timeSlot: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  routeDistanceKm: number | null;
  issueDate: string;
  validUntil: string | null;
  dueDate: string | null;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  itemsJson: ManualItem[];
  notes: string | null;
  footerNote: string | null;
  sentAt: string | null;
  createdAt: string;
};
type EditorDocument = {
  id: string | null;
  type: ManualDocumentType;
  status: ManualDocumentStatus;
  documentNumber: string;
  customerId: string | null;
  sourceOrderId: string | null;
  title: string;
  introText: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany: string;
  serviceSummary: string;
  serviceDate: string;
  timeSlot: string;
  fromAddress: string;
  toAddress: string;
  routeDistanceKm: string;
  issueDate: string;
  validUntil: string;
  dueDate: string;
  taxRate: number;
  items: ManualItem[];
  notes: string;
  footerNote: string;
};

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const typeLabels: Record<ManualDocumentType, string> = { OFFER: "Angebot", CONTRACT: "Vertrag", INVOICE: "Rechnung" };
const statusLabels: Record<ManualDocumentStatus, string> = { DRAFT: "Entwurf", SENT: "Gesendet", APPROVED: "Freigegeben", SIGNED: "Unterschrieben", PAID: "Bezahlt", CANCELLED: "Storniert" };

function toInputDate(value?: string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function buildAddressLabel(value?: Record<string, string> | null) {
  if (!value) return "";
  return [value.street, value.houseNumber, value.zip, value.city].filter(Boolean).join(", ");
}

function buildOrderItems(order: Order) {
  const lines =
    order.breakdownJson?.services?.flatMap((service) =>
      (service.pricing?.lines || [])
        .filter((line) => !["Nettobetrag", "MwSt. (19%)", "Gesamtbetrag"].includes(line.label))
        .map((line) => ({
          id: crypto.randomUUID(),
          title: line.label,
          description: line.detail || "",
          quantity: 1,
          unitPrice: Number(line.amount || 0),
          totalPrice: Number(line.amount || 0),
        }))
    ) || [];

  return lines.length > 0
    ? lines
    : [{ id: crypto.randomUUID(), title: order.service?.nameDe || "Leistung", description: order.orderNumber, quantity: 1, unitPrice: Number(order.totalPrice || 0), totalPrice: Number(order.totalPrice || 0) }];
}

function emptyEditor(type: ManualDocumentType = "OFFER"): EditorDocument {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: null,
    type,
    status: "DRAFT",
    documentNumber: "",
    customerId: null,
    sourceOrderId: null,
    title: `${typeLabels[type]} individuell`,
    introText: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCompany: "",
    serviceSummary: "",
    serviceDate: "",
    timeSlot: "",
    fromAddress: "",
    toAddress: "",
    routeDistanceKm: "",
    issueDate: today,
    validUntil: type === "OFFER" ? today : "",
    dueDate: type === "INVOICE" ? today : "",
    taxRate: 19,
    items: [{ id: crypto.randomUUID(), title: "Leistungsposition", description: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
    notes: "",
    footerNote: "",
  };
}

function toEditor(doc: ManualDocument): EditorDocument {
  return {
    id: doc.id,
    type: doc.type,
    status: doc.status,
    documentNumber: doc.documentNumber,
    customerId: doc.customerId,
    sourceOrderId: doc.sourceOrderId,
    title: doc.title,
    introText: doc.introText || "",
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    customerPhone: doc.customerPhone || "",
    customerCompany: doc.customerCompany || "",
    serviceSummary: doc.serviceSummary,
    serviceDate: toInputDate(doc.serviceDate),
    timeSlot: doc.timeSlot || "",
    fromAddress: doc.fromAddress || "",
    toAddress: doc.toAddress || "",
    routeDistanceKm: doc.routeDistanceKm ? String(doc.routeDistanceKm) : "",
    issueDate: toInputDate(doc.issueDate),
    validUntil: toInputDate(doc.validUntil),
    dueDate: toInputDate(doc.dueDate),
    taxRate: doc.taxRate,
    items: Array.isArray(doc.itemsJson) ? doc.itemsJson.map((item) => ({ ...item, id: item.id || crypto.randomUUID() })) : [],
    notes: doc.notes || "",
    footerNote: doc.footerNote || "",
  };
}

export default function DokumentePage() {
  const [documents, setDocuments] = useState<ManualDocument[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorDocument>(() => emptyEditor());
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ManualDocumentType | "ALLE">("ALLE");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [docsRes, customersRes, ordersRes] = await Promise.all([
        fetch("/api/admin/dokumente"),
        fetch("/api/admin/kunden"),
        fetch("/api/admin/buchungen?view=documents"),
      ]);
      if (!docsRes.ok || !customersRes.ok || !ordersRes.ok) throw new Error();
      const [docsData, customersData, ordersData] = await Promise.all([docsRes.json(), customersRes.json(), ordersRes.json()]);
      setDocuments(docsData);
      setCustomers(customersData);
      setOrders(ordersData);
      if (docsData.length > 0 && !selectedId) {
        setSelectedId(docsData[0].id);
        setEditor(toEditor(docsData[0]));
      }
    } catch {
      showToast("Dokumentdaten konnten nicht geladen werden.", "err");
    } finally {
      setLoading(false);
    }
  }, [selectedId, showToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!selectedId) return;
    const current = documents.find((doc) => doc.id === selectedId);
    if (current) setEditor(toEditor(current));
  }, [selectedId, documents]);

  const totals = useMemo(() => calculateManualDocumentTotals(editor.items, editor.taxRate), [editor.items, editor.taxRate]);
  const filteredDocuments = useMemo(() => {
    const q = query.toLowerCase();
    return documents.filter((doc) => {
      const matchType = typeFilter === "ALLE" || doc.type === typeFilter;
      const matchQuery = doc.documentNumber.toLowerCase().includes(q) || doc.customerName.toLowerCase().includes(q) || doc.title.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [documents, query, typeFilter]);

  function updateEditor(patch: Partial<EditorDocument>) {
    setEditor((prev) => ({ ...prev, ...patch }));
  }

  function updateItem(index: number, patch: Partial<ManualItem>) {
    setEditor((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...patch };
      return { ...prev, items };
    });
  }

  function addItem() {
    setEditor((prev) => ({ ...prev, items: [...prev.items, { id: crypto.randomUUID(), title: "Neue Position", description: "", quantity: 1, unitPrice: 0, totalPrice: 0 }] }));
  }

  function removeItem(index: number) {
    setEditor((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  }

  function createNew(type: ManualDocumentType) {
    setSelectedId(null);
    setEditor(emptyEditor(type));
  }

  function applyCustomer(customerId: string) {
    const customer = customers.find((entry) => entry.id === customerId);
    if (!customer) return;
    updateEditor({ customerId: customer.id, customerName: customer.name, customerEmail: customer.email, customerPhone: customer.phone, customerCompany: customer.company || "" });
  }

  function applyOrder(orderId: string) {
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) return;
    setEditor((prev) => ({
      ...prev,
      sourceOrderId: order.id,
      customerId: order.customer.id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      customerCompany: order.customer.company || "",
      serviceSummary: order.service?.nameDe || prev.serviceSummary,
      serviceDate: toInputDate(order.scheduledAt),
      timeSlot: order.timeSlot || "",
      fromAddress: buildAddressLabel(order.fromAddress),
      toAddress: buildAddressLabel(order.toAddress),
      routeDistanceKm: order.distanceKm ? String(order.distanceKm) : "",
      items: buildOrderItems(order),
    }));
  }

  function buildPayload() {
    return {
      type: editor.type,
      status: editor.status,
      customerId: editor.customerId,
      sourceOrderId: editor.sourceOrderId,
      title: editor.title,
      introText: editor.introText,
      customerName: editor.customerName,
      customerEmail: editor.customerEmail,
      customerPhone: editor.customerPhone,
      customerCompany: editor.customerCompany,
      serviceSummary: editor.serviceSummary,
      serviceDate: editor.serviceDate || null,
      timeSlot: editor.timeSlot || null,
      fromAddress: editor.fromAddress || null,
      toAddress: editor.toAddress || null,
      routeDistanceKm: editor.routeDistanceKm ? Number(editor.routeDistanceKm) : null,
      issueDate: editor.issueDate || null,
      validUntil: editor.validUntil || null,
      dueDate: editor.dueDate || null,
      taxRate: editor.taxRate,
      items: editor.items,
      notes: editor.notes,
      footerNote: editor.footerNote,
    };
  }

  async function saveDocument() {
    if (!editor.title.trim() || !editor.customerName.trim() || !editor.customerEmail.trim() || !editor.serviceSummary.trim()) {
      showToast("Titel, Kunde, E-Mail und Leistung sind Pflichtfelder.", "err");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(editor.id ? `/api/admin/dokumente/${editor.id}` : "/api/admin/dokumente", {
        method: editor.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Speichern fehlgeschlagen");
      setDocuments((prev) => (editor.id ? prev.map((doc) => (doc.id === data.id ? data : doc)) : [data, ...prev]));
      setSelectedId(data.id);
      setEditor(toEditor(data));
      showToast("Dokument gespeichert.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Speichern fehlgeschlagen", "err");
    } finally {
      setSaving(false);
    }
  }

  async function sendDocument() {
    if (!editor.id) {
      showToast("Bitte zuerst speichern.", "err");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/admin/dokumente/${editor.id}/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Versand fehlgeschlagen");
      setDocuments((prev) => prev.map((doc) => (doc.id === data.document.id ? data.document : doc)));
      setEditor((prev) => ({ ...prev, status: data.document.status }));
      showToast("Dokument per E-Mail versendet.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Versand fehlgeschlagen", "err");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <div className="space-y-6 animate-pulse"><div className="h-8 w-60 rounded-xl bg-gray-200 dark:bg-navy-700" /><div className="grid lg:grid-cols-3 gap-6"><div className="h-[680px] rounded-3xl bg-gray-200 dark:bg-navy-700" /><div className="lg:col-span-2 h-[680px] rounded-3xl bg-gray-200 dark:bg-navy-700" /></div></div>;
  }

  return (
    <div className="space-y-6">
      {toast && <div className={cn("fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-3", toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>{toast.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}{toast.msg}</div>}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-3"><Files size={28} className="text-teal-500" />Dokumentenstudio</h1>
          <p className="text-sm text-silver-500 mt-1">Manuelle Angebote, Verträge und Rechnungen mit voller Positionen-, Steuer- und Textkontrolle.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => createNew("OFFER")} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2"><FilePlus2 size={16} />Angebot</button>
          <button onClick={() => createNew("CONTRACT")} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2"><FilePlus2 size={16} />Vertrag</button>
          <button onClick={() => createNew("INVOICE")} className="px-4 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 flex items-center gap-2 shadow-lg shadow-teal-500/20"><Plus size={16} />Rechnung</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-navy-800/60 rounded-3xl border border-gray-100 dark:border-navy-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-navy-700/40 space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Suche nach Nummer, Titel, Kunde ..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm outline-none" />
            </div>
            <div className="relative">
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as ManualDocumentType | "ALLE")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm appearance-none">
                <option value="ALLE">Alle Dokumente</option>
                <option value="OFFER">Angebote</option>
                <option value="CONTRACT">Verträge</option>
                <option value="INVOICE">Rechnungen</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 pointer-events-none" />
            </div>
          </div>
          <div className="max-h-[72vh] overflow-auto divide-y divide-gray-100 dark:divide-navy-700/30">
            {filteredDocuments.length === 0 ? <div className="p-8 text-center text-sm text-silver-500">Noch keine manuellen Dokumente vorhanden.</div> : filteredDocuments.map((doc) => (
              <button key={doc.id} onClick={() => setSelectedId(doc.id)} className={cn("w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-navy-900/30 transition-colors", selectedId === doc.id && "bg-teal-50 dark:bg-teal-500/10 border-l-4 border-l-teal-500")}>
                <div className="flex items-center justify-between gap-3"><span className="text-xs uppercase tracking-[0.18em] text-silver-500">{typeLabels[doc.type]}</span><span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">{statusLabels[doc.status]}</span></div>
                <p className="mt-1 font-mono text-sm font-semibold text-navy-800 dark:text-white">{doc.documentNumber}</p>
                <p className="text-sm text-silver-600 dark:text-silver-300 mt-1">{doc.customerName}</p>
                <p className="text-xs text-silver-500 mt-1 line-clamp-1">{doc.title}</p>
                <div className="flex items-center justify-between mt-2"><span className="text-xs text-silver-400">{new Date(doc.createdAt).toLocaleDateString("de-DE")}</span><span className="text-sm font-bold text-teal-600">{fmt.format(doc.totalAmount)}</span></div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-navy-800/60 rounded-3xl border border-gray-100 dark:border-navy-700/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-silver-500 mb-2">Editor</p>
                <h2 className="text-xl font-bold text-navy-800 dark:text-white">{editor.documentNumber || "Neues Dokument"}</h2>
                <p className="text-sm text-silver-500 mt-1">{typeLabels[editor.type]} mit freier Konfiguration und PDF-Ausgabe.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={saveDocument} disabled={saving} className="px-4 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}Speichern</button>
                <button onClick={sendDocument} disabled={sending || !editor.id} className="px-4 py-2.5 rounded-xl bg-navy-800 dark:bg-navy-700 text-white text-sm font-semibold hover:bg-navy-900 dark:hover:bg-navy-600 disabled:opacity-50 flex items-center gap-2">{sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}Senden</button>
                {editor.id && <>
                  <a href={`/api/admin/dokumente/${editor.id}/pdf`} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2"><Eye size={15} />Vorschau</a>
                  <a href={`/api/admin/dokumente/${editor.id}/pdf?download=1`} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2"><Download size={15} />PDF</a>
                </>}
              </div>
            </div>
            <div className="grid xl:grid-cols-3 gap-4 mt-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Dokumenttyp</label>
                <select value={editor.type} onChange={(event) => updateEditor({ type: event.target.value as ManualDocumentType, title: `${typeLabels[event.target.value as ManualDocumentType]} individuell` })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm">
                  <option value="OFFER">Angebot</option>
                  <option value="CONTRACT">Vertrag</option>
                  <option value="INVOICE">Rechnung</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Status</label>
                <select value={editor.status} onChange={(event) => updateEditor({ status: event.target.value as ManualDocumentStatus })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm">
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Dokumentnummer</label>
                <input value={editor.documentNumber} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-900/20 text-sm text-silver-500" placeholder="Wird beim ersten Speichern vergeben" />
              </div>
            </div>

            <div className="grid xl:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Kunde übernehmen</label>
                <select value={editor.customerId || ""} onChange={(event) => applyCustomer(event.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm">
                  <option value="">Kunde auswählen ...</option>
                  {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} - {customer.email}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Auftrag als Vorlage</label>
                <select value={editor.sourceOrderId || ""} onChange={(event) => applyOrder(event.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm">
                  <option value="">Buchung auswählen ...</option>
                  {orders.map((order) => <option key={order.id} value={order.id}>{order.orderNumber} - {order.customer.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid xl:grid-cols-2 gap-4 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Titel</label>
                  <input value={editor.title} onChange={(event) => updateEditor({ title: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Leistung / Betreff</label>
                  <input value={editor.serviceSummary} onChange={(event) => updateEditor({ serviceSummary: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Intro Text</label>
                  <textarea value={editor.introText} onChange={(event) => updateEditor({ introText: event.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm resize-none" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Kundenname</label>
                    <input value={editor.customerName} onChange={(event) => updateEditor({ customerName: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">E-Mail</label>
                    <input value={editor.customerEmail} onChange={(event) => updateEditor({ customerEmail: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Telefon</label>
                    <input value={editor.customerPhone} onChange={(event) => updateEditor({ customerPhone: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Firma</label>
                    <input value={editor.customerCompany} onChange={(event) => updateEditor({ customerCompany: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid xl:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Ausgabedatum</label>
                <input type="date" value={editor.issueDate} onChange={(event) => updateEditor({ issueDate: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">{editor.type === "INVOICE" ? "Fällig am" : "Gültig bis"}</label>
                <input type="date" value={editor.type === "INVOICE" ? editor.dueDate : editor.validUntil} onChange={(event) => updateEditor(editor.type === "INVOICE" ? { dueDate: event.target.value } : { validUntil: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Leistungsdatum</label>
                <input type="date" value={editor.serviceDate} onChange={(event) => updateEditor({ serviceDate: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">MwSt. %</label>
                <input type="number" min="0" step="0.01" value={editor.taxRate} onChange={(event) => updateEditor({ taxRate: Number(event.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
              </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Zeitfenster</label>
                <input value={editor.timeSlot} onChange={(event) => updateEditor({ timeSlot: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Von</label>
                <input value={editor.fromAddress} onChange={(event) => updateEditor({ fromAddress: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Nach</label>
                <input value={editor.toAddress} onChange={(event) => updateEditor({ toAddress: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-navy-800 dark:text-white">Positionen</h3>
                <button onClick={addItem} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-navy-700 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-navy-800"><Plus size={14} />Position</button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-navy-700">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-navy-900/40">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs uppercase text-silver-500">Position</th>
                      <th className="text-right px-4 py-3 text-xs uppercase text-silver-500">Menge</th>
                      <th className="text-right px-4 py-3 text-xs uppercase text-silver-500">Einzelpreis</th>
                      <th className="text-right px-4 py-3 text-xs uppercase text-silver-500">Gesamt</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-navy-700/30">
                    {editor.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <input value={item.title} onChange={(event) => updateItem(index, { title: event.target.value })} className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-navy-600 focus:border-teal-500 outline-none py-1 text-sm" />
                          <textarea value={item.description || ""} onChange={(event) => updateItem(index, { description: event.target.value })} rows={2} className="w-full mt-1 bg-transparent text-xs text-silver-500 border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-navy-600 focus:border-teal-500 outline-none resize-none py-1" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min="0" step="0.1" value={item.quantity} onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })} className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-navy-600 focus:border-teal-500 outline-none py-1 text-right" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(index, { unitPrice: Number(event.target.value) })} className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-navy-600 focus:border-teal-500 outline-none py-1 text-right" />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-navy-800 dark:text-white">{fmt.format(item.quantity * item.unitPrice)}</td>
                        <td className="px-2 py-3">
                          <button onClick={() => removeItem(index)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={14} className="text-red-500" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-4 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Notizen</label>
                  <textarea value={editor.notes} onChange={(event) => updateEditor({ notes: event.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-silver-500 mb-2">Footer Notiz</label>
                  <input value={editor.footerNote} onChange={(event) => updateEditor({ footerNote: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900/40 text-sm" />
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 dark:bg-navy-900/40 border border-gray-200 dark:border-navy-700 p-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-silver-600 dark:text-silver-400">Netto</span><span className="font-medium">{fmt.format(totals.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-silver-600 dark:text-silver-400">MwSt. ({editor.taxRate}%)</span><span className="font-medium">{fmt.format(totals.taxAmount)}</span></div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-navy-700"><span className="text-base font-bold text-navy-800 dark:text-white">Gesamt</span><span className="text-lg font-bold text-teal-600">{fmt.format(totals.totalAmount)}</span></div>
                <div className="pt-3 border-t border-gray-200 dark:border-navy-700 text-xs text-silver-500">
                  {editor.id ? (
                    <div className="space-y-2">
                      <p><strong>Status:</strong> {statusLabels[editor.status]}</p>
                      <p><strong>Versand:</strong> {documents.find((doc) => doc.id === editor.id)?.sentAt ? new Date(documents.find((doc) => doc.id === editor.id)!.sentAt!).toLocaleString("de-DE") : "Noch nicht gesendet"}</p>
                    </div>
                  ) : (
                    <p>Speichern Sie das Dokument, um PDF-Vorschau und Versand zu aktivieren.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800/60 rounded-3xl border border-gray-100 dark:border-navy-700/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-navy-800 dark:text-white flex items-center gap-2"><Mail size={16} className="text-teal-500" />PDF Vorschau</h3>
              {editor.id && <a href={`/api/admin/dokumente/${editor.id}/pdf`} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline">Im neuen Tab öffnen</a>}
            </div>
            {editor.id ? (
              <iframe title="manual-document-pdf" src={`/api/admin/dokumente/${editor.id}/pdf`} className="w-full h-[520px] rounded-2xl border border-gray-200 dark:border-navy-700 bg-white" />
            ) : (
              <div className="h-[520px] rounded-2xl border border-dashed border-gray-300 dark:border-navy-700 flex items-center justify-center text-sm text-silver-500">PDF-Vorschau erscheint nach dem ersten Speichern.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
