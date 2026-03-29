"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { CONTACT } from "@/config/contact";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 200);
  }, []);

  return (
    <>
      <div className="hidden py-2 text-white/80 lg:block" style={{ background: "rgba(10, 15, 30, 0.6)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="inline-flex items-center gap-2 transition hover:text-cyan-400">
              <Phone size={12} />
              {CONTACT.PRIMARY_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT.EMAIL}`} className="inline-flex items-center gap-2 transition hover:text-cyan-400">
              <Mail size={12} />
              {CONTACT.EMAIL}
            </a>
          </div>
          <p className="text-white/50">{CONTACT.AVAILABILITY}</p>
        </div>
      </div>

      <nav className="nav-glass sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.jpeg" alt="SEEL Transport & Reinigung" width={48} height={48} className="rounded-2xl shadow-md" />
            <div>
              <p className="text-lg font-bold text-white">SEEL</p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Transport & Reinigung</p>
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
                      "inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold transition",
                      pathname.startsWith("/leistungen")
                        ? "bg-white/10 text-cyan-400"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
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
                            className="rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-cyan-500/30 hover:bg-white/10"
                          >
                            <p className="text-sm font-semibold text-white">{serviceLink.label}</p>
                            <p className="mt-1 text-xs text-white/50">{serviceLink.subtitle}</p>
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
                      ? "bg-white/10 text-cyan-400"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/buchen" className="btn-primary-glass px-5 py-3 text-sm font-semibold">
              Jetzt buchen
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setMobileOpen((c) => !c)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="dropdown-glass fixed inset-x-0 top-[calc(5rem+1px)] z-40 max-h-[80vh] overflow-y-auto rounded-none border-x-0 border-t-0 px-4 py-4 lg:hidden">
          <div className="space-y-2">
            {mainLinks.map((link) =>
              link.mega ? (
                <div key={link.href} className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <button onClick={() => setServicesOpen((c) => !c)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-white">
                    {link.label}
                    <ChevronDown size={15} className={cn("transition", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="mt-2 space-y-2 px-2 pb-2">
                      {serviceLinks.map((serviceLink) => (
                        <Link key={serviceLink.href} href={serviceLink.href} onClick={() => setMobileOpen(false)} className="block rounded-xl bg-white/5 px-3 py-3 text-sm font-medium text-white">
                          {serviceLink.label}
                          <span className="mt-1 block text-xs font-normal text-white/50">{serviceLink.subtitle}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
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
