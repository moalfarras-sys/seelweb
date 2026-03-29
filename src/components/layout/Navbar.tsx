"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const serviceLinks = [
  { href: "/leistungen/privatumzug", label: "Privatumzug", subtitle: "Wohnungs- und Hausumzüge" },
  { href: "/leistungen/firmenumzug", label: "Firmenumzug", subtitle: "Büros, Praxen und Agenturen" },
  { href: "/leistungen/schulumzug", label: "Schulumzug", subtitle: "Ferien- und Wochenendfenster" },
  { href: "/leistungen/reinigung", label: "Reinigung", subtitle: "Wohnung, Büro und Übergabe" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung", subtitle: "Schnell und fachgerecht" },
  { href: "/leistungen/expressumzug", label: "Expressumzug", subtitle: "Kurzfristige Termine" },
];

const mainLinks = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen", mega: true },
  { href: "/buchen", label: "Preise & Buchen" },
  { href: "/unternehmen", label: "Unternehmen" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <>
      <div className="hidden bg-navy-900 py-2 text-white/85 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="inline-flex items-center gap-2 transition hover:text-teal-300">
              <Phone size={12} />
              {CONTACT.PRIMARY_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT.EMAIL}`} className="inline-flex items-center gap-2 transition hover:text-teal-300">
              <Mail size={12} />
              {CONTACT.EMAIL}
            </a>
          </div>
          <p>{CONTACT.AVAILABILITY}</p>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/75 backdrop-blur-2xl dark:border-white/5 dark:bg-navy-900/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.jpeg" alt="SEEL Transport & Reinigung" width={48} height={48} className="rounded-2xl shadow-md" />
            <div>
              <p className="text-lg font-bold text-navy-900 dark:text-white">SEEL</p>
              <p className="text-xs uppercase tracking-[0.2em] text-silver-500 dark:text-silver-400">Transport & Reinigung</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {mainLinks.map((link) =>
              link.mega ? (
                <div key={link.href} className="group relative">
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 rounded-2xl px-4 py-2 text-sm font-semibold transition",
                      pathname.startsWith("/leistungen")
                        ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                        : "text-navy-800 hover:bg-gray-100 dark:text-silver-200 dark:hover:bg-white/5"
                    )}
                  >
                    {link.label}
                    <ChevronDown size={15} />
                  </button>
                  <div className="invisible absolute left-1/2 top-full mt-3 w-[680px] -translate-x-1/2 rounded-3xl border border-white/40 bg-white/90 p-5 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100 dark:border-white/5 dark:bg-navy-900/95">
                    <div className="grid gap-3 md:grid-cols-2">
                      {serviceLinks.map((serviceLink) => (
                        <Link key={serviceLink.href} href={serviceLink.href} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-teal-500/30 hover:bg-teal-50 dark:border-navy-700/50 dark:bg-navy-800/60 dark:hover:bg-navy-800">
                          <p className="text-sm font-semibold text-navy-800 dark:text-white">{serviceLink.label}</p>
                          <p className="mt-1 text-xs text-silver-500 dark:text-silver-400">{serviceLink.subtitle}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm font-semibold transition",
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                      : "text-navy-800 hover:bg-gray-100 dark:text-silver-200 dark:hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link href="/buchen" className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
              Jetzt buchen
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileOpen((current) => !current)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 dark:border-navy-700">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-b border-gray-100 bg-white px-4 py-4 shadow-lg dark:border-navy-700 dark:bg-navy-900 lg:hidden">
          <div className="space-y-2">
            {mainLinks.map((link) =>
              link.mega ? (
                <div key={link.href} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-2 dark:border-navy-700 dark:bg-navy-800/60">
                  <button onClick={() => setServicesOpen((current) => !current)} className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-semibold text-navy-800 dark:text-white">
                    {link.label}
                    <ChevronDown size={15} className={cn("transition", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="mt-2 space-y-2 px-2 pb-2">
                      {serviceLinks.map((serviceLink) => (
                        <Link key={serviceLink.href} href={serviceLink.href} onClick={() => setMobileOpen(false)} className="block rounded-2xl bg-white px-3 py-3 text-sm font-medium text-navy-800 dark:bg-navy-900 dark:text-white">
                          {serviceLink.label}
                          <span className="mt-1 block text-xs font-normal text-silver-500 dark:text-silver-400">{serviceLink.subtitle}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-sm font-semibold text-navy-800 dark:border-navy-700 dark:bg-navy-800/60 dark:text-white">
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
