"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, Trash2, AlertCircle, Building2, Loader2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  createdAt: string;
  _count: { orders: number };
}

export default function KundenPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/kunden");
      if (!res.ok) throw new Error();
      const data: Customer[] = await res.json();
      setCustomers(data);
    } catch {
      setError("Kunden konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  } async function deleteCustomer(id: string, name: string) {
    if (!window.confirm(`Sind Sie sicher, dass Sie "${name}" löschen möchten Diese Aktion kann nicht rückgängig gemacht werden.`)) return;

    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/kunden/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Kunde konnte nicht gelöscht werden.");
        return;
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Kunde konnte nicht gelöscht werden.");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-32 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
        <div className="h-10 max-w-md bg-gray-200 dark:bg-navy-700 rounded-xl animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-navy-700 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-40 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
            </div>
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
          <button onClick={() => { setError(""); fetchCustomers(); }} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl text-sm hover:bg-teal-600 transition-colors">
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
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Kunden</h1>
          <p className="text-silver-500 dark:text-silver-400 text-sm">{customers.length} Kunden insgesamt</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kunden suchen..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 focus:border-teal-500 outline-none text-sm text-navy-800 dark:text-white"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div key={customer.id} className="bg-white dark:bg-navy-800/60 rounded-xl border border-gray-100 dark:border-navy-700/50 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-navy-600 flex items-center justify-center text-white font-bold">
                  {customer.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-navy-800 dark:text-white">{customer.name}</p>
                  <p className="text-xs text-silver-500 dark:text-silver-400">{customer._count.orders} Buchungen</p>
                </div>
              </div>
              <button
                onClick={() => deleteCustomer(customer.id, customer.name)}
                disabled={deleting === customer.id}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-silver-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Kunde löschen"
              >
                {deleting === customer.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-silver-600 dark:text-silver-400">
                <Mail size={14} className="text-silver-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-silver-600 dark:text-silver-400">
                <Phone size={14} className="text-silver-400 shrink-0" />
                {customer.phone}
              </div>
              {customer.company && (
                <div className="flex items-center gap-2 text-silver-600 dark:text-silver-400">
                  <Building2 size={14} className="text-silver-400 shrink-0" />
                  {customer.company}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-navy-700/50 flex justify-between text-sm">
              <div>
                <p className="text-silver-500 dark:text-silver-400">Buchungen</p>
                <p className="font-bold text-navy-800 dark:text-white">{customer._count.orders}</p>
              </div>
              <div className="text-right">
                <p className="text-silver-500 dark:text-silver-400">Seit</p>
                <p className="text-navy-800 dark:text-white">{new Date(customer.createdAt).toLocaleDateString("de-DE")}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-silver-500 dark:text-silver-400">
            Keine Kunden gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
