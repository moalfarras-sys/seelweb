"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { CookieSettingsButton } from "@/components/layout/CookieBanner";
import { useSiteContent } from "@/components/SiteContentProvider";
import { LogoImage } from "@/components/layout/Navbar";

function buildWhatsappUrl(number: string) {
  return `https://wa.me/${number}`;
}

export default function Footer() {
  const { company, contact } = useSiteContent();
  const addressLines = [company.addressLine1, company.addressLine2, `${company.city}, ${company.country}`].filter(Boolean);

  return (
    <footer className="relative z-10 overflow-hidden bg-brand-navy text-text-on-dark">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-brand-teal/5 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-teal/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <LogoImage size={48} />
              <div>
                <p className="font-display text-xl font-bold tracking-wide">SEEL</p>
                <p className="text-[0.62rem] uppercase tracking-[0.35em] text-text-on-dark-muted">Transport & Reinigung</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-text-on-dark-muted">
              Strukturierte Einsätze für Umzug, Reinigung und Entrümpelung in {contact.serviceRegion}.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href={`tel:${contact.primaryPhone}`} className="inline-flex items-center gap-2 rounded-button border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text-on-dark transition hover:bg-white/10 hover:text-brand-teal">
                <Phone size={14} />
                {contact.primaryPhoneDisplay}
              </a>
              <a
                href={buildWhatsappUrl(contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-button border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text-on-dark transition hover:bg-white/10 hover:text-brand-teal"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-text-on-dark">Leistungen</h3>
            <div className="mt-4 space-y-2.5 text-sm text-text-on-dark-muted">
              <Link href="/leistungen/umzug-berlin" className="block transition hover:text-brand-teal">Umzugsfirma Berlin</Link>
              <Link href="/leistungen/privatumzug" className="block transition hover:text-brand-teal">Privatumzug</Link>
              <Link href="/leistungen/firmenumzug" className="block transition hover:text-brand-teal">Firmenumzug</Link>
              <Link href="/leistungen/schulumzug" className="block transition hover:text-brand-teal">Schulumzug</Link>
              <Link href="/leistungen/reinigung" className="block transition hover:text-brand-teal">Reinigung</Link>
              <Link href="/leistungen/entruempelung" className="block transition hover:text-brand-teal">Entrümpelung</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-text-on-dark">Schnellzugriff</h3>
            <div className="mt-4 space-y-2.5 text-sm text-text-on-dark-muted">
              <Link href="/buchen" className="block transition hover:text-brand-teal">Preise & Buchen</Link>
              <Link href="/unternehmen" className="block transition hover:text-brand-teal">Unternehmen</Link>
              <Link href="/kontakt" className="block transition hover:text-brand-teal">Kontakt</Link>
              <Link href="/impressum" className="block transition hover:text-brand-teal">Impressum</Link>
              <Link href="/datenschutz" className="block transition hover:text-brand-teal">Datenschutz</Link>
              <Link href="/agb" className="block transition hover:text-brand-teal">AGB</Link>
              <CookieSettingsButton />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-text-on-dark">Kontakt</h3>
            <div className="mt-4 space-y-3 text-sm text-text-on-dark-muted">
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
                <Clock size={16} className="mt-0.5 shrink-0 text-brand-teal" />
                <span>{contact.availability}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-text-on-dark-muted md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>&copy; {new Date().getFullYear()} {company.name}. Alle Rechte vorbehalten.</p>
            {company.vatId ? <p className="text-xs text-white/30">USt-IdNr.: {company.vatId}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/agb" className="transition hover:text-brand-teal">AGB</Link>
            <Link href="/impressum" className="transition hover:text-brand-teal">Impressum</Link>
            <Link href="/datenschutz" className="transition hover:text-brand-teal">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
