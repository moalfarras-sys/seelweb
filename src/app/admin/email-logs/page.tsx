"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  Filter,
  Mail,
} from "lucide-react";

type EmailLog = {
  id: string;
  subject: string | null;
  message: string;
  direction: string;
  sentBy: string | null;
  metaJson: Record<string, unknown> | null;
  createdAt: string;
  customer: { id: string; name: string; email: string } | null;
  offer: { id: string; offerNumber: string } | null;
  contract: { id: string; contractNumber: string } | null;
};

const directionLabel: Record<string, string> = {
  OUTBOUND: "Gesendet",
  INBOUND: "Empfangen",
  INTERNAL: "Intern",
};

const directionBadge: Record<string, string> = {
  OUTBOUND:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  INBOUND:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
  INTERNAL:
    "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20",
};

function getRecipient(email: EmailLog): string {
  if (
    email.metaJson &&
    typeof email.metaJson === "object" &&
    "to" in email.metaJson
  ) {
    return email.metaJson.to as string;
  }
  return email.customer?.email || "—";
}

export default function EmailLogsPage() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const pageSize = 25;

  const loadEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/admin/email-logs?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmails(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError("E-Mail-Protokolle konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [page, dateFrom, dateTo]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-800 dark:text-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Mail size={18} className="text-white" />
          </div>
          E-Mail Protokoll
        </h1>
        <p className="mt-2 text-sm text-silver-500 dark:text-silver-400">
          Übersicht aller versendeten und empfangenen E-Mails
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-navy-700/50 dark:bg-navy-800/60">
        <div className="flex items-center gap-2 text-silver-500 self-center">
          <Filter size={16} />
          <span className="text-sm font-medium">Zeitraum:</span>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-silver-500">
            Von
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-silver-500">
            Bis
          </span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
          />
        </label>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="h-10 px-3 rounded-xl text-xs font-medium text-silver-500 hover:text-navy-800 dark:hover:text-white transition-colors"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-white px-5 py-6 text-sm text-silver-500 dark:border-navy-700/50 dark:bg-navy-800/60 dark:text-silver-400">
          <Loader2 size={16} className="animate-spin" />
          E-Mails werden geladen…
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-navy-700/50 dark:bg-navy-800/60">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[0.8fr_1.2fr_1.5fr_0.7fr_1fr] gap-3 border-b border-gray-100 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-silver-500 dark:border-navy-700/50">
              <span>Datum</span>
              <span>Empfänger</span>
              <span>Betreff</span>
              <span>Status</span>
              <span>Verknüpfung</span>
            </div>

            {/* Table body */}
            <div className="divide-y divide-gray-100 dark:divide-navy-700/50">
              {emails.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-silver-500 dark:text-silver-400">
                  Keine E-Mail-Einträge gefunden.
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    className="grid gap-3 px-5 py-4 md:grid-cols-[0.8fr_1.2fr_1.5fr_0.7fr_1fr] md:items-center"
                  >
                    {/* Datum */}
                    <div className="text-sm text-navy-700 dark:text-silver-200">
                      {new Date(email.createdAt).toLocaleDateString("de-DE")}
                      <span className="block text-xs text-silver-400 mt-0.5">
                        {new Date(email.createdAt).toLocaleTimeString("de-DE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Empfänger */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-800 dark:text-white truncate">
                        {getRecipient(email)}
                      </p>
                      {email.customer && (
                        <p className="text-xs text-silver-500 mt-0.5 truncate">
                          {email.customer.name}
                        </p>
                      )}
                    </div>

                    {/* Betreff */}
                    <p className="text-sm text-navy-700 dark:text-silver-200 truncate">
                      {email.subject || "—"}
                    </p>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          directionBadge[email.direction] ||
                          directionBadge.OUTBOUND
                        }`}
                      >
                        {directionLabel[email.direction] || email.direction}
                      </span>
                    </div>

                    {/* Verknüpfung */}
                    <div className="flex flex-wrap gap-1.5">
                      {email.offer && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                          <ExternalLink size={10} />
                          {email.offer.offerNumber}
                        </span>
                      )}
                      {email.contract && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <ExternalLink size={10} />
                          {email.contract.contractNumber}
                        </span>
                      )}
                      {!email.offer && !email.contract && (
                        <span className="text-xs text-silver-400">—</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white px-5 py-4 text-sm dark:border-navy-700/50 dark:bg-navy-800/60">
            <p className="text-silver-500 dark:text-silver-400">
              Seite {page} von {totalPages} · {total} Einträge
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 disabled:opacity-50 dark:border-navy-700"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 disabled:opacity-50 dark:border-navy-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
