"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-lg sm:left-auto sm:right-6 sm:bottom-6"
        >
          <div className="rounded-card border border-border bg-white p-5 shadow-lg dark:border-border-dark dark:bg-surface-dark-card">
            <div className="flex items-start gap-3">
              <Cookie size={20} className="mt-0.5 shrink-0 text-brand-teal" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">
                  Cookie-Einstellungen
                </p>
                <p className="mt-1 text-xs leading-5 text-text-muted dark:text-text-on-dark-muted">
                  Wir verwenden Cookies für die grundlegende Funktionalität.{" "}
                  <Link href="/datenschutz" className="text-brand-teal underline">Mehr erfahren</Link>
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={acceptAll}
                className="flex-1 rounded-button bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={declineAll}
                className="flex-1 rounded-button border border-border px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface dark:border-border-dark dark:text-text-on-dark dark:hover:bg-surface-dark-elevated"
              >
                Nur notwendige
              </button>
            </div>
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
    <button onClick={reopenBanner} className="text-text-on-dark-muted transition hover:text-brand-teal text-sm">
      Cookie-Einstellungen
    </button>
  );
}
