"use client";

import { useSiteContent } from "@/components/SiteContentProvider";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

function buildWhatsappUrl(number: string) {
  const message = encodeURIComponent("Hallo, ich möchte ein Angebot für SEEL Transport & Reinigung anfragen.");
  return `https://wa.me/${number}?text=${message}`;
}

export default function WhatsAppButton() {
  const { contact } = useSiteContent();

  return (
    <a
      href={buildWhatsappUrl(contact.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp öffnen"
      className="group fixed bottom-6 right-4 z-50 inline-flex items-center gap-3 md:right-6"
    >
      <span className="hidden rounded-pill bg-brand-navy px-3 py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:inline-flex md:-translate-x-2">
        WhatsApp
      </span>
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110">
        <span className="animate-pulse-glow absolute inset-0 rounded-full border-2 border-[#25D366]/35" />
        <WhatsAppIcon className="relative h-7 w-7 fill-current" />
      </span>
    </a>
  );
}
