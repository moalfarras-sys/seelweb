"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";

interface CheckResult {
  name: string;
  ok: boolean;
  message: string;
  durationMs: number;
}

interface HealthData {
  ok: boolean;
  checks: CheckResult[];
  timestamp: string;
}

export default function GesundheitPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Systemstatus</h1>
          <p className="text-silver-500 dark:text-silver-400 text-sm mt-1">
            Überprüfung aller Systemkomponenten
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 disabled:opacity-50 transition-all"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Neu prüfen
        </button>
      </div>

      {data && (
        <div className={`rounded-2xl border p-6 ${
          data.ok
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}>
          <div className="flex items-center gap-3">
            {data.ok ? (
              <CheckCircle2 size={28} className="text-emerald-600" />
            ) : (
              <XCircle size={28} className="text-red-600" />
            )}
            <div>
              <p className={`font-bold text-lg ${data.ok ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"}`}>
                {data.ok ? "Alle Systeme betriebsbereit" : "Probleme erkannt"}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Letzte Prüfung: {new Date(data.timestamp).toLocaleString("de-DE")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {data?.checks.map((check) => (
          <div
            key={check.name}
            className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 p-5 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              check.ok
                ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"
            }`}>
              {check.ok ? (
                <CheckCircle2 size={20} className="text-emerald-600" />
              ) : (
                <XCircle size={20} className="text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-800 dark:text-white">{check.name}</p>
              <p className="text-sm text-silver-500 dark:text-silver-400 truncate">{check.message}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-silver-400">
              <Clock size={12} />
              {check.durationMs} ms
            </div>
          </div>
        ))}
      </div>

      {loading && !data && (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-teal-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-silver-500 dark:text-silver-400">Systeme werden geprüft...</p>
        </div>
      )}
    </div>
  );
}
