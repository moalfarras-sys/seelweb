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
    description: "Planbare Umzüge mit fester Führung.",
    icon: Truck,
  },
  {
    href: "/leistungen/expressumzug",
    label: "Expressumzug",
    description: "Kurzfristige Einsätze mit Priorität.",
    icon: Sparkles,
  },
  {
    href: "/leistungen/firmenumzug",
    label: "Büro- & Gewerbeumzug",
    description: "Projektlogik für Teams und Flächen.",
    icon: Building2,
  },
  {
    href: "/leistungen/reinigung",
    label: "Reinigung",
    description: "Saubere Übergaben und feste Checklisten.",
    icon: WandSparkles,
  },
  {
    href: "/leistungen/entruempelung",
    label: "Entrümpelung",
    description: "Räumung und Entsorgung aus einer Hand.",
    icon: Trash2,
  },
  {
    href: "/leistungen/schulumzug",
    label: "Schulumzug",
    description: "Etappenplanung für enge Zeitfenster.",
    icon: Clock3,
  },
];

function LogoImage({ size = 40 }: { size?: number }) {
  const [useFallback, setUseFallback] = useState(false);
  const width = Math.round(size * 1.78);

  if (useFallback) {
    return (
      <div
        className="flex items-center justify-center rounded-[14px] bg-brand-navy px-2.5 text-xs font-bold tracking-[0.2em] text-white shadow-[0_12px_30px_rgba(11,22,40,0.18)]"
        style={{ width, height: size }}
      >
        SEEL
      </div>
    );
  }

  return (
    <span className="relative block shrink-0 overflow-hidden" style={{ width, height: size }} aria-hidden="true">
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
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4 xl:px-6">
        <nav
          className={cn(
            "nav-glass mx-auto flex max-w-[1240px] items-center justify-between rounded-[24px] px-2.5 py-2 md:px-3.5",
            scrolled ? "shadow-[0_18px_48px_rgba(4,9,20,0.18)]" : "shadow-[0_12px_30px_rgba(4,9,20,0.12)]"
          )}
        >
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 rounded-[18px] px-2 py-1.5 transition-colors hover:bg-white/65 dark:hover:bg-white/8"
          >
            <LogoImage size={28} />
            <div className="min-w-0">
              <p className="font-display text-[0.84rem] font-bold tracking-[0.18em] text-text-primary dark:text-white md:text-[0.95rem]">
                SEEL
              </p>
              <p className="truncate text-[7px] uppercase tracking-[0.24em] text-text-muted dark:text-white/44 md:text-[8px]">
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
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.92rem] font-semibold transition-all",
                      pathname.startsWith("/leistungen")
                        ? "bg-[linear-gradient(135deg,rgba(18,215,198,0.22),rgba(111,121,255,0.18))] text-text-primary shadow-[0_12px_32px_rgba(18,215,198,0.12),inset_0_1px_0_rgba(255,255,255,0.3)] dark:text-white dark:shadow-[0_12px_32px_rgba(18,215,198,0.16),inset_0_1px_0_rgba(255,255,255,0.12)]"
                        : "text-text-primary/84 hover:bg-white/68 hover:text-text-primary dark:text-white/86 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                  >
                    {item.label}
                    <ChevronDown size={15} className={cn("transition-transform duration-300", megaOpen && "rotate-180")} />
                  </button>

                  <div
                    className={cn(
                      "dropdown-glass absolute left-1/2 top-full mt-3.5 w-[720px] -translate-x-1/2 p-4 transition-all duration-300",
                      megaOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                    )}
                  >
                    <div className="mb-4 grid gap-4 border-b border-border/70 pb-4 dark:border-border-dark lg:grid-cols-[1fr_240px]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-teal">Leistungen</p>
                        <h3 className="mt-3 font-display text-[1.6rem] font-bold text-text-primary dark:text-text-on-dark">
                          Umzug, Reinigung und Entrümpelung in einer klaren Oberfläche.
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-text-body dark:text-text-on-dark-muted">
                          Berlin, Brandenburg und deutschlandweite Einsätze mit einem ruhigen Premium-Auftritt und direktem Weg zur Anfrage.
                        </p>
                      </div>
                      <div className="premium-panel p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-gold">Schnellstart</p>
                        <p className="mt-3 text-base font-semibold text-text-primary dark:text-text-on-dark">In unter 2 Minuten anfragen</p>
                        <p className="mt-2 text-sm leading-6 text-text-body dark:text-text-on-dark-muted">
                          Für feste Termine, Expressfälle oder kombinierte Leistungen.
                        </p>
                        <Link href="/buchen" className="btn-primary-glass mt-4 w-full gap-2">
                          Jetzt buchen <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>

                    <div className="grid gap-2.5 md:grid-cols-2">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link key={service.href} href={service.href} className="glass-card group p-3.5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-brand-teal/12 text-brand-teal">
                                <Icon size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-text-primary transition group-hover:text-brand-teal dark:text-text-on-dark">
                                  {service.label}
                                </p>
                                <p className="mt-1 text-[0.77rem] leading-5 text-text-muted dark:text-text-on-dark-muted">
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
                    "rounded-full px-3.5 py-2 text-[0.92rem] font-semibold transition-all",
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? "bg-[linear-gradient(135deg,rgba(18,215,198,0.22),rgba(111,121,255,0.18))] text-text-primary shadow-[0_12px_32px_rgba(18,215,198,0.12),inset_0_1px_0_rgba(255,255,255,0.3)] dark:text-white dark:shadow-[0_12px_32px_rgba(18,215,198,0.16),inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-text-primary/84 hover:bg-white/68 hover:text-text-primary dark:text-white/86 dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden items-center gap-2.5 lg:flex">
            <ThemeToggle />
            <Link href="/buchen" className="btn-primary-glass gap-2 px-4.5 py-2.5">
              Jetzt buchen <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setDrawerOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/40 bg-white/58 text-text-primary backdrop-blur-xl transition-all hover:bg-white/74 dark:border-white/12 dark:bg-white/7 dark:text-white dark:hover:bg-white/12"
              aria-label={drawerOpen ? "Menü schließen" : "Menü öffnen"}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span
                  className={cn(
                    "absolute h-[2px] w-[18px] rounded-full bg-current transition-all duration-300",
                    drawerOpen ? "translate-y-0 rotate-45" : "-translate-y-[5px]"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-[2px] w-[18px] rounded-full bg-current transition-all duration-300",
                    drawerOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-[2px] w-[18px] rounded-full bg-current transition-all duration-300",
                    drawerOpen ? "translate-y-0 -rotate-45" : "translate-y-[5px]"
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
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[23rem] flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(5,12,22,0.98)_0%,rgba(6,15,28,0.995)_100%)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-white shadow-[0_32px_96px_rgba(0,0,0,0.42)] transition-transform duration-300 lg:hidden",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={() => setDrawerOpen(false)}>
            <LogoImage size={32} />
            <div>
              <p className="font-display text-[0.95rem] font-bold tracking-[0.16em]">SEEL</p>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/55">Transport & Reinigung</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white transition hover:bg-white/12"
            aria-label="Schließen"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
          {navigation.map((item) =>
            item.mega ? (
              <div key={item.href} className="rounded-[20px] border border-white/10 bg-white/6 p-2 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((current) => !current)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-base font-semibold"
                >
                  {item.label}
                  <ChevronDown size={18} className={cn("transition-transform duration-300", mobileServicesOpen && "rotate-180")} />
                </button>
                {mobileServicesOpen && (
                  <div className="space-y-1 px-1 pb-1">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-[16px] px-3 py-2.5 transition hover:bg-white/8"
                      >
                        <span className="block text-sm font-semibold">{service.label}</span>
                        <span className="mt-1 block text-[0.75rem] leading-5 text-white/58">{service.description}</span>
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
                  "block rounded-[18px] px-4 py-3 text-base font-semibold transition-all",
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "bg-[linear-gradient(135deg,rgba(18,215,198,0.2),rgba(111,121,255,0.2))] text-white"
                    : "text-white hover:bg-white/8"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="premium-panel-dark mt-5 p-4">
          <p className="text-[11px] uppercase tracking-[0.34em] text-brand-teal-light">Berlin · Brandenburg</p>
          <p className="mt-3 text-lg font-semibold">Premium. Präzise. Schnell anfragbar.</p>
          <p className="mt-3 text-sm leading-6 text-white/68">
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
