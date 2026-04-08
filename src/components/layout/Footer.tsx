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
    <footer className="relative z-10 overflow-hidden bg-brand-navy text-text-on-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,197,160,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(201,168,76,0.12),transparent_24%)]" />

      <div className="relative mx-auto max-w-[1200px] px-4 py-16 md:px-6 xl:px-0">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <LogoImage size={48} />
              <div>
                <p className="font-display text-xl font-bold tracking-[0.12em]">SEEL</p>
                <p className="text-[11px] uppercase tracking-[0.28em] text-text-on-dark-muted">Transport & Reinigung</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-text-on-dark-muted">
              Ihr Umzug. Unsere Präzision. Berlin-basiert, zuverlässig geplant und sauber ausgeführt.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={buildWhatsappUrl(contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill border border-white/10 px-4 py-2 text-sm text-text-on-dark-muted transition hover:text-brand-teal"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                WhatsApp
              </a>
              <a
                href={`tel:${contact.primaryPhone}`}
                className="inline-flex items-center gap-2 rounded-pill border border-white/10 px-4 py-2 text-sm text-text-on-dark-muted transition hover:text-brand-teal"
              >
                <Phone size={14} />
                Anrufen
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.24em] text-text-on-dark">Leistungen</h3>
            <div className="mt-4 space-y-3 text-sm text-text-on-dark-muted">
              {SERVICE_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block transition hover:text-brand-teal">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.24em] text-text-on-dark">Schnellzugriff</h3>
            <div className="mt-4 space-y-3 text-sm text-text-on-dark-muted">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block transition hover:text-brand-teal">
                  {link.label}
                </Link>
              ))}
              <CookieSettingsButton />
            </div>
          </div>

          <div>
            <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.24em] text-text-on-dark">Kontakt</h3>
            <div className="mt-4 space-y-4 text-sm text-text-on-dark-muted">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-teal" />
                <div className="space-y-0.5">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <a href={`tel:${contact.primaryPhone}`} className="flex items-center gap-3 transition hover:text-brand-teal">
                <Phone size={16} className="shrink-0 text-brand-teal" />
                {contact.primaryPhoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition hover:text-brand-teal">
                <Mail size={16} className="shrink-0 text-brand-teal" />
                {contact.email}
              </a>
              <div className="flex items-start gap-3">
                <Clock3 size={16} className="mt-0.5 shrink-0 text-brand-teal" />
                <span>Mo–So 07:00–20:00 · Notfälle 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 text-sm text-text-on-dark-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 SEEL Transport & Reinigung · USt-IdNr.: DE454962817</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/agb" className="transition hover:text-brand-teal">
              AGB
            </Link>
            <Link href="/impressum" className="transition hover:text-brand-teal">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition hover:text-brand-teal">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
