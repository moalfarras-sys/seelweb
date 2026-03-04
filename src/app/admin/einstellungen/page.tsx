"use client";

import { useState } from "react";
import { Save, Bell, Mail, Shield, Globe, CheckCircle } from "lucide-react";

export default function EinstellungenPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Einstellungen</h1>
          <p className="text-silver-500 dark:text-silver-400 text-sm">Systemkonfiguration und Benachrichtigungen</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-semibold btn-shine btn-magnetic shadow-lg transition-all"
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
{saved ? "Gespeichert!" : "Speichern"}
        </button>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Company info */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Globe size={16} className="text-white" />
            </div>
            Firmendaten
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">Firmenname</label>
              <input defaultValue="Seel Transport & Reinigung" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">Telefon 1</label>
                <input defaultValue="+49 172 8003410" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">Telefon 2 (WhatsApp)</label>
                <input defaultValue="+49 160 7746966" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">E-Mail</label>
              <input defaultValue="info@seeltransport.de" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
            </div>
          </div>
        </div>

        {/* Notifications */}
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
              <label key={label} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-pointer transition-colors">
                <span className="text-sm font-medium text-navy-700 dark:text-silver-200">{label}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 dark:border-navy-600 text-teal-600 focus:ring-teal-500 bg-white dark:bg-navy-800" />
              </label>
            ))}
          </div>
        </div>

        {/* SMTP */}
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
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">SMTP Host</label>
                <input defaultValue="smtp.example.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">SMTP Port</label>
                <input defaultValue="587" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">Benutzername</label>
                <input defaultValue="info@seeltransport.de" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">Passwort</label>
                <input type="password" defaultValue="********" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-navy-800 dark:text-white mb-5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            Sicherheit
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 dark:text-silver-200 mb-1.5">Admin-Passwort ändern</label>
              <input type="password" placeholder="Neues Passwort" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white placeholder:text-silver-400 dark:placeholder:text-silver-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
            </div>
            <div>
              <input type="password" placeholder="Passwort bestätigen" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800/50 text-navy-800 dark:text-white placeholder:text-silver-400 dark:placeholder:text-silver-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
