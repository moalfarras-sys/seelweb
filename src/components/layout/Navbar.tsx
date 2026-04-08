"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Sparkles,
  SunMedium,
  Trash2,
  Truck,
  WandSparkles,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

const navigation = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen", mega: true },
  { href: "/buchen", label: "Preise & Buchen" },
  { href: "/unternehmen", label: "Unternehmen" },
  { href: "/kontakt", label: "Kontakt" },
];

const services = [
  {
    href: "/leistungen/umzug-berlin",
    label: "Privat- & Firmenumzug",
    description: "Strukturierte Umzüge in Berlin, Brandenburg und bundesweit.",
    icon: Truck,
  },
  {
    href: "/leistungen/expressumzug",
    label: "Expressumzug",
    description: "Kurzfristige Einsätze mit priorisierter Disposition.",
    icon: Sparkles,
  },
  {
    href: "/leistungen/firmenumzug",
    label: "Büro- & Gewerbeumzug",
    description: "Saubere Projektplanung für Büros, Agenturen und Praxen.",
    icon: Building2,
  },
  {
    href: "/leistungen/reinigung",
    label: "Reinigung",
    description: "Regelmäßige Reinigung und Endreinigung aus einer Hand.",
    icon: WandSparkles,
  },
  {
    href: "/leistungen/entruempelung",
    label: "Entrümpelung",
    description: "Räumung, Sortierung und fachgerechte Entsorgung.",
    icon: Trash2,
  },
  {
    href: "/leistungen/schulumzug",
    label: "Schulumzug",
    description: "Ferienfenster, Etappenplanung und klare Übergaben.",
    icon: SunMedium,
  },
];

function LogoImage({ size = 40 }: { size?: number }) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <div
        className="flex items-center justify-center rounded-[14px] bg-brand-navy px-3 font-display text-sm font-bold tracking-[0.2em] text-white"
        style={{ width: size * 1.65, height: size }}
      >
        SEEL
      </div>
    );
  }

  return (
    <Image
      src="/images/logo-new.png"
      alt="SEEL Transport & Reinigung Logo"
      width={size * 1.65}
      height={size}
      className="h-auto w-auto"
      priority
      onError={() => setUseFallback(true)}
    />
  );
}

export { LogoImage };

export default function Navbar() {
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border/60 bg-white/92 shadow-sm backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark/92"
            : "border-border/40 bg-white/86 backdrop-blur-xl dark:border-border-dark/70 dark:bg-surface-dark/84"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-6 xl:px-0">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <LogoImage size={40} />
            <div className="min-w-0">
              <p className="font-display text-base font-bold tracking-[0.12em] text-text-primary dark:text-text-on-dark md:text-lg">
                SEEL
              </p>
              <p className="truncate text-[11px] uppercase tracking-[0.28em] text-text-muted dark:text-text-on-dark-muted">
                Transport & Reinigung
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) =>
              item.mega ? (
                <div key={item.href} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-200",
                      pathname.startsWith("/leistungen")
                        ? "bg-brand-teal/12 text-brand-teal"
                        : "text-text-body hover:text-brand-teal dark:text-text-on-dark-muted dark:hover:text-brand-teal"
                    )}
                  >
                    {item.label}
                    <ChevronDown size={16} className={cn("transition-transform duration-200", megaOpen && "rotate-180")} />
                  </button>

                  <div
                    className={cn(
                      "absolute left-1/2 top-full mt-4 w-[720px] -translate-x-1/2 rounded-[28px] border border-border/70 bg-white p-5 shadow-[0_24px_70px_rgba(11,22,40,0.12)] transition-all duration-300 dark:border-border-dark dark:bg-surface-dark-card",
                      megaOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                    )}
                  >
                    <div className="mb-4 flex items-end justify-between gap-6 border-b border-border/70 pb-4 dark:border-border-dark">
                      <div>
                        <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal">
                          Leistungen
                        </p>
                        <p className="mt-2 max-w-sm text-sm text-text-body dark:text-text-on-dark-muted">
                          Umzug, Reinigung und Entrümpelung mit klarer Planung, festen Zeitfenstern und kurzen Wegen.
                        </p>
                      </div>
                      <Link
                        href="/leistungen"
                        className="rounded-pill border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-brand-teal hover:text-brand-teal dark:border-border-dark dark:text-text-on-dark"
                      >
                        Alle Leistungen
                      </Link>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="group rounded-[20px] border border-border/70 bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/40 hover:shadow-[var(--shadow-hover)] dark:border-border-dark dark:bg-surface-dark"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-brand-teal/10 text-brand-teal">
                                <Icon size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-text-primary transition group-hover:text-brand-teal dark:text-text-on-dark">
                                  {service.label}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-text-muted dark:text-text-on-dark-muted">
                                  {service.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-200",
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? "bg-brand-teal/12 text-brand-teal"
                      : "text-text-body hover:text-brand-teal dark:text-text-on-dark-muted dark:hover:text-brand-teal"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link
              href="/buchen"
              className="inline-flex items-center gap-2 rounded-button bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(0,197,160,0.28)]"
            >
              Jetzt buchen <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setDrawerOpen((current) => !current)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-button border border-border bg-white text-text-primary shadow-sm dark:border-border-dark dark:bg-surface-dark-card dark:text-text-on-dark"
              aria-label={drawerOpen ? "Menü schließen" : "Menü öffnen"}
            >
              <span className="sr-only">Menü</span>
              <span className={cn("absolute h-0.5 w-5 rounded-full bg-current transition-all", drawerOpen ? "rotate-45" : "-translate-y-1.5")} />
              <span className={cn("absolute h-0.5 w-5 rounded-full bg-current transition-all", drawerOpen ? "opacity-0" : "opacity-100")} />
              <span className={cn("absolute h-0.5 w-5 rounded-full bg-current transition-all", drawerOpen ? "-rotate-45" : "translate-y-1.5")} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-brand-navy/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white px-6 pb-6 pt-5 shadow-2xl transition-transform duration-300 dark:bg-surface-dark",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={() => setDrawerOpen(false)}>
            <LogoImage size={36} />
            <div>
              <p className="font-display text-base font-bold tracking-[0.12em] text-text-primary dark:text-text-on-dark">
                SEEL
              </p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-text-muted dark:text-text-on-dark-muted">
                Transport & Reinigung
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-primary dark:bg-surface-dark-card dark:text-text-on-dark"
            aria-label="Schließen"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 flex-1 space-y-2 overflow-y-auto">
          {navigation.map((item) =>
            item.mega ? (
              <div key={item.href} className="rounded-[24px] border border-border/70 bg-surface p-2 dark:border-border-dark dark:bg-surface-dark-card">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((current) => !current)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left text-xl font-semibold text-text-primary dark:text-text-on-dark"
                >
                  {item.label}
                  <ChevronDown size={18} className={cn("transition-transform duration-300", mobileServicesOpen && "rotate-180")} />
                </button>
                {mobileServicesOpen && (
                  <div className="space-y-1 px-2 pb-2">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-[18px] px-3 py-3 text-sm text-text-body transition hover:bg-white hover:text-brand-teal dark:text-text-on-dark-muted dark:hover:bg-surface-dark-elevated"
                      >
                        <span className="block font-semibold">{service.label}</span>
                        <span className="mt-1 block text-xs leading-5 opacity-80">{service.description}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "block rounded-[20px] px-4 py-4 text-xl font-semibold transition-all duration-200",
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "bg-brand-teal/10 text-brand-teal"
                    : "text-text-primary hover:bg-surface hover:text-brand-teal dark:text-text-on-dark dark:hover:bg-surface-dark-card dark:hover:text-brand-teal"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <Link
          href="/buchen"
          onClick={() => setDrawerOpen(false)}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-button bg-brand-teal px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:brightness-110"
        >
          Jetzt buchen <ArrowRight size={18} />
        </Link>
        <p className="mt-4 text-center text-xs uppercase tracking-[0.28em] text-text-muted dark:text-text-on-dark-muted">
          Premium. Modern. Berlin.
        </p>
      </aside>
    </>
  );
}
