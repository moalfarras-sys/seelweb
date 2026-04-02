"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { CookieSettingsButton } from "@/components/layout/CookieBanner";
import { useSiteContent } from "@/components/SiteContentProvider";

function buildWhatsappUrl(number: string) {
  return `https://wa.me/${number}`;
}

export default function Footer() {
  const { company, contact } = useSiteContent();
  const addressLines = [company.addressLine1, company.addressLine2, `${company.city}, ${company.country}`].filter(Boolean);

  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/[0.06] bg-[linear-gradient(180deg,rgba(2,8,16,0.97)_0%,rgba(2,6,14,1)_100%)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-sky-400/8 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/8 blur-[130px]" />
        <div className="cine-grid absolute inset-0 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[34px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(15,23,42,0.86)_0%,rgba(15,23,42,0.72)_100%)] p-8 text-white shadow-[0_28px_84px_rgba(0,0,0,0.40)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.jpeg"
                alt="SEEL Transport & Reinigung Logo"
                width={56}
                height={56}
                className="rounded-[20px] border border-white/[0.08]"
              />
              <div>
                <p className="font-display text-xl font-bold tracking-[0.12em]">SEEL</p>
                <p className="text-[0.68rem] uppercase tracking-[0.4em] text-white/60">Transport & Reinigung</p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-white/78">
              Strukturierte Einsätze für Umzug, Reinigung und Entrümpelung in {contact.serviceRegion}. Ruhig geplant,
              transparent kalkuliert und professionell umgesetzt.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`tel:${contact.primaryPhone}`} className="btn-secondary-glass border border-white/15 bg-white/10 text-white hover:bg-white/14">
                {contact.primaryPhoneDisplay}
              </a>
              <a
                href={buildWhatsappUrl(contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-premium gap-2 border-white/15 bg-white/8 text-white hover:bg-white/12"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-200/70">Kontaktfenster</p>
            <div className="mt-5 space-y-4 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-cyan-300/80" />
                <div className="space-y-1">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition hover:text-cyan-200">
                <Mail size={16} className="text-cyan-300/80" />
                {contact.email}
              </a>
              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 text-cyan-300/80" />
                <span>{contact.availability} · {contact.serviceRegion}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/82">Leistungen</h3>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <Link href="/leistungen/umzug-berlin" className="block transition hover:text-cyan-200">Umzugsfirma Berlin</Link>
              <Link href="/leistungen/privatumzug" className="block transition hover:text-cyan-200">Privatumzug</Link>
              <Link href="/leistungen/firmenumzug" className="block transition hover:text-cyan-200">Firmenumzug</Link>
              <Link href="/leistungen/schulumzug" className="block transition hover:text-cyan-200">Schulumzug</Link>
              <Link href="/leistungen/reinigung" className="block transition hover:text-cyan-200">Reinigung</Link>
              <Link href="/leistungen/entruempelung" className="block transition hover:text-cyan-200">Entrümpelung</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/82">Schnellzugriff</h3>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <Link href="/buchen" className="block transition hover:text-cyan-200">Preise & Buchen</Link>
              <Link href="/unternehmen" className="block transition hover:text-cyan-200">Unternehmen</Link>
              <Link href="/kontakt" className="block transition hover:text-cyan-200">Kontakt</Link>
              <Link href="/impressum" className="block transition hover:text-cyan-200">Impressum</Link>
              <Link href="/datenschutz" className="block transition hover:text-cyan-200">Datenschutz</Link>
              <Link href="/agb" className="block transition hover:text-cyan-200">AGB</Link>
              <CookieSettingsButton />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/82">Direktkontakt</h3>
            <div className="mt-5 space-y-4 text-sm text-white/50">
              <a href={`tel:${contact.primaryPhone}`} className="flex items-center gap-3 transition hover:text-cyan-200">
                <Phone size={16} className="text-cyan-300/80" />
                {contact.primaryPhoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition hover:text-cyan-200">
                <Mail size={16} className="text-cyan-300/80" />
                {contact.email}
              </a>
              <a
                href={buildWhatsappUrl(contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-cyan-200"
              >
                <WhatsAppIcon className="h-4 w-4 fill-cyan-300" />
                WhatsApp starten
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/82">Vertrauen</h3>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <p>Transparente Preisstruktur</p>
              <p>Professionelle und versicherte Abwicklung</p>
              <p>Strukturierte Rückmeldung zu Termin und Umfang</p>
              <p>Serviceeinsätze in {contact.serviceRegion}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>&copy; {new Date().getFullYear()} {company.name}. Alle Rechte vorbehalten.</p>
            {company.vatId ? <p className="text-xs text-white/25">USt-IdNr.: {company.vatId}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/leistungen/umzug-berlin" className="transition hover:text-cyan-200">Umzugsfirma Berlin</Link>
            <Link href="/leistungen/privatumzug" className="transition hover:text-cyan-200">Privatumzug</Link>
            <Link href="/buchen" className="transition hover:text-cyan-200">Buchen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
