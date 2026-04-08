"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function getCookieConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cookie-consent");
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      setOpen(true);
    }
  }, []);

  const saveConsent = (consent: ConsentState) => {
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-2xl sm:bottom-6"
        >
          <div className="rounded-[24px] border border-border bg-white/95 p-4 shadow-[0_18px_50px_rgba(11,22,40,0.14)] backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark-card/95">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                  <Cookie size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">Cookie-Einstellungen</p>
                  <p className="mt-1 text-xs leading-5 text-text-muted dark:text-text-on-dark-muted">
                    Wir nutzen nur die notwendigen Cookies standardmäßig. Details finden Sie in der{" "}
                    <Link href="/datenschutz" className="font-semibold text-brand-teal">
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => saveConsent({ ...DEFAULT_CONSENT, analytics: true, marketing: true })}
                  className="rounded-pill bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Alle akzeptieren
                </button>
                <button
                  type="button"
                  onClick={() => saveConsent(DEFAULT_CONSENT)}
                  className="rounded-pill border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface dark:border-border-dark dark:text-text-on-dark dark:hover:bg-surface-dark-elevated"
                >
                  Nur notwendige
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("cookie-consent");
        window.location.reload();
      }}
      className="text-left text-sm text-text-on-dark-muted transition hover:text-brand-teal"
    >
      Cookie-Einstellungen
    </button>
  );
}
