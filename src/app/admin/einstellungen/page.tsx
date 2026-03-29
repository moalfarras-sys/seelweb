"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Shield,
  Star,
  BadgeCheck,
  Loader2,
  CheckCircle,
  RefreshCw,
  Mail,
  Bell,
  Building2,
  Phone,
  CreditCard,
} from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors";

const readOnlyClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-navy-700 bg-gray-50 dark:bg-navy-800/30 text-navy-600 dark:text-silver-400 text-sm cursor-default outline-none";

type SettingsData = {
  company: {
    name: string;
    address: string;
    city: string;
    country: string;
    vatId: string;
    taxNo: string;
    registerCourt: string;
    registerNo: string;
  };
  contact: {
    primaryPhoneDisplay: string;
    secondaryPhoneDisplay: string;
    email: string;
    websiteUrl: string;
    websiteDisplay: string;
    availability: string;
  };
  bank: {
    name: string;
    iban: string;
    bic: string;
    accountHolder: string;
  };
  trustBadges: {
    badge1: string;
    badge2: string;
    badge3: string;
  };
  googlePlaceId: string;
};

type ReviewsData = {
  rating: number;
  totalReviews: number;
  fetchedAt: string;
} | null;

export default function EinstellungenPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [reviews, setReviews] = useState<ReviewsData>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [refreshingReviews, setRefreshingReviews] = useState(false);

  const [badge1, setBadge1] = useState("");
  const [badge2, setBadge2] = useState("");
  const [badge3, setBadge3] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error();
      const data: SettingsData = await res.json();
      setSettings(data);
      setBadge1(data.trustBadges?.badge1 || "");
      setBadge2(data.trustBadges?.badge2 || "");
      setBadge3(data.trustBadges?.badge3 || "");
    } catch {
      /* settings unavailable */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/google-reviews");
      if (res.ok) setReviews(await res.json());
    } catch {
      /* reviews unavailable */
    }
  }, []);

  useEffect(() => {
    loadSettings();
    loadReviews();
  }, [loadSettings, loadReviews]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trustBadges: { badge1, badge2, badge3 } }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* save failed */
    } finally {
      setSaving(false);
    }
  }

  async function handleRefreshReviews() {
    setRefreshingReviews(true);
    try {
      const res = await fetch("/api/admin/google-reviews", { method: "POST" });
      if (res.ok) setReviews(await res.json());
    } catch {
      /* refresh failed */
    }
    setRefreshingReviews(false);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-silver-500 dark:text-silver-400 py-12 justify-center">
        <Loader2 size={20} className="animate-spin" />
        Einstellungen werden geladen…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">
            Einstellungen
          </h1>
          <p className="text-silver-500 dark:text-silver-400 text-sm">
            Systemkonfiguration und Firmendaten
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-semibold shadow-lg transition-all disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : saved ? (
            <CheckCircle size={18} />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Speichern…" : saved ? "Gespeichert!" : "Speichern"}
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* ── Firmendaten ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            Firmendaten
          </h2>
          <p className="text-xs text-silver-400 dark:text-silver-500 mb-4">
            Aus der Konfiguration – Änderungen erfordern Code-Anpassung
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                Firmenname
              </label>
              <input
                readOnly
                value={settings?.company.name || ""}
                className={readOnlyClass}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Adresse
                </label>
                <input
                  readOnly
                  value={settings?.company.address || ""}
                  className={readOnlyClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Stadt / Land
                </label>
                <input
                  readOnly
                  value={
                    settings
                      ? `${settings.company.city}, ${settings.company.country}`
                      : ""
                  }
                  className={readOnlyClass}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  USt-IdNr.
                </label>
                <input
                  readOnly
                  value={settings?.company.vatId || ""}
                  className={readOnlyClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Steuernummer
                </label>
                <input
                  readOnly
                  value={settings?.company.taxNo || ""}
                  className={readOnlyClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Kontaktdaten ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Phone size={16} className="text-white" />
            </div>
            Kontaktdaten
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Telefon 1
                </label>
                <input
                  readOnly
                  value={settings?.contact.primaryPhoneDisplay || ""}
                  className={readOnlyClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Telefon 2 (WhatsApp)
                </label>
                <input
                  readOnly
                  value={settings?.contact.secondaryPhoneDisplay || ""}
                  className={readOnlyClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                E-Mail
              </label>
              <input
                readOnly
                value={settings?.contact.email || ""}
                className={readOnlyClass}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Website
                </label>
                <input
                  readOnly
                  value={settings?.contact.websiteUrl || ""}
                  className={readOnlyClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Erreichbarkeit
                </label>
                <input
                  readOnly
                  value={settings?.contact.availability || ""}
                  className={readOnlyClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bankverbindung ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <CreditCard size={16} className="text-white" />
            </div>
            Bankverbindung
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Bank
                </label>
                <input
                  readOnly
                  value={settings?.bank.name || ""}
                  className={readOnlyClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Kontoinhaber
                </label>
                <input
                  readOnly
                  value={settings?.bank.accountHolder || ""}
                  className={readOnlyClass}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  IBAN
                </label>
                <input
                  readOnly
                  value={settings?.bank.iban || ""}
                  className={readOnlyClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  BIC
                </label>
                <input
                  readOnly
                  value={settings?.bank.bic || ""}
                  className={readOnlyClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Vertrauensabzeichen (editable) ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BadgeCheck size={16} className="text-white" />
            </div>
            Vertrauensabzeichen
          </h2>
          <p className="text-xs text-silver-400 dark:text-silver-500 mb-4">
            Texte, die auf der Website als Trust-Badges angezeigt werden
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                Badge 1
              </label>
              <input
                value={badge1}
                onChange={(e) => setBadge1(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                Badge 2
              </label>
              <input
                value={badge2}
                onChange={(e) => setBadge2(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                Badge 3
              </label>
              <input
                value={badge3}
                onChange={(e) => setBadge3(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── Google Bewertungen ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
              <Star size={16} className="text-white" />
            </div>
            Google Bewertungen
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                Google Place ID
              </label>
              <input
                readOnly
                value={settings?.googlePlaceId || "Nicht konfiguriert"}
                className={readOnlyClass}
              />
              <p className="text-xs text-silver-400 dark:text-silver-500 mt-1">
                Wird über die Umgebungsvariable GOOGLE_PLACE_ID gesetzt
              </p>
            </div>

            {reviews ? (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-navy-700/50 bg-gray-50/80 dark:bg-navy-800/40 p-4 text-center">
                  <p className="text-2xl font-bold text-navy-800 dark:text-white">
                    {reviews.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-silver-500 mt-1">Bewertung</p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-navy-700/50 bg-gray-50/80 dark:bg-navy-800/40 p-4 text-center">
                  <p className="text-2xl font-bold text-navy-800 dark:text-white">
                    {reviews.totalReviews}
                  </p>
                  <p className="text-xs text-silver-500 mt-1">Bewertungen</p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-navy-700/50 bg-gray-50/80 dark:bg-navy-800/40 p-4 text-center">
                  <p className="text-sm font-medium text-navy-800 dark:text-white">
                    {new Date(reviews.fetchedAt).toLocaleString("de-DE")}
                  </p>
                  <p className="text-xs text-silver-500 mt-1">Letzter Abruf</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-silver-500 dark:text-silver-400">
                Keine Bewertungsdaten verfügbar.
              </p>
            )}

            <button
              onClick={handleRefreshReviews}
              disabled={refreshingReviews}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 text-sm font-medium text-navy-700 dark:text-silver-200 hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshingReviews ? "animate-spin" : ""}
              />
              {refreshingReviews
                ? "Wird aktualisiert…"
                : "Bewertungen aktualisieren"}
            </button>
          </div>
        </div>

        {/* ── Benachrichtigungen ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Bell size={16} className="text-white" />
            </div>
            Benachrichtigungen
          </h2>
          <div className="space-y-2">
            {[
              "E-Mail bei neuer Buchung",
              "E-Mail bei neuer Ausschreibung",
              "E-Mail bei Zahlung eingegangen",
              "Tägliche Zusammenfassung",
            ].map((label) => (
              <label
                key={label}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-navy-700 dark:text-silver-200">
                  {label}
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 dark:border-navy-600 text-teal-600 focus:ring-teal-500 bg-white dark:bg-navy-800"
                />
              </label>
            ))}
          </div>
        </div>

        {/* ── SMTP ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Mail size={16} className="text-white" />
            </div>
            E-Mail-Einstellungen (SMTP)
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  SMTP Host
                </label>
                <input
                  defaultValue="smtp.example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  SMTP Port
                </label>
                <input defaultValue="587" className={inputClass} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Benutzername
                </label>
                <input
                  defaultValue="info@seeltransport.de"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                  Passwort
                </label>
                <input
                  type="password"
                  defaultValue="********"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Sicherheit ── */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            Sicherheit
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">
                Admin-Passwort ändern
              </label>
              <input
                type="password"
                placeholder="Neues Passwort"
                className={`${inputClass} placeholder:text-silver-400 dark:placeholder:text-silver-600`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Passwort bestätigen"
                className={`${inputClass} placeholder:text-silver-400 dark:placeholder:text-silver-600`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
