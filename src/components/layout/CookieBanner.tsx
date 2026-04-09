"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, ShieldCheck } from "lucide-react";

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
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-4 z-[70] px-4 sm:bottom-6"
        >
          <div className="mx-auto max-w-[860px] rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(5,12,22,0.88)_0%,rgba(7,15,28,0.78)_100%)] p-4 text-white shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur-3xl sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-white/8 text-brand-teal-light">
                  <Cookie size={18} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">Cookie-Einstellungen</p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
                      <ShieldCheck size={12} />
                      Datenschutz zuerst
                    </span>
                  </div>
                  <p className="mt-2 max-w-xl text-xs leading-6 text-white/68 sm:text-sm">
                    Standardmäßig bleiben nur notwendige Cookies aktiv. Details finden Sie in der{" "}
                    <Link href="/datenschutz" className="font-semibold text-brand-teal-light">
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => saveConsent({ ...DEFAULT_CONSENT, analytics: true, marketing: true })}
                  className="btn-primary-glass px-4 py-2.5"
                >
                  Alle akzeptieren
                </button>
                <button
                  type="button"
                  onClick={() => saveConsent(DEFAULT_CONSENT)}
                  className="rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Nur notwendige
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
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
      className="text-left text-sm text-white/70 transition hover:text-brand-teal-light"
    >
      Cookie-Einstellungen
    </button>
  );
}
