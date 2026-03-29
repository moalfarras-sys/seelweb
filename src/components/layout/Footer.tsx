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
    <footer className="relative z-10 overflow-hidden border-t border-slate-200 bg-stone-50 dark:border-white/5 dark:bg-[rgba(8,13,24,0.88)]">
      <div className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute left-12 top-12 h-56 w-56 rounded-full bg-emerald-400 blur-[120px]" />
        <div className="absolute bottom-0 right-8 h-48 w-48 rounded-full bg-sky-400 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/images/logo.jpeg" alt="SEEL Transport & Reinigung Logo" width={48} height={48} className="rounded-2xl" />
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">SEEL</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-white/50">Transport & Reinigung</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-white/60">
              Strukturierte Einsätze für Umzug, Reinigung und Entrümpelung in {contact.serviceRegion}. Ruhig geplant, transparent kalkuliert und professionell umgesetzt.
            </p>
            <a href={buildWhatsappUrl(contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 transition hover:bg-emerald-600">
              <WhatsAppIcon className="h-5 w-5 fill-white" />
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Leistungen</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-white/60">
              <Link href="/leistungen/umzug-berlin" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Umzugsfirma Berlin</Link>
              <Link href="/leistungen/privatumzug" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Privatumzug</Link>
              <Link href="/leistungen/firmenumzug" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Firmenumzug</Link>
              <Link href="/leistungen/schulumzug" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Schulumzug</Link>
              <Link href="/leistungen/reinigung" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Reinigung</Link>
              <Link href="/leistungen/entruempelung" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Entrümpelung</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Schnellzugriff</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-white/60">
              <Link href="/buchen" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Preise & Buchen</Link>
              <Link href="/unternehmen" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Unternehmen</Link>
              <Link href="/kontakt" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Kontakt</Link>
              <Link href="/impressum" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Impressum</Link>
              <Link href="/datenschutz" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">Datenschutz</Link>
              <Link href="/agb" className="block transition hover:text-emerald-700 dark:hover:text-teal-300">AGB</Link>
              <CookieSettingsButton />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Kontakt</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-500 dark:text-white/60">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-emerald-600 dark:text-teal-300" />
                <div className="space-y-1">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <a href={`tel:${contact.primaryPhone}`} className="flex items-center gap-3 transition hover:text-emerald-700 dark:hover:text-teal-300">
                <Phone size={16} className="text-emerald-600 dark:text-teal-300" />
                {contact.primaryPhoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 transition hover:text-emerald-700 dark:hover:text-teal-300">
                <Mail size={16} className="text-emerald-600 dark:text-teal-300" />
                {contact.email}
              </a>
              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 text-emerald-600 dark:text-teal-300" />
                <span>{contact.availability} · {contact.serviceRegion}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-400 dark:border-white/5 dark:text-white/40 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>&copy; {new Date().getFullYear()} {company.name}. Alle Rechte vorbehalten.</p>
            {company.vatId ? (
              <p className="text-xs text-slate-400 dark:text-white/35">USt-IdNr.: {company.vatId}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/leistungen/umzug-berlin" className="transition hover:text-emerald-700 dark:hover:text-teal-300">Umzugsfirma Berlin</Link>
            <Link href="/leistungen/privatumzug" className="transition hover:text-emerald-700 dark:hover:text-teal-300">Privatumzug</Link>
            <Link href="/buchen" className="transition hover:text-emerald-700 dark:hover:text-teal-300">Buchen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
