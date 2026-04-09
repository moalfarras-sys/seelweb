"use client";

import Link from "next/link";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { CookieSettingsButton } from "@/components/layout/CookieBanner";
import { LogoImage } from "@/components/layout/Navbar";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useSiteContent } from "@/components/SiteContentProvider";

const SERVICE_LINKS = [
  { href: "/leistungen/umzug-berlin", label: "Umzugsfirma Berlin" },
  { href: "/leistungen/privatumzug", label: "Privatumzug" },
  { href: "/leistungen/firmenumzug", label: "Firmenumzug" },
  { href: "/leistungen/schulumzug", label: "Schulumzug" },
  { href: "/leistungen/reinigung", label: "Reinigung" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung" },
];

const QUICK_LINKS = [
  { href: "/buchen", label: "Preise & Buchen" },
  { href: "/unternehmen", label: "Unternehmen" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/galerie", label: "Galerie" },
];

const LEGAL_LINKS = [
  { href: "/agb", label: "AGB" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

function buildWhatsappUrl(number: string) {
  return `https://wa.me/${number}`;
}

export default function Footer() {
  const { company, contact } = useSiteContent();
  const addressLines = [company.addressLine1, company.addressLine2, `${company.city}, ${company.country}`].filter(Boolean);

  return (
    <footer className="relative z-10 overflow-hidden bg-[#040915] text-text-on-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(18,215,198,0.16),transparent_26%),radial-gradient(circle_at_88%_18%,rgba(111,121,255,0.16),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(255,146,121,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_36%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

      <div className="relative mx-auto max-w-[1240px] px-4 py-16 md:px-6 xl:px-0">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.75fr_0.75fr_0.95fr]">
          <div className="page-info-card p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <LogoImage size={46} />
              <div>
                <p className="font-display text-xl font-bold tracking-[0.18em] text-white">SEEL</p>
                <p className="text-[11px] uppercase tracking-[0.34em] text-white/52">Transport & Reinigung</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/68">
              Ihr Umzug. Unsere Präzision. Premium organisiert für Berlin, Brandenburg und deutschlandweite Einsätze mit klarer Kommunikation und ruhiger Durchführung.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={buildWhatsappUrl(contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-glass gap-2 px-4 py-2.5"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                WhatsApp
              </a>
              <a
                href={`tel:${contact.primaryPhone}`}
                className="btn-secondary-glass gap-2 px-4 py-2.5"
              >
                <Phone size={14} />
                Anrufen
              </a>
            </div>
          </div>

          <div className="page-info-card p-6 text-text-on-dark">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-teal-light">Leistungen</p>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              {SERVICE_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block transition hover:text-brand-teal-light">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="page-info-card p-6 text-text-on-dark">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-teal-light">Schnellzugriff</p>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block transition hover:text-brand-teal-light">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-gold">Rechtliches</p>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                {LEGAL_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="block transition hover:text-brand-teal-light">
                    {link.label}
                  </Link>
                ))}
                <CookieSettingsButton />
              </div>
            </div>
          </div>

          <div className="page-info-card p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-teal-light">Kontakt</p>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-brand-teal-light" />
                <div className="space-y-0.5">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <a href={`tel:${contact.primaryPhone}`} className="flex items-center gap-3 transition hover:text-brand-teal-light">
                <Phone size={16} className="shrink-0 text-brand-teal-light" />
                {contact.primaryPhoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition hover:text-brand-teal-light">
                <Mail size={16} className="shrink-0 text-brand-teal-light" />
                {contact.email}
              </a>
              <div className="flex items-start gap-3">
                <Clock3 size={16} className="mt-1 shrink-0 text-brand-teal-light" />
                <span>Mo–So 07:00–20:00 · Notfälle 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 SEEL Transport & Reinigung · USt-IdNr.: DE454962817</p>
          <div className="flex flex-wrap items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-brand-teal-light">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
