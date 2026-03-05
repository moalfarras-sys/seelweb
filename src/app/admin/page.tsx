"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Euro,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowUpRight,
  BarChart3,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  scheduledAt: string | null;
  createdAt: string;
  customer: { id: string; name: string };
  service: { nameDe: string };
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: typeof Clock }> = {
  ANFRAGE: { label: "Anfrage", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", icon: Clock },
  ANGEBOT: { label: "Angebot", bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", icon: Clock },
  BESTAETIGT: { label: "Bestätigt", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", icon: CheckCircle2 },
  IN_BEARBEITUNG: { label: "In Bearbeitung", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", icon: Truck },
  ABGESCHLOSSEN: { label: "Abgeschlossen", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  STORNIERT: { label: "Storniert", bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", icon: AlertCircle },
};

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportingAll, setExportingAll] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, customersRes] = await Promise.all([
          fetch("/api/admin/buchungen"),
          fetch("/api/admin/kunden"),
        ]);

        if (!ordersRes.ok || !customersRes.ok) throw new Error("Fehler beim Laden");

        const ordersData: Order[] = await ordersRes.json();
        const customersData: unknown[] = await customersRes.json();

        setOrders(ordersData);
        setCustomerCount(customersData.length);
      } catch {
        setError("Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-7 w-40 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-navy-700 rounded animate-pulse mt-2" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex justify-between">
                <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-navy-700 animate-pulse" />
                <div className="w-14 h-6 rounded-full bg-gray-200 dark:bg-navy-700 animate-pulse" />
              </div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="glass-strong rounded-2xl p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-navy-700 rounded animate-pulse" />
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
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl text-sm hover:bg-teal-600 transition-colors">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  async function downloadFullExport() {
    setExportingAll(true);
    try {
      const res = await fetch("/api/admin/export/all", { method: "GET" });
      if (!res.ok) throw new Error("Export fehlgeschlagen");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seel-komplettexport-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExportingAll(false);
    }
  }

  const today = new Date().toLocaleDateString("de-DE");
  const todayOrders = orders.filter((o) => {
    const d = o.scheduledAt || o.createdAt;
    return new Date(d).toLocaleDateString("de-DE") === today;
  });

  const completedOrders = orders.filter((o) => o.status === "ABGESCHLOSSEN");
  const monthlyRevenue = completedOrders
    .filter((o) => {
      const d = new Date(o.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const avgBooking = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  const openInvoiceAmount = orders
    .filter((o) => o.status === "IN_BEARBEITUNG" || o.status === "BESTAETIGT")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const stats = [
    { label: "Buchungen heute", value: String(todayOrders.length), icon: CalendarDays, gradient: "from-blue-500 to-blue-600" },
    { label: "Umsatz (Monat)", value: fmt.format(monthlyRevenue), icon: Euro, gradient: "from-emerald-500 to-emerald-600" },
    { label: "Kunden", value: String(customerCount), icon: Users, gradient: "from-violet-500 to-violet-600" },
    { label: "Buchungen gesamt", value: String(orders.length), icon: TrendingUp, gradient: "from-teal-500 to-teal-600" },
  ];

  const recentBookings = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Dashboard</h1>
          <p className="text-silver-500 dark:text-silver-400 text-sm mt-1">Übersicht über Ihre Geschäftsaktivitäten</p>
        </div>
        <button
          onClick={downloadFullExport}
          disabled={exportingAll}
          className="px-4 py-2 rounded-xl bg-navy-800 dark:bg-navy-700 text-white text-sm font-medium hover:bg-navy-900 dark:hover:bg-navy-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Download size={15} />
          {exportingAll ? "Export..." : "Alle Daten exportieren"}
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-6 group cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", stat.gradient)}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <ArrowUpRight size={12} />
                </span>
              </div>
              <p className="text-3xl font-bold text-navy-800 dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-silver-500 dark:text-silver-400 mt-1.5 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {(["ANFRAGE", "BESTAETIGT", "IN_BEARBEITUNG", "ABGESCHLOSSEN"] as const).map((status) => {
          const config = statusConfig[status];
          const count = orders.filter((b) => b.status === status).length;
          const Icon = config.icon;
          return (
            <div key={status} className="glass rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bg)}>
                  <Icon size={16} className={config.text} />
                </div>
                <span className="text-sm font-semibold text-navy-800 dark:text-white">{config.label}</span>
              </div>
              <p className="text-4xl font-bold text-navy-800 dark:text-white">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-800 dark:text-white">Umsatzübersicht</h3>
            <p className="text-xs text-silver-500 dark:text-silver-400">Gesamtübersicht</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-silver-500 dark:text-silver-400">Gesamtumsatz</p>
            <p className="text-2xl font-bold text-navy-800 dark:text-white mt-1">{fmt.format(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-silver-500 dark:text-silver-400">Durchschn. Buchung</p>
            <p className="text-2xl font-bold text-navy-800 dark:text-white mt-1">{fmt.format(avgBooking)}</p>
          </div>
          <div>
            <p className="text-sm text-silver-500 dark:text-silver-400">Offene Buchungen</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{fmt.format(openInvoiceAmount)}</p>
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 dark:border-navy-700/50">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white">Letzte Buchungen</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-700/50">
                <th className="text-left text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4">Buchungsnr.</th>
                <th className="text-left text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4">Kunde</th>
                <th className="text-left text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4">Service</th>
                <th className="text-left text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4">Datum</th>
                <th className="text-left text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-silver-500 dark:text-silver-400 uppercase tracking-wider px-6 py-4">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((order) => {
                const config = statusConfig[order.status] || statusConfig.ANFRAGE;
                const Icon = config.icon;
                return (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-navy-800/30 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-teal-600 dark:text-teal-400 font-semibold">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-800 dark:text-white">{order.customer.name}</td>
                    <td className="px-6 py-4 text-sm text-silver-600 dark:text-silver-300">{order.service?.nameDe || "-"}</td>
                    <td className="px-6 py-4 text-sm text-silver-600 dark:text-silver-300">{new Date(order.scheduledAt || order.createdAt).toLocaleDateString("de-DE")}</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", config.bg, config.text)}>
                        <Icon size={12} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-navy-800 dark:text-white text-right">{fmt.format(order.totalPrice)}</td>
                  </tr>
                );
              })}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-silver-500 dark:text-silver-400">Keine Buchungen vorhanden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

