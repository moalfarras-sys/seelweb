"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { whatsappUrl } from "@/config/contact";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("whatsapp-tooltip-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem("whatsapp-tooltip-dismissed", "true");
  };

  useEffect(() => {
    if (!showTooltip) return;
    const autoHide = setTimeout(dismissTooltip, 8000);
    return () => clearTimeout(autoHide);
  }, [showTooltip]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div initial={{ opacity : 0, x: 20, scale: 0.9 }} animate={{ opacity : 1, x: 0, scale: 1 }} exit={{ opacity : 0, x: 20, scale: 0.9 }} transition={{ duration : 0.3 }}
            className="glass rounded-2xl shadow-xl p-4 max-w-[250px] relative"
          >
            <button
              onClick={dismissTooltip}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-navy-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-navy-600 transition-colors"
              aria-label="Schließen"
            >
              <X size={12} className="text-navy-800 dark:text-white" />
            </button>
            <p className="text-sm text-navy-800 dark:text-white font-medium">Brauchen Sie Hilfe</p>
            <p className="text-xs text-silver-600 dark:text-silver-200 mt-1">Schreiben Sie uns auf WhatsApp!</p>
          </motion.div>
        )}
      </AnimatePresence>
      <a
        href={whatsappUrl("Hallo, ich interessiere mich für Ihre Dienstleistungen.")}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
        aria-label="WhatsApp Kontakt"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}