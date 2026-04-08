"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, X, ArrowRight } from "lucide-react";
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

function LogoImage({ size = 40 }: { size?: number }) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-brand-navy text-white font-display font-bold"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        S
      </div>
    );
  }

  return (
    <Image
      src="/images/logo-new.png"
      alt="SEEL Transport & Reinigung Logo"
      width={size}
      height={size}
      className="rounded-xl"
      style={{ height: "auto" }}
      onError={() => setUseFallback(true)}
    />
  );
}

export { LogoImage };

export default function Navbar() {
  const { contact } = useSiteContent();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 180);
  }, []);

  return (
    <>
      <div className="hidden border-b border-border/40 bg-surface py-2 text-text-body dark:border-border-dark/40 dark:bg-surface-dark dark:text-text-on-dark-muted lg:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 text-[11px] uppercase tracking-[0.22em]">
          <div className="flex items-center gap-6">
            <a href={`tel:${contact.primaryPhone}`} className="inline-flex items-center gap-2 transition hover:text-brand-teal">
              <Phone size={12} />
              {contact.primaryPhoneDisplay}
            </a>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 transition hover:text-brand-teal">
              <Mail size={12} />
              {contact.email}
            </a>
          </div>
          <p className="text-text-muted dark:text-text-on-dark-muted">{contact.availability}</p>
        </div>
      </div>

      <nav
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border/60 bg-white/90 shadow-sm backdrop-blur-xl dark:border-border-dark/60 dark:bg-brand-navy/90"
            : "border-border/30 bg-white/80 backdrop-blur-xl dark:border-border-dark/30 dark:bg-brand-navy/80"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <LogoImage size={40} />
            <div>
              <p className="font-display text-lg font-bold tracking-wide text-text-primary dark:text-text-on-dark">SEEL</p>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-text-muted dark:text-text-on-dark-muted">
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
                      "inline-flex items-center gap-1 rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-200",
                      pathname.startsWith("/leistungen")
                        ? "bg-brand-teal/10 text-brand-teal"
                        : "text-text-body hover:text-brand-teal dark:text-text-on-dark-muted dark:hover:text-brand-teal"
                    )}
                  >
                    {link.label}
                    <ChevronDown size={15} className={cn("transition-transform duration-200", dropdownOpen && "rotate-180")} />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute left-1/2 top-full mt-3 w-[680px] -translate-x-1/2 rounded-card border border-border bg-white p-5 shadow-lg dark:border-border-dark dark:bg-surface-dark-card"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="mb-4 flex items-end justify-between gap-6 border-b border-border/60 pb-4 dark:border-border-dark/60">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal">Leistungswelten</p>
                          <p className="mt-2 max-w-sm text-sm text-text-body dark:text-text-on-dark-muted">
                            Klar strukturierte Einsatzfelder für private, gewerbliche und kurzfristige Anfragen.
                          </p>
                        </div>
                        <Link href="/leistungen" className="whitespace-nowrap rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-brand-teal hover:text-brand-teal dark:border-border-dark dark:text-text-on-dark dark:hover:border-brand-teal">
                          Alle Leistungen
                        </Link>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {serviceLinks.map((serviceLink) => (
                          <Link
                            key={serviceLink.href}
                            href={serviceLink.href}
                            onClick={() => setDropdownOpen(false)}
                            className="group/item rounded-button border border-border/60 bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-sm dark:border-border-dark/60 dark:bg-surface-dark-card dark:hover:border-brand-teal/40"
                          >
                            <p className="text-sm font-semibold text-text-primary transition group-hover/item:text-brand-teal dark:text-text-on-dark">
                              {serviceLink.label}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-text-muted dark:text-text-on-dark-muted">{serviceLink.subtitle}</p>
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
                    "rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-200",
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-brand-teal/10 text-brand-teal"
                      : "text-text-body hover:text-brand-teal dark:text-text-on-dark-muted dark:hover:text-brand-teal"
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link href="/buchen" className="rounded-button bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(0,197,160,0.3)]">
              Jetzt buchen
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border bg-white text-text-primary shadow-sm dark:border-border-dark dark:bg-surface-dark-card dark:text-text-on-dark"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl dark:bg-surface-dark lg:hidden">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogoImage size={32} />
                <span className="font-display text-lg font-bold text-text-primary dark:text-text-on-dark">SEEL</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="rounded-button p-2 text-text-muted hover:text-text-primary dark:text-text-on-dark-muted dark:hover:text-text-on-dark">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 rounded-card border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark-card">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-teal">Schnellkontakt</p>
              <p className="mt-2 text-sm font-semibold text-text-primary dark:text-text-on-dark">{contact.primaryPhoneDisplay}</p>
              <p className="mt-1 text-xs text-text-muted dark:text-text-on-dark-muted">{contact.availability}</p>
            </div>

            <div className="space-y-2">
              {mainLinks.map((link) =>
                link.mega ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setServicesOpen((current) => !current)}
                      className="flex w-full items-center justify-between rounded-button px-4 py-3 text-left text-base font-semibold text-text-primary dark:text-text-on-dark"
                    >
                      {link.label}
                      <ChevronDown size={15} className={cn("transition duration-200", servicesOpen && "rotate-180")} />
                    </button>
                    {servicesOpen && (
                      <div className="mt-1 space-y-1 px-2 pb-2">
                        {serviceLinks.map((serviceLink) => (
                          <Link
                            key={serviceLink.href}
                            href={serviceLink.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-button px-4 py-3 text-sm text-text-body transition hover:bg-surface hover:text-brand-teal dark:text-text-on-dark-muted dark:hover:bg-surface-dark-card dark:hover:text-brand-teal"
                          >
                            {serviceLink.label}
                            <span className="mt-0.5 block text-xs text-text-muted dark:text-text-on-dark-muted">
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
                    className={cn(
                      "block rounded-button px-4 py-3 text-base font-semibold transition",
                      pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                        ? "text-brand-teal"
                        : "text-text-primary hover:text-brand-teal dark:text-text-on-dark dark:hover:text-brand-teal"
                    )}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>

            <div className="mt-8">
              <Link
                href="/buchen"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-button bg-brand-teal px-6 py-3.5 text-base font-semibold text-white transition hover:brightness-110"
              >
                Jetzt buchen <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
