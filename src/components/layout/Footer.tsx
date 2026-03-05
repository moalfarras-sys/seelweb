"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Truck, SprayCan, Building2, Trash2, GraduationCap } from "lucide-react";
import { CONTACT, whatsappDefaultUrl } from "@/config/contact";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { CookieSettingsButton } from "@/components/layout/CookieBanner";

export default function Footer() {
  return (
    <footer className="gradient-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-teal-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-blue-500 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/images/logo.jpeg" alt="Seel Transport" width={48} height={48} className="h-12 w-12 rounded-lg" />
              <div>
                <span className="text-xl font-bold">SEEL</span>
                <span className="text-xs block text-silver-300 -mt-1">Transport & Reinigung</span>
              </div>
            </div>
            <p className="text-silver-300 text-sm leading-relaxed mb-6">
              Ihr zuverlässiger Partner für professionelle Umzüge, Transporte und Reinigungsdienste deutschlandweit.
            </p>
            <div className="flex gap-3">
              <a
                href={whatsappDefaultUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Unsere Leistungen</h3>
            <ul className="space-y-3">
              {[
                { href: "/leistungen#umzuege", icon: Truck, label: "Umzüge & Möbeltransporte" },
                { href: "/leistungen#reinigung", icon: SprayCan, label: "Reinigungsservice" },
                { href: "/leistungen#buero", icon: Building2, label: "Büroumzüge" },
                { href: "/leistungen#entruempelung", icon: Trash2, label: "Entrümpelung" },
                { href: "/leistungen#schule", icon: GraduationCap, label: "Schulumzüge" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center gap-2 text-silver-300 hover:text-teal-400 transition-colors text-sm group">
                    <item.icon size={16} className="group-hover:scale-110 transition-transform" /> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Schnellzugriff</h3>
            <ul className="space-y-3">
              {[
                { href: "/buchen", label: "Jetzt buchen" },
                { href: "/unternehmen", label: "Für Unternehmen" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-silver-300 hover:text-teal-400 transition-colors text-sm hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-sm font-semibold mt-6 mb-3 text-silver-200">Rechtliches</h4>
            <ul className="space-y-2">
              {[
                { href: "/agb", label: "AGB" },
                { href: "/impressum", label: "Impressum" },
                { href: "/datenschutz", label: "Datenschutz" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-silver-400 hover:text-teal-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><CookieSettingsButton /></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-teal-400 mt-0.5 shrink-0" />
                <span className="text-silver-300 text-sm">{CONTACT.CITY}, {CONTACT.COUNTRY}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-teal-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+491728003410" className="text-silver-300 hover:text-teal-400 transition-all duration-200 text-sm hover:translate-x-0.5">
                    +49 172 8003410
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-teal-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+491607746966" className="text-silver-300 hover:text-teal-400 transition-all duration-200 text-sm hover:translate-x-0.5">
                    +49 160 7746966
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-teal-400 shrink-0" />
                <a href={`mailto:${CONTACT.EMAIL}`} className="text-silver-300 hover:text-teal-400 transition-colors text-sm">{CONTACT.EMAIL}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-teal-400 shrink-0" />
                <span className="text-silver-300 text-sm">{CONTACT.AVAILABILITY}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-silver-400 text-sm">
            &copy; {new Date().getFullYear()} Seel Transport & Reinigung. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/agb" className="text-silver-400 hover:text-teal-400 transition-colors">AGB</Link>
            <Link href="/impressum" className="text-silver-400 hover:text-teal-400 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-silver-400 hover:text-teal-400 transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
