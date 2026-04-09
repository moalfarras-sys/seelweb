"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Clock3,
  Sparkles,
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
    description: "Planbare Umzüge mit festen Ansprechpartnern und sauberem Ablauf.",
    icon: Truck,
  },
  {
    href: "/leistungen/expressumzug",
    label: "Expressumzug",
    description: "Kurzfristige Einsätze mit priorisierter Disposition und klarer Zeitstruktur.",
    icon: Sparkles,
  },
  {
    href: "/leistungen/firmenumzug",
    label: "Büro- & Gewerbeumzug",
    description: "Projektlogik für Teams, Büros, Praxen und laufende Betriebsflächen.",
    icon: Building2,
  },
  {
    href: "/leistungen/reinigung",
    label: "Reinigung",
    description: "Regelmäßige Reinigung und Endreinigung mit dokumentiertem Ergebnis.",
    icon: WandSparkles,
  },
  {
    href: "/leistungen/entruempelung",
    label: "Entrümpelung",
    description: "Räumung, Sortierung und fachgerechte Entsorgung aus einer Hand.",
    icon: Trash2,
  },
  {
    href: "/leistungen/schulumzug",
    label: "Schulumzug",
    description: "Ferienfenster, Etappenplanung und koordinierte Übergaben.",
    icon: Clock3,
  },
];

function LogoImage({ size = 42 }: { size?: number }) {
  const [useFallback, setUseFallback] = useState(false);
  const width = Math.round(size * 1.78);

  if (useFallback) {
    return (
      <div
        className="flex items-center justify-center rounded-[18px] bg-brand-navy px-3 text-sm font-bold tracking-[0.24em] text-white shadow-[0_14px_34px_rgba(11,22,40,0.22)]"
        style={{ width, height: size }}
      >
        SEEL
      </div>
    );
  }

  return (
    <span
      className="relative block shrink-0 overflow-hidden"
      style={{ width, height: size }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-new.png"
        alt="SEEL Transport & Reinigung Logo"
        width={width}
        height={size}
        className="block h-full w-full object-contain"
        loading="eager"
        onError={() => setUseFallback(true)}
      />
    </span>
  );
}

export { LogoImage };

export default function Navbar() {
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
    setMegaOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setMegaOpen(false);
        setMobileServicesOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4 xl:px-6">
        <nav
          className={cn(
            "nav-glass mx-auto flex max-w-[1240px] items-center justify-between rounded-[30px] px-3 py-2 md:px-4",
            scrolled ? "shadow-[0_24px_64px_rgba(15,23,42,0.14)]" : "shadow-[0_16px_44px_rgba(15,23,42,0.08)]"
          )}
        >
          <Link href="/" className="flex min-w-0 items-center gap-3 rounded-[22px] px-2 py-1.5 transition-colors hover:bg-white/30 dark:hover:bg-white/5">
            <LogoImage size={42} />
            <div className="min-w-0">
              <p className="font-display text-[15px] font-bold tracking-[0.2em] text-text-primary dark:text-text-on-dark md:text-base">
                SEEL
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.34em] text-text-muted dark:text-text-on-dark-muted">
                Transport & Reinigung
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1.5 lg:flex">
            {navigation.map((item) =>
              item.mega ? (
                <div key={item.href} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                      pathname.startsWith("/leistungen")
                        ? "bg-brand-teal/12 text-brand-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                        : "text-text-body hover:bg-white/40 hover:text-text-primary dark:text-text-on-dark-muted dark:hover:bg-white/6 dark:hover:text-text-on-dark"
                    )}
                  >
                    {item.label}
                    <ChevronDown size={15} className={cn("transition-transform duration-300", megaOpen && "rotate-180")} />
                  </button>

                  <div
                    className={cn(
                      "dropdown-glass absolute left-1/2 top-full mt-4 w-[760px] -translate-x-1/2 p-5 transition-all duration-300",
                      megaOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                    )}
                  >
                    <div className="mb-5 grid gap-5 border-b border-border/70 pb-5 dark:border-border-dark lg:grid-cols-[1fr_260px]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-teal">Leistungen</p>
                        <h3 className="mt-3 font-display text-2xl font-bold text-text-primary dark:text-text-on-dark">
                          Umzug, Reinigung und Entrümpelung in einer klaren Oberfläche.
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                          Berlin, Brandenburg und deutschlandweite Einsätze mit Premium-Auftritt, sauberer Planung und einer schnellen Anfrageführung.
                        </p>
                      </div>
                      <div className="premium-panel rounded-[28px] p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-gold">Schnellstart</p>
                        <p className="mt-3 text-lg font-semibold text-text-primary dark:text-text-on-dark">In unter 2 Minuten anfragen</p>
                        <p className="mt-2 text-sm leading-6 text-text-body dark:text-text-on-dark-muted">
                          Für feste Termine, Expressfälle oder kombinierte Leistungen.
                        </p>
                        <Link href="/buchen" className="btn-primary-glass mt-5 w-full gap-2">
                          Jetzt buchen <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="glass-card group p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-brand-teal/12 text-brand-teal">
                                <Icon size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-text-primary transition group-hover:text-brand-teal dark:text-text-on-dark">
                                  {service.label}
                                </p>
                                <p className="mt-1 text-xs leading-6 text-text-muted dark:text-text-on-dark-muted">
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
                    "rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? "bg-brand-teal/12 text-brand-teal shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                      : "text-text-body hover:bg-white/40 hover:text-text-primary dark:text-text-on-dark-muted dark:hover:bg-white/6 dark:hover:text-text-on-dark"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link href="/buchen" className="btn-primary-glass gap-2 px-5 py-3">
              Jetzt buchen <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setDrawerOpen((current) => !current)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-border bg-white/70 text-text-primary backdrop-blur-xl transition-all hover:bg-white dark:border-border-dark dark:bg-surface-dark-card/80 dark:text-text-on-dark"
              aria-label={drawerOpen ? "Menü schließen" : "Menü öffnen"}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span
                  className={cn(
                    "absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300",
                    drawerOpen ? "translate-y-0 rotate-45" : "-translate-y-[6px]"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300",
                    drawerOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300",
                    drawerOpen ? "translate-y-0 -rotate-45" : "translate-y-[6px]"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-brand-navy/48 backdrop-blur-md transition-opacity duration-300 lg:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(5,12,22,0.94)_0%,rgba(6,15,28,0.98)_100%)] px-5 pb-6 pt-5 text-white shadow-[0_32px_96px_rgba(0,0,0,0.42)] transition-transform duration-300 lg:hidden",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={() => setDrawerOpen(false)}>
            <LogoImage size={38} />
            <div>
              <p className="font-display text-base font-bold tracking-[0.18em]">SEEL</p>
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/55">Transport & Reinigung</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white transition hover:bg-white/12"
            aria-label="Schließen"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 flex-1 space-y-2 overflow-y-auto">
          {navigation.map((item) =>
            item.mega ? (
              <div key={item.href} className="rounded-[24px] border border-white/10 bg-white/6 p-2 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((current) => !current)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left text-xl font-semibold"
                >
                  {item.label}
                  <ChevronDown size={18} className={cn("transition-transform duration-300", mobileServicesOpen && "rotate-180")} />
                </button>
                {mobileServicesOpen && (
                  <div className="space-y-1 px-1 pb-2">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-[20px] px-3 py-3 transition hover:bg-white/8"
                      >
                        <span className="block text-sm font-semibold">{service.label}</span>
                        <span className="mt-1 block text-xs leading-6 text-white/58">{service.description}</span>
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
                  "block rounded-[22px] px-4 py-4 text-xl font-semibold transition-all",
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "bg-white/12 text-brand-teal"
                    : "text-white hover:bg-white/8"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="premium-panel-dark mt-6 p-5">
          <p className="text-[11px] uppercase tracking-[0.34em] text-brand-teal-light">Berlin · Brandenburg</p>
          <p className="mt-3 text-xl font-semibold">Premium. Präzise. Schnell anfragbar.</p>
          <p className="mt-3 text-sm leading-7 text-white/68">
            Für Umzug, Reinigung, Entrümpelung und kurzfristige Einsätze mit einem konsistenten Premium-Auftritt.
          </p>
          <Link href="/buchen" onClick={() => setDrawerOpen(false)} className="btn-primary-glass mt-5 w-full gap-2">
            Jetzt buchen <ArrowRight size={16} />
          </Link>
        </div>
      </aside>
    </>
  );
}
