"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OfferPayload = {
  offerNumber: string;
  status: string;
  validUntil: string;
  subtotal: number;
  discountAmount: number;
  extraFees: number;
  netto: number;
  mwst: number;
  totalPrice: number;
  customer: { name: string; email: string };
  order: {
    serviceName: string;
    scheduledAt: string | null;
    timeSlot: string | null;
    fromAddress: string | null;
    toAddress: string | null;
  };
  items: Array<{
    id: string;
    title: string;
    description: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  contractToken: string | null;
};

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function AngebotPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [offer, setOffer] = useState<OfferPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/angebot/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Angebot nicht gefunden");
        }
        return res.json();
      })
      .then((data) => setOffer(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const isExpired = useMemo(() => {
    if (!offer) return false;
    return new Date(offer.validUntil) < new Date();
  }, [offer]);

  const canAccept = useMemo(
    () => offer && !isExpired && (offer.status === "APPROVED" || offer.status === "MODIFIED"),
    [offer, isExpired]
  );

  const statusLabel = useMemo(() => {
    if (!offer) return "";
    switch (offer.status) {
      case "PENDING": return "In Prüfung";
      case "MODIFIED": return "Überarbeitet";
      case "APPROVED": return "Freigegeben";
      case "REJECTED": return "Abgelehnt";
      case "EXPIRED": return "Abgelaufen";
      case "ACCEPTED": return "Angenommen";
      default: return offer.status;
    }
  }, [offer]);

  async function acceptOffer() {
    if (!offer) return;
    if (offer.status === "ACCEPTED" && offer.contractToken) {
      router.push(`/vertrag/${offer.contractToken}`);
      return;
    }
    setAccepting(true);
    setError("");
    try {
      const res = await fetch(`/api/angebot/${token}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Annahme fehlgeschlagen");
      router.push(`/vertrag/${data.contractToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Annahme fehlgeschlagen");
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-teal-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8 max-w-md w-full text-center text-red-600 dark:text-red-400">{error || "Angebot nicht gefunden"}</div>
      </div>
    );
  }

  if (!offer) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 overflow-hidden shadow-lg">
        <div className="bg-[#0f2550] text-white px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">Angebot {offer.offerNumber}</h1>
              <p className="text-sm text-slate-200">Gültig bis {new Date(offer.validUntil).toLocaleDateString("de-DE")}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              offer.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-300" :               offer.status === "REJECTED" ? "bg-red-500/20 text-red-300" :               offer.status === "ACCEPTED" ? "bg-blue-500/20 text-blue-300" :               "bg-white/10 text-white"
            }`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {isExpired && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-8 py-3">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Dieses Angebot ist abgelaufen. Bitte kontaktieren Sie uns für ein aktualisiertes Angebot.</p>
          </div>
        )}

        {offer.status === "PENDING" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-8 py-3">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Ihr Angebot wird geprüft und in Kürze freigegeben. Sie erhalten eine Benachrichtigung per E-Mail.</p>
          </div>
        )}

        {offer.status === "REJECTED" && (
          <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-8 py-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Dieses Angebot wurde abgelehnt. Bitte kontaktieren Sie uns für weitere Informationen.</p>
          </div>
        )}

        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border dark:border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Kunde</p>
              <p className="font-semibold text-slate-800 dark:text-white">{offer.customer.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{offer.customer.email}</p>
            </div>
            <div className="rounded-xl border dark:border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Leistung</p>
              <p className="font-semibold text-slate-800 dark:text-white">{offer.order.serviceName}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {offer.order.scheduledAt ? new Date(offer.order.scheduledAt).toLocaleDateString("de-DE") : "-"}
{offer.order.timeSlot ? `, ${offer.order.timeSlot}` : ""}
              </p>
            </div>
          </div>

          <div className="rounded-xl border dark:border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="text-left p-3 text-slate-700 dark:text-slate-200">Position</th>
                  <th className="text-right p-3 text-slate-700 dark:text-slate-200">Menge</th>
                  <th className="text-right p-3 text-slate-700 dark:text-slate-200">Preis</th>
                  <th className="text-right p-3 text-slate-700 dark:text-slate-200">Gesamt</th>
                </tr>
              </thead>
              <tbody>
                {offer.items.map((item) => (
                  <tr key={item.id} className="border-t dark:border-slate-700">
                    <td className="p-3">
                      <p className="font-medium text-slate-800 dark:text-white">{item.title}</p>
                      {item.description && <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>}
                    </td>
                    <td className="p-3 text-right text-slate-700 dark:text-slate-300">{item.quantity}</td>
                    <td className="p-3 text-right text-slate-700 dark:text-slate-300">{fmt.format(item.unitPrice)}</td>
                    <td className="p-3 text-right font-medium text-slate-800 dark:text-white">{fmt.format(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto max-w-sm rounded-xl border dark:border-slate-700 p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300"><span>Zwischensumme</span><span>{fmt.format(offer.subtotal)}</span></div>
            {offer.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600"><span>Rabatt</span><span>-{fmt.format(offer.discountAmount)}</span></div>
            )}
            {offer.extraFees > 0 && (
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300"><span>Gebühren</span><span>{fmt.format(offer.extraFees)}</span></div>
            )}
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300"><span>Netto</span><span>{fmt.format(offer.netto)}</span></div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300"><span>MwSt.</span><span>{fmt.format(offer.mwst)}</span></div>
            <div className="pt-2 border-t dark:border-slate-700 flex justify-between font-bold text-lg text-slate-800 dark:text-white"><span>Gesamt</span><span>{fmt.format(offer.totalPrice)}</span></div>
          </div>

          <div className="rounded-xl bg-slate-100 dark:bg-slate-700 p-4 text-sm text-slate-700 dark:text-slate-200">
            Mit Annahme gelangen Sie zum finalen Vertrag inklusive AGB-Bestätigung und digitaler Signatur.
          </div>

          {error && <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 text-sm">{error}</div>}

          <div className="flex flex-wrap gap-3">
            {(offer.status === "APPROVED" || offer.status === "ACCEPTED" || offer.status === "MODIFIED") && (
              <>
                <a
                  href={`/api/angebot/${token}/pdf?download=1`}
                  className="px-4 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-all"
                >
                  Download Offer (PDF)
                </a>
                <a
                  href={`/api/angebot/${token}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  PDF-Vorschau
                </a>
              </>
            )}
            {canAccept && (
              <button
                onClick={acceptOffer}
                disabled={accepting}
                className="px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-all"
              >
                {accepting ? "Wird verarbeitet..." : "Angebot annehmen"}
              </button>
            )}
            {offer.status === "ACCEPTED" && offer.contractToken && (
              <button
                onClick={() => router.push(`/vertrag/${offer.contractToken}`)}
                className="px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-all"
              >
                Zum Vertrag
              </button>
            )}
            <a
              href="/kontakt"
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              Rückfrage stellen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
