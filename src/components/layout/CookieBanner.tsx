"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Cookie } from "lucide-react";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: ConsentState = { necessary: true, analytics: false, marketing: false };

export function getCookieConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cookie-consent");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = getCookieConsent();
    if (!stored) {
      setShow(true);
    }
  }, []);

  const saveConsent = (c: ConsentState) => {
    localStorage.setItem("cookie-consent", JSON.stringify(c));
    setShow(false);
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const declineAll = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => saveConsent(consent);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y : 100, opacity: 0 }} animate={{ y : 0, opacity: 1 }} exit={{ y : 100, opacity: 0 }} transition={{ duration : 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-[60] glass-strong p-4 md:p-6 border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-navy-800 dark:text-white font-medium mb-1 flex items-center gap-2">
                  <Cookie size={16} className="text-teal-500" />
                  Cookie-Einstellungen
                </p>
                <p className="text-xs text-silver-600 dark:text-silver-200">
                  Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
                  Weitere Informationen finden Sie in unserer{" "}
                  <Link href="/datenschutz" className="text-teal-600 dark:text-teal-400 underline">
                    Datenschutzerklärung
                  </Link>.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 text-sm border border-silver-300 dark:border-navy-600 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors text-navy-700 dark:text-silver-200 flex items-center gap-1.5"
                >
                  <Settings size={14} />
                  Einstellungen
                </button>
                <button
                  onClick={declineAll}
                  className="px-4 py-2 text-sm border border-silver-300 dark:border-navy-600 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors text-navy-700 dark:text-silver-200"
                >
                  Ablehnen
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all font-medium shadow-md shadow-teal-500/25 btn-shine"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div initial={{ height : 0, opacity: 0 }} animate={{ height : "auto", opacity: 1 }} exit={{ height : 0, opacity: 0 }} transition={{ duration : 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-navy-700 space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked disabled className="w-4 h-4 rounded text-teal-500" />
                      <div>
                        <span className="text-sm font-medium text-navy-800 dark:text-white">Notwendig</span>
                        <p className="text-xs text-silver-500 dark:text-silver-300">Erforderlich für die grundlegende Funktionalität der Website.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.analytics} onChange={(e) => setConsent({ ...consent, analytics : e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 dark:border-navy-600 text-teal-500 focus:ring-teal-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-navy-800 dark:text-white">Analyse</span>
                        <p className="text-xs text-silver-500 dark:text-silver-300">Hilft uns zu verstehen, wie Besucher die Website nutzen.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.marketing} onChange={(e) => setConsent({ ...consent, marketing : e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 dark:border-navy-600 text-teal-500 focus:ring-teal-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-navy-800 dark:text-white">Marketing</span>
                        <p className="text-xs text-silver-500 dark:text-silver-300">Ermöglicht personalisierte Werbung und Inhalte.</p>
                      </div>
                    </label>
                    <button
                      onClick={saveCustom}
                      className="px-6 py-2 text-sm bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all font-medium"
                    >
                      Auswahl speichern
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton() {
  const reopenBanner = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <button onClick={reopenBanner} className="text-silver-400 hover:text-teal-400 transition-colors text-sm">
      Cookie-Einstellungen
    </button>
  );
}
