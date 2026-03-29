"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
      {/* Top info bar */}
      <div className="hidden py-2 lg:block bg-slate-100 text-slate-600 dark:bg-[rgba(10,15,30,0.6)] dark:text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="inline-flex items-center gap-2 transition hover:text-teal-600 dark:hover:text-cyan-400">
              <Phone size={12} />
              {CONTACT.PRIMARY_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT.EMAIL}`} className="inline-flex items-center gap-2 transition hover:text-teal-600 dark:hover:text-cyan-400">
              <Mail size={12} />
              {CONTACT.EMAIL}
            </a>
          </div>
          <p className="text-slate-400 dark:text-white/50">{CONTACT.AVAILABILITY}</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.jpeg" alt="SEEL Transport & Reinigung" width={48} height={48} className="rounded-2xl shadow-md" />
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">SEEL</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-white/50">Transport & Reinigung</p>
            </div>
          </Link>

          {/* Desktop links */}
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
                      "inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold transition",
                      pathname.startsWith("/leistungen")
                        ? "bg-teal-50 text-teal-700 dark:bg-white/10 dark:text-cyan-400"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white"
                    )}
                  >
                    {link.label}
                    <ChevronDown size={15} className={cn("transition-transform", dropdownOpen && "rotate-180")} />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="dropdown-glass absolute left-1/2 top-full mt-3 w-[680px] -translate-x-1/2 p-5"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        {serviceLinks.map((serviceLink) => (
                          <Link
                            key={serviceLink.href}
                            href={serviceLink.href}
                            onClick={() => setDropdownOpen(false)}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-400/40 hover:bg-teal-50 dark:border-white/5 dark:bg-white/5 dark:hover:border-cyan-500/30 dark:hover:bg-white/10"
                          >
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{serviceLink.label}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-white/50">{serviceLink.subtitle}</p>
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
                    "rounded-xl px-4 py-2 text-sm font-semibold transition",
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-teal-50 text-teal-700 dark:bg-white/10 dark:text-cyan-400"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link href="/buchen" className="btn-primary-glass px-5 py-3 text-sm font-semibold">
              Jetzt buchen
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileOpen((c) => !c)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="dropdown-glass fixed inset-x-0 top-[calc(5rem+1px)] z-40 max-h-[80vh] overflow-y-auto rounded-none border-x-0 border-t-0 px-4 py-4 lg:hidden">
          <div className="space-y-2">
            {mainLinks.map((link) =>
              link.mega ? (
                <div key={link.href} className="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
                  <button onClick={() => setServicesOpen((c) => !c)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    {link.label}
                    <ChevronDown size={15} className={cn("transition", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="mt-2 space-y-2 px-2 pb-2">
                      {serviceLinks.map((serviceLink) => (
                        <Link key={serviceLink.href} href={serviceLink.href} onClick={() => setMobileOpen(false)} className="block rounded-xl bg-white px-3 py-3 text-sm font-medium text-slate-900 dark:bg-white/5 dark:text-white">
                          {serviceLink.label}
                          <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-white/50">{serviceLink.subtitle}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
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
