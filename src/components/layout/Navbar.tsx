"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSiteContent } from "@/components/SiteContentProvider";

const serviceLinks = [
  { href: "/leistungen/privatumzug", label: "Privatumzug", subtitle: "Wohnungen, Häuser und Teilumzüge" },
  { href: "/leistungen/firmenumzug", label: "Firmenumzug", subtitle: "Büros, Praxen und Agenturen" },
  { href: "/leistungen/schulumzug", label: "Schulumzug", subtitle: "Ferien- und Wochenendfenster" },
  { href: "/leistungen/reinigung", label: "Reinigung", subtitle: "Wohnung, Büro und Übergabe" },
  { href: "/leistungen/entruempelung", label: "Entrümpelung", subtitle: "Räumung und fachgerechte Entsorgung" },
  { href: "/leistungen/expressumzug", label: "Expressumzug", subtitle: "Kurzfristige Termine nach Verfügbarkeit" },
];

const mainLinks = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen", mega: true },
  { href: "/buchen", label: "Preise & Buchen" },
  { href: "/unternehmen", label: "Unternehmen" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const { contact } = useSiteContent();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 180);
  }, []);

  return (
    <>
      <div className="hidden border-b border-white/[0.06] bg-[rgba(2,8,16,0.88)] py-2 text-white/65 backdrop-blur-2xl lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 text-[11px] uppercase tracking-[0.22em]">
          <div className="flex items-center gap-6">
            <a href={`tel:${contact.primaryPhone}`} className="inline-flex items-center gap-2 transition hover:text-cyan-200">
              <Phone size={12} />
              {contact.primaryPhoneDisplay}
            </a>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 transition hover:text-cyan-200">
              <Mail size={12} />
              {contact.email}
            </a>
          </div>
          <p className="text-white/40">{contact.availability}</p>
        </div>
      </div>

      <nav className="nav-glass sticky top-0 z-50">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative overflow-hidden rounded-[22px] border border-white/15 bg-white/[0.08] p-1 shadow-[0_14px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
              <Image
                src="/images/logo.jpeg"
                alt="SEEL Transport & Reinigung Logo"
                width={52}
                height={52}
                className="rounded-[18px] transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div>
              <p className="font-display text-xl font-bold tracking-[0.08em] text-slate-900 dark:text-white">SEEL</p>
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-500 dark:text-white/40">
                Transport & Reinigung
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {mainLinks.map((link) =>
              link.mega ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                      pathname.startsWith("/leistungen")
                        ? "bg-[#040a14] text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] dark:bg-white dark:text-[#040a14]"
                        : "text-slate-700 hover:bg-white/70 hover:text-slate-950 dark:text-white/75 dark:hover:bg-white/[0.08] dark:hover:text-white",
                    )}
                  >
                    {link.label}
                    <ChevronDown size={15} className={cn("transition-transform duration-300", dropdownOpen && "rotate-180")} />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="dropdown-glass absolute left-1/2 top-full mt-4 w-[720px] -translate-x-1/2 p-5"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="mb-4 flex items-end justify-between gap-6 border-b border-slate-200/60 pb-4 dark:border-white/[0.08]">
                        <div>
                          <p className="section-eyebrow">Leistungswelten</p>
                          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-white/55">
                            Klar strukturierte Einsatzfelder für private, gewerbliche und kurzfristige Anfragen.
                          </p>
                        </div>
                        <Link href="/leistungen" className="btn-ghost-premium whitespace-nowrap">
                          Alle Leistungen
                        </Link>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {serviceLinks.map((serviceLink) => (
                          <Link
                            key={serviceLink.href}
                            href={serviceLink.href}
                            onClick={() => setDropdownOpen(false)}
                            className="group rounded-[24px] border border-slate-200/60 bg-white/72 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                          >
                            <p className="text-sm font-semibold text-slate-900 transition group-hover:text-sky-800 dark:text-white dark:group-hover:text-cyan-200">
                              {serviceLink.label}
                            </p>
                            <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-white/45">{serviceLink.subtitle}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-[#040a14] text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] dark:bg-white dark:text-[#040a14]"
                      : "text-slate-700 hover:bg-white/70 hover:text-slate-950 dark:text-white/75 dark:hover:bg-white/[0.08] dark:hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link href="/buchen" className="btn-primary-glass">
              Jetzt buchen
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/60 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="dropdown-glass fixed inset-x-3 top-[calc(6rem+1px)] z-40 max-h-[82vh] overflow-y-auto rounded-[28px] px-4 py-4 lg:hidden">
          <div className="mb-4 rounded-[24px] border border-white/[0.08] bg-[#040a14] px-4 py-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/70">Schnellkontakt</p>
            <p className="mt-3 text-sm font-semibold">{contact.primaryPhoneDisplay}</p>
            <p className="mt-1 text-xs text-white/55">{contact.availability}</p>
          </div>

          <div className="space-y-2">
            {mainLinks.map((link) =>
              link.mega ? (
                <div key={link.href} className="rounded-[24px] border border-slate-200/60 bg-white/70 p-2 dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <button
                    onClick={() => setServicesOpen((current) => !current)}
                    className="flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    {link.label}
                    <ChevronDown size={15} className={cn("transition duration-300", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="mt-2 space-y-2 px-2 pb-2">
                      {serviceLinks.map((serviceLink) => (
                        <Link
                          key={serviceLink.href}
                          href={serviceLink.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-[18px] bg-white px-3 py-3 text-sm font-medium text-slate-900 dark:bg-white/[0.04] dark:text-white"
                        >
                          {serviceLink.label}
                          <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-white/45">
                            {serviceLink.subtitle}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-[22px] border border-slate-200/60 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link href="/buchen" onClick={() => setMobileOpen(false)} className="btn-primary-glass mt-2 w-full">
              Jetzt buchen
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
