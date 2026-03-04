"use client";

import { useEffect, useState, useCallback } from "react";
import {
  TrendingUp,
  Euro,
  CalendarDays,
  AlertCircle,
  ArrowDownRight,
  Download,
  FileText,
  Calculator,
  Building2,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY_LEGAL, COMPANY_BANK } from "@/config/contact";

interface MonthlyEntry {
  month: string;
  revenue: number;
  expenses: number;
  orders: number;
}

interface ReportData {
  from: string;
  to: string;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  totalOrders: number;
  monthly: MonthlyEntry[];
}

type ActiveTab = "uebersicht" | "ustVA" | "quartalsberichte" | "jahresbericht";

const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mär", "04": "Apr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Okt", "11": "Nov", "12": "Dez",
};

function formatMonthLabel(m: string) {
  const [year, month] = m.split("-");
  return `${MONTH_LABELS[month] || month} ${year}`;
}

function defaultDates() {
  const now = new Date();
  const to = now.toISOString().slice(0, 10);
  const from = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10);
  return { from, to };
}

function getQuarterDates(year: number, q: number) {
  const startMonth = (q - 1) * 3;
  const from = new Date(year, startMonth, 1).toISOString().slice(0, 10);
  const to = new Date(year, startMonth + 3, 0).toISOString().slice(0, 10);
  return { from, to };
}

function getYearDates(year: number) {
  return {
    from: `${year}-01-01`,
    to: `${year}-12-31`,
  };
}

// ── UStVA Block ──────────────────────────────────────────────────────────────
function UStVABlock({ revenue, expenses, period }: { revenue: number; expenses: number; period: string }) {
  const netto19 = revenue / 1.19;
  const umsatzsteuer = revenue - netto19;
  const vorsteuer = expenses * 0.19; // estimated
  const zahllast = umsatzsteuer - vorsteuer;

  const printReport = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>UStVA ${period}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; margin: 30px; color: #111; }
            h1 { color: #0f2550; font-size: 18px; margin-bottom: 4px; }
            h2 { color: #0d9ea0; font-size: 14px; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
            .header { border-bottom: 2px solid #0f2550; margin-bottom: 20px; padding-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #0f2550; color: white; padding: 8px; text-align: left; }
            td { padding: 7px 8px; border-bottom: 1px solid #eee; }
            .total { background: #e8f5f5; font-weight: bold; }
            .zahllast { background: ${zahllast >= 0 ? "#fff3e0" : "#e8f5e9"}; font-weight: bold; font-size: 14px; }
            .footer { margin-top: 30px; font-size: 10px; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Umsatzsteuervoranmeldung (UStVA)</h1>
            <p><strong>Unternehmen:</strong> ${COMPANY_LEGAL.NAME}</p>
            <p><strong>USt-IdNr.:</strong> ${COMPANY_LEGAL.VAT_ID}</p>
            <p><strong>Zeitraum:</strong> ${period}</p>
            <p><strong>Erstellt:</strong> ${new Date().toLocaleDateString("de-DE")}</p>
          </div>

          <h2>Kz. 81 – Steuerpflichtige Umsätze (19%)</h2>
          <table>
            <tr><th>Position</th><th style="text-align:right">Betrag</th></tr>
            <tr><td>Gesamtumsatz (brutto)</td><td style="text-align:right">${EUR.format(revenue)}</td></tr>
            <tr><td>Nettoumsatz (19%-Umsätze) Kz. 81</td><td style="text-align:right">${EUR.format(netto19)}</td></tr>
            <tr class="total"><td>Umsatzsteuer darauf (19%) Kz. 83</td><td style="text-align:right">${EUR.format(umsatzsteuer)}</td></tr>
          </table>

          <h2>Vorsteuer – Kz. 66</h2>
          <table>
            <tr><th>Position</th><th style="text-align:right">Betrag</th></tr>
            <tr><td>Betriebsausgaben (geschätzt)</td><td style="text-align:right">${EUR.format(expenses)}</td></tr>
            <tr class="total"><td>Vorsteuer (Kz. 66 – 19%)</td><td style="text-align:right">${EUR.format(vorsteuer)}</td></tr>
          </table>

          <h2>Ergebnis</h2>
          <table>
            <tr><th>Position</th><th style="text-align:right">Betrag</th></tr>
            <tr><td>Umsatzsteuer (Kz. 83)</td><td style="text-align:right">${EUR.format(umsatzsteuer)}</td></tr>
            <tr><td>Vorsteuer (Kz. 66)</td><td style="text-align:right">- ${EUR.format(vorsteuer)}</td></tr>
            <tr class="zahllast">
              <td>${zahllast >= 0 ? "Steuerzahllast (Kz. 83)" : "Erstattungsanspruch"}</td>
              <td style="text-align:right">${EUR.format(Math.abs(zahllast))}</td>
            </tr>
          </table>

          <div class="footer">
            <p>${COMPANY_LEGAL.NAME} | USt-IdNr.: ${COMPANY_LEGAL.VAT_ID} | Steuer-Nr.: ${COMPANY_LEGAL.TAX_NO}</p>
            <p>Bankverbindung: ${COMPANY_BANK.BANK_NAME} | IBAN: ${COMPANY_BANK.IBAN} | BIC: ${COMPANY_BANK.BIC}</p>
            <p>Dieses Dokument wurde automatisch erstellt. Bitte von Ihrem Steuerberater prüfen lassen.</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-800 dark:text-white">Umsatzsteuervoranmeldung (UStVA)</h2>
          <p className="text-sm text-silver-500 dark:text-silver-400 mt-1">Zeitraum: {period}</p>
        </div>
        <button
          onClick={printReport}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20"
        >
          <Download size={16} />
          PDF / Drucken
        </button>
      </div>

      {/* Company Info */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-silver-500 dark:text-silver-400 mb-3 uppercase tracking-wider">Unternehmensdaten</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-silver-400 text-xs">Unternehmensname</p>
            <p className="font-semibold text-navy-800 dark:text-white">{COMPANY_LEGAL.NAME}</p>
          </div>
          <div>
            <p className="text-silver-400 text-xs">USt-IdNr.</p>
            <p className="font-semibold text-navy-800 dark:text-white">{COMPANY_LEGAL.VAT_ID}</p>
          </div>
          <div>
            <p className="text-silver-400 text-xs">Steuer-Nr.</p>
            <p className="font-semibold text-navy-800 dark:text-white">{COMPANY_LEGAL.TAX_NO}</p>
          </div>
        </div>
      </div>

      {/* UStVA Table */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ausgangsumsätze */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-navy-800 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center">
              <TrendingUp size={14} className="text-teal-500" />
            </div>
            Ausgangsumsätze (Kz. 81)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-silver-500 dark:text-silver-400">Gesamtumsatz (brutto)</span>
              <span className="font-semibold text-navy-800 dark:text-white">{EUR.format(revenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-silver-500 dark:text-silver-400">Nettoumsatz 19% (Kz. 81)</span>
              <span className="font-semibold text-navy-800 dark:text-white">{EUR.format(netto19)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-navy-700/50 pt-3 flex justify-between">
              <span className="text-sm font-bold text-navy-800 dark:text-white">USt. 19% (Kz. 83)</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold text-lg">{EUR.format(umsatzsteuer)}</span>
            </div>
          </div>
        </div>

        {/* Vorsteuer */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-navy-800 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <ArrowDownRight size={14} className="text-blue-500" />
            </div>
            Vorsteuer (Kz. 66)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-silver-500 dark:text-silver-400">Betriebsausgaben</span>
              <span className="font-semibold text-navy-800 dark:text-white">{EUR.format(expenses)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-silver-500 dark:text-silver-400">Vorsteuer 19%</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{EUR.format(vorsteuer)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-navy-700/50 pt-3">
              <p className="text-xs text-silver-400 italic">* Vorsteuer basiert auf gebuchten Ausgaben</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zahllast */}
      <div className={cn(
        "rounded-2xl p-6 border-2",
        zahllast >= 0
          ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
          : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-silver-600 dark:text-silver-300 mb-1">
              {zahllast >= 0 ? "Steuerzahllast (Kz. 83 – Kz. 66)" : "Erstattungsanspruch"}
            </p>
            <p className={cn("text-3xl font-bold", zahllast >= 0 ? "text-amber-700 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
              {EUR.format(Math.abs(zahllast))}
            </p>
            <p className="text-xs text-silver-500 mt-1">
              {zahllast >= 0 ? "Zu zahlen ans Finanzamt" : "Erstattung vom Finanzamt"}
            </p>
          </div>
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", zahllast >= 0 ? "bg-amber-100 dark:bg-amber-500/20" : "bg-emerald-100 dark:bg-emerald-500/20")}>
            <Calculator size={28} className={zahllast >= 0 ? "text-amber-500" : "text-emerald-500"} />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4">
        <p className="text-xs text-silver-400 leading-relaxed">
          <strong className="text-silver-500 dark:text-silver-300">Hinweis:</strong> Diese Auswertung dient als Grundlage für Ihre UStVA. Bitte prüfen Sie alle Angaben mit Ihrem Steuerberater, bevor Sie die Meldung beim Finanzamt einreichen (ELSTER-Portal: <span className="text-teal-600 dark:text-teal-400">www.elster.de</span>). Abgabefrist: 10. des Folgemonats.
        </p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BerichtePage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState(defaultDates().from);
  const [dateTo, setDateTo] = useState(defaultDates().to);
  const [activeTab, setActiveTab] = useState<ActiveTab>("uebersicht");
  const [selectedQuarter, setSelectedQuarter] = useState(Math.ceil((new Date().getMonth() + 1) / 3));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [quarterReport, setQuarterReport] = useState<ReportData | null>(null);
  const [yearReport, setYearReport] = useState<ReportData | null>(null);

  const fetchReport = useCallback(async (from: string, to: string) => {
    const res = await fetch(`/api/admin/buchhaltung/bericht?from=${from}&to=${to}`);
    if (!res.ok) throw new Error();
    return res.json() as Promise<ReportData>;
  }, []);

  const loadMain = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchReport(dateFrom, dateTo);
      setReport(data);
    } catch {
      setError("Bericht konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, fetchReport]);

  useEffect(() => { loadMain(); }, [loadMain]);

  const loadQuarter = useCallback(async () => {
    const { from, to } = getQuarterDates(selectedYear, selectedQuarter);
    const data = await fetchReport(from, to).catch(() => null);
    setQuarterReport(data);
  }, [selectedYear, selectedQuarter, fetchReport]);

  const loadYear = useCallback(async () => {
    const { from, to } = getYearDates(selectedYear);
    const data = await fetchReport(from, to).catch(() => null);
    setYearReport(data);
  }, [selectedYear, fetchReport]);

  useEffect(() => {
    if (activeTab === "quartalsberichte") loadQuarter();
    if (activeTab === "jahresbericht") loadYear();
  }, [activeTab, loadQuarter, loadYear]);

  const tabs: { key: ActiveTab; label: string; icon: typeof BarChart3 }[] = [
    { key: "uebersicht",       label: "Übersicht",        icon: BarChart3 },
    { key: "ustVA",            label: "UStVA",            icon: Calculator },
    { key: "quartalsberichte", label: "Quartalsbericht",  icon: CalendarDays },
    { key: "jahresbericht",    label: "Jahresbericht",    icon: Building2 },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 dark:bg-navy-700 rounded" />
        <div className="grid sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-navy-700 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-navy-700 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button onClick={loadMain} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl text-sm hover:bg-teal-600 transition-colors">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const maxRevenue = Math.max(...report.monthly.map((m) => m.revenue), 1);
  const avgPerOrder = report.totalOrders > 0 ? report.totalRevenue / report.totalOrders : 0;
  const ustVA_period = `${new Date(dateFrom).toLocaleDateString("de-DE")} – ${new Date(dateTo).toLocaleDateString("de-DE")}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Berichte & Steuerauswertungen</h1>
          <p className="text-silver-500 dark:text-silver-400 text-sm mt-1">Finanzübersicht, UStVA & Quartalszusammenfassung</p>
        </div>
        <a
          href="https://www.elster.de"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-teal-500/50 text-teal-600 dark:text-teal-400 rounded-xl text-sm font-medium hover:bg-teal-500/10 transition-colors"
        >
          <FileText size={16} />
          ELSTER-Portal
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === t.key
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                  : "bg-white dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700/50 text-silver-600 dark:text-silver-300 hover:border-teal-500/50"
              )}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB: Übersicht ── */}
      {activeTab === "uebersicht" && (
        <div className="space-y-8">
          {/* Date filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-silver-500 mb-1">Von</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-silver-500 mb-1">Bis</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none focus:border-teal-500" />
            </div>
            <button onClick={loadMain} className="px-5 py-2 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-colors">
              Laden
            </button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Umsatz gesamt", value: EUR.format(report.totalRevenue), icon: Euro, color: "from-teal-500 to-teal-600" },
              { label: "Ausgaben", value: EUR.format(report.totalExpenses), icon: ArrowDownRight, color: "from-red-500 to-red-600" },
              { label: "Gewinn", value: EUR.format(report.profit), icon: TrendingUp, color: report.profit >= 0 ? "from-emerald-500 to-emerald-600" : "from-red-500 to-red-600" },
              { label: "Buchungen", value: String(report.totalOrders), icon: CalendarDays, color: "from-blue-500 to-blue-600" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass-card rounded-2xl p-5">
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg", s.color)}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-navy-800 dark:text-white">{s.value}</p>
                  <p className="text-xs text-silver-500 dark:text-silver-400 mt-1">{s.label}</p>
                  {s.label === "Buchungen" && report.totalOrders > 0 && (
                    <p className="text-xs text-silver-400 mt-0.5">Ø {EUR.format(avgPerOrder)}/Buchung</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-navy-800 dark:text-white mb-6">Umsatzentwicklung</h2>
              {report.monthly.length > 0 ? (
                <div className="flex items-end gap-2 h-48">
                  {report.monthly.map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-silver-500 dark:text-silver-400">
                        {d.revenue > 0 ? `${(d.revenue / 1000).toFixed(1)}k` : ""}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all"
                        style={{ height: `${Math.max((d.revenue / maxRevenue) * 160, d.revenue > 0 ? 4 : 0)}px` }}
                      />
                      <span className="text-[10px] text-silver-500 dark:text-silver-400 truncate w-full text-center">
                        {formatMonthLabel(d.month)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-silver-400">Keine Daten im gewählten Zeitraum.</p>
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-navy-800 dark:text-white mb-6">Monatliche Übersicht</h2>
              {report.monthly.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-navy-700/50">
                        <th className="text-left text-xs font-medium text-silver-500 uppercase pb-3">Monat</th>
                        <th className="text-right text-xs font-medium text-silver-500 uppercase pb-3">Umsatz</th>
                        <th className="text-right text-xs font-medium text-silver-500 uppercase pb-3">Ausgaben</th>
                        <th className="text-right text-xs font-medium text-silver-500 uppercase pb-3">Buchungen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.monthly.map((m) => (
                        <tr key={m.month} className="border-b border-gray-50 dark:border-navy-700/30">
                          <td className="py-2.5 text-sm font-medium text-navy-800 dark:text-white">{formatMonthLabel(m.month)}</td>
                          <td className="py-2.5 text-sm text-right font-medium text-teal-600 dark:text-teal-400">{EUR.format(m.revenue)}</td>
                          <td className="py-2.5 text-sm text-right text-red-600 dark:text-red-400">{EUR.format(m.expenses)}</td>
                          <td className="py-2.5 text-sm text-right text-silver-600 dark:text-silver-400">{m.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-silver-400 py-12">Keine Daten im gewählten Zeitraum.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: UStVA ── */}
      {activeTab === "ustVA" && (
        <UStVABlock
          revenue={report.totalRevenue}
          expenses={report.totalExpenses}
          period={ustVA_period}
        />
      )}

      {/* ── TAB: Quartalsbericht ── */}
      {activeTab === "quartalsberichte" && (
        <div className="space-y-6">
          <div className="flex gap-3 flex-wrap items-end">
            <div>
              <label className="block text-xs font-medium text-silver-500 mb-1">Jahr</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none"
              >
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-silver-500 mb-1">Quartal</label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none"
              >
                <option value={1}>Q1 (Jan–Mär)</option>
                <option value={2}>Q2 (Apr–Jun)</option>
                <option value={3}>Q3 (Jul–Sep)</option>
                <option value={4}>Q4 (Okt–Dez)</option>
              </select>
            </div>
            <button onClick={loadQuarter} className="px-5 py-2 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-colors">
              Laden
            </button>
          </div>

          {quarterReport ? (
            <UStVABlock
              revenue={quarterReport.totalRevenue}
              expenses={quarterReport.totalExpenses}
              period={`Q${selectedQuarter} ${selectedYear}`}
            />
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-silver-400">Quartalsdaten werden geladen...</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Jahresbericht ── */}
      {activeTab === "jahresbericht" && (
        <div className="space-y-6">
          <div className="flex gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-silver-500 mb-1">Jahr</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800/50 text-sm text-navy-800 dark:text-white outline-none"
              >
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button onClick={loadYear} className="px-5 py-2 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-colors">
              Laden
            </button>
          </div>

          {yearReport ? (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: `Jahresumsatz ${selectedYear}`, value: EUR.format(yearReport.totalRevenue), color: "text-teal-600 dark:text-teal-400" },
                  { label: "Jahresausgaben", value: EUR.format(yearReport.totalExpenses), color: "text-red-600 dark:text-red-400" },
                  { label: "Jahresgewinn", value: EUR.format(yearReport.profit), color: yearReport.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400" },
                ].map(s => (
                  <div key={s.label} className="glass-card rounded-2xl p-5">
                    <p className="text-xs text-silver-500 dark:text-silver-400 mb-1">{s.label}</p>
                    <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                  </div>
                ))}
              </div>
              <UStVABlock
                revenue={yearReport.totalRevenue}
                expenses={yearReport.totalExpenses}
                period={`Jahresabschluss ${selectedYear}`}
              />
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-silver-400">Jahresdaten werden geladen...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
