"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, whatsappDefaultUrl } from "@/config/contact";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { CookieSettingsButton } from "@/components/layout/CookieBanner";

export default function Footer() {
  return (
    <footer className="gradient-navy relative overflow-hidden text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-12 top-12 h-56 w-56 rounded-full bg-teal-500 blur-[120px]" />
        <div className="absolute bottom-0 right-8 h-48 w-48 rounded-full bg-blue-500 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/images/logo.jpeg" alt="SEEL Transport & Reinigung" width={48} height={48} className="rounded-2xl" />
              <div>
                <p className="text-lg font-bold">SEEL</p>
                <p className="text-xs uppercase tracking-[0.2em] text-silver-300">Transport & Reinigung</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-silver-300">
              Umzüge, Transporte, Reinigung und Entrümpelung für Berlin und Brandenburg. Transparent kalkuliert und zuverlässig umgesetzt.
            </p>
            <a href={whatsappDefaultUrl()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-500 transition hover:bg-green-600">
              <WhatsAppIcon className="h-5 w-5 fill-white" />
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Leistungen</h3>
            <div className="mt-5 space-y-3 text-sm text-silver-300">
              <Link href="/leistungen/umzug-berlin" className="block transition hover:text-teal-300">Umzugsfirma Berlin</Link>
              <Link href="/leistungen/privatumzug" className="block transition hover:text-teal-300">Privatumzug</Link>
              <Link href="/leistungen/firmenumzug" className="block transition hover:text-teal-300">Firmenumzug</Link>
              <Link href="/leistungen/schulumzug" className="block transition hover:text-teal-300">Schulumzug</Link>
              <Link href="/leistungen/reinigung" className="block transition hover:text-teal-300">Reinigung</Link>
              <Link href="/leistungen/entruempelung" className="block transition hover:text-teal-300">Entrümpelung</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Schnellzugriff</h3>
            <div className="mt-5 space-y-3 text-sm text-silver-300">
              <Link href="/buchen" className="block transition hover:text-teal-300">Jetzt buchen</Link>
              <Link href="/unternehmen" className="block transition hover:text-teal-300">Unternehmen</Link>
              <Link href="/kontakt" className="block transition hover:text-teal-300">Kontakt</Link>
              <Link href="/impressum" className="block transition hover:text-teal-300">Impressum</Link>
              <Link href="/datenschutz" className="block transition hover:text-teal-300">Datenschutz</Link>
              <Link href="/agb" className="block transition hover:text-teal-300">AGB</Link>
              <CookieSettingsButton />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Kontakt</h3>
            <div className="mt-5 space-y-4 text-sm text-silver-300">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-teal-300" />
                <span>{CONTACT.CITY}, {CONTACT.COUNTRY}</span>
              </div>
              <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="flex items-center gap-3 transition hover:text-teal-300">
                <Phone size={16} className="text-teal-300" />
                {CONTACT.PRIMARY_PHONE_DISPLAY}
              </a>
              <a href={`mailto:${CONTACT.EMAIL}`} className="flex items-center gap-3 transition hover:text-teal-300">
                <Mail size={16} className="text-teal-300" />
                {CONTACT.EMAIL}
              </a>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-teal-300" />
                <span>{CONTACT.AVAILABILITY}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-silver-400 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} SEEL Transport & Reinigung. Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/leistungen/umzug-berlin" className="transition hover:text-teal-300">Umzugsfirma Berlin</Link>
            <Link href="/leistungen/privatumzug" className="transition hover:text-teal-300">Privatumzug</Link>
            <Link href="/buchen" className="transition hover:text-teal-300">Buchen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
