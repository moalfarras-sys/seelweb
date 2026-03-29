"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useSiteContent } from "@/components/SiteContentProvider";

function buildWhatsappUrl(number: string) {
  const message = encodeURIComponent(
    "Hallo, ich habe Ihre Website besucht und möchte ein Angebot anfragen.",
  );
  return `https://wa.me/${number}?text=${message}`;
}

export default function WhatsAppButton() {
  const { contact } = useSiteContent();
  const [openPrompt, setOpenPrompt] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("wa-mini-dismissed-v2");
    if (dismissed) return;
    const timer = setTimeout(() => setOpenPrompt(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  const closePrompt = () => {
    setOpenPrompt(false);
    localStorage.setItem("wa-mini-dismissed-v2", "1");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-end gap-3">
      <AnimatePresence>
        {openPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[300px] rounded-2xl border border-emerald-200/80 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-emerald-500/30 dark:bg-slate-900/92"
          >
            <button
              onClick={closePrompt}
              className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              aria-label="Schließen"
            >
              <X size={12} />
            </button>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Schnelle Rückfrage?</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Schreiben Sie uns direkt auf WhatsApp. Wir antworten so schnell wie möglich.
            </p>
            <a
              href={buildWhatsappUrl(contact.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <MessageCircle size={15} />
              WhatsApp öffnen
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={buildWhatsappUrl(contact.whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Chat öffnen"
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-600"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400/40 blur-md transition group-hover:bg-emerald-300/60" />
        <span className="relative">
          <WhatsAppIcon />
        </span>
      </a>
    </div>
  );
}
