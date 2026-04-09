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
      className="group fixed bottom-5 right-4 z-50 inline-flex items-center gap-3 md:bottom-6 md:right-6"
    >
      <span className="hidden rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(5,12,22,0.9)_0%,rgba(7,15,28,0.78)_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_20px_52px_rgba(0,0,0,0.28)] backdrop-blur-2xl opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:inline-flex md:-translate-x-2">
        WhatsApp
      </span>
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_50px_rgba(37,211,102,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110">
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366]/35 animate-pulse-glow" />
        <span className="absolute inset-[-8px] rounded-full border border-[#25D366]/15" />
        <WhatsAppIcon className="relative z-10 h-7 w-7 fill-current" />
      </span>
    </a>
  );
}
