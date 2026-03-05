"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, Phone, Mail,
  Truck, SprayCan, Building2, Trash2,
  ChevronDown, ArrowRight, Zap, Home, Briefcase,
  MapPin, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/config/contact";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const serviceColumns = [
  {
    title: "Umzüge",
    icon: Truck,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    items: [
      { href: "/leistungen#umzuege", label: "Privatumzug", desc: "Stressfreier Wohnungswechsel" },
      { href: "/leistungen#buero", label: "Büroumzug", desc: "Professionell & termingerecht" },
      { href: "/leistungen/umzug", label: "Fernumzug", desc: "Deutschlandweiter Service" },
      { href: "/buchen?service=express", label: "Expressumzug", desc: "Kurzfristig & schnell", badge: "Express" },
    ],
  },
  {
    title: "Reinigung",
    icon: SprayCan,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    items: [
      { href: "/leistungen#reinigung", label: "Wohnungsreinigung", desc: "Gründlich & zuverlässig" },
      { href: "/leistungen#reinigung", label: "Büroreinigung", desc: "Regelmäßiger Service" },
      { href: "/leistungen#reinigung", label: "Endreinigung", desc: "Bei Auszug & Übergabe" },
      { href: "/leistungen#reinigung", label: "Tiefenreinigung", desc: "Intensiv & hygienisch" },
    ],
  },
  {
    title: "Entrümpelung",
    icon: Trash2,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    items: [
      { href: "/leistungen#entruempelung", label: "Wohnungsauflösung", desc: "Komplett-Service" },
      { href: "/leistungen#entruempelung", label: "Bauschutt", desc: "Fachgerechte Entsorgung" },
      { href: "/leistungen#entruempelung", label: "Recycling", desc: "Umweltbewusst entsorgen" },
    ],
  },
  {
    title: "Für Unternehmen",
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    items: [
      { href: "/unternehmen", label: "Firmenverträge", desc: "Individuelle Konditionen" },
      { href: "/leistungen#schule", label: "Schulumzüge", desc: "In Ferienzeiten" },
      { href: "/unternehmen#ausschreibung", label: "Ausschreibung", desc: "Jetzt einreichen" },
    ],
  },
];

const navLinks = [
  { href: "/", label: "Startseite", mobileIcon: Home },
  { href: "/leistungen", label: "Leistungen", mobileIcon: Briefcase, hasMega: true },
  { href: "/buchen", label: "Preise & Buchen", mobileIcon: Zap },
  { href: "/unternehmen", label: "Für Unternehmen", mobileIcon: Building2 },
  { href: "/kontakt", label: "Kontakt", mobileIcon: Mail },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(false);
  const pathname = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileAccordion(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openMega = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top info bar */}
      <div className="hidden lg:block bg-navy-800 dark:bg-navy-950 text-white/90 py-2">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
              <Phone size={12} />
              <span className="font-medium">{CONTACT.PRIMARY_PHONE_DISPLAY}</span>
            </a>
            <span className="w-px h-3 bg-white/20" />
            <a href={`mailto:${CONTACT.EMAIL}`} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
              <Mail size={12} />
              <span>{CONTACT.EMAIL}</span>
            </a>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1.5 text-white/60">
              <MapPin size={12} /> Deutschlandweit
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock size={12} />
            <span>{CONTACT.AVAILABILITY}</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/70 dark:bg-navy-900/70 backdrop-blur-2xl shadow-lg shadow-black/[0.04] dark:shadow-black/20 border-b border-white/30 dark:border-white/[0.06]"
            : "bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-gray-100 dark:border-navy-800/80"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <Image
                  src="/images/logo.jpeg"
                  alt="Seel Transport"
                  width={44}
                  height={44}
                  priority
                  className="h-[44px] w-[44px] rounded-xl group-hover:scale-105 transition-transform duration-300 ring-1 ring-black/5 dark:ring-white/10"
                />
                <div className="absolute -inset-1 rounded-xl bg-teal-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-navy-800 dark:text-white tracking-tight">SEEL</span>
                <span className="text-[10px] block text-silver-500 dark:text-silver-400 -mt-0.5 font-medium tracking-wide">
                  Transport & Reinigung
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                if (link.hasMega) {
                  return (
                    <div
                      key={link.href}
                      ref={megaRef}
                      className="relative"
                      onMouseEnter={openMega}
                      onMouseLeave={closeMega}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "relative flex items-center gap-1 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 group",
                          isActive(link.href) || megaOpen
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-navy-700 dark:text-silver-200 hover:text-teal-600 dark:hover:text-teal-400"
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          size={13}
                          className={cn(
                            "transition-transform duration-300",
                            megaOpen && "rotate-180"
                          )}
                        />
                        {(isActive(link.href) || megaOpen) && (
                          <motion.div
                            layoutId="nav-active-pill"
                            className="absolute inset-0 bg-teal-50 dark:bg-teal-500/10 rounded-xl -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Link>

                      {/* Mega dropdown */}
                      <AnimatePresence>
                        {megaOpen && (
                          <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[760px]"
                          >
                            <div className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl rounded-2xl border border-white/40 dark:border-white/[0.08] shadow-2xl shadow-black/10 dark:shadow-black/30 p-6 ring-1 ring-black/[0.03]">
                              <div className="grid grid-cols-4 gap-5">
                                {serviceColumns.map((col) => {
                                  const Icon = col.icon;
                                  return (
                                    <div key={col.title}>
                                      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100/80 dark:border-navy-700/50">
                                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", col.bgColor)}>
                                          <Icon size={14} className={col.color} />
                                        </div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-navy-800 dark:text-white">
                                          {col.title}
                                        </span>
                                      </div>
                                      <ul className="space-y-0.5">
                                        {col.items.map((item) => (
                                          <li key={item.label}>
                                            <Link
                                              href={item.href}
                                              className="block px-2.5 py-2 rounded-lg hover:bg-teal-50/80 dark:hover:bg-teal-500/10 transition-all duration-200 group/item"
                                            >
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[13px] font-medium text-navy-800 dark:text-silver-100 group-hover/item:text-teal-600 dark:group-hover/item:text-teal-400 transition-colors">
                                                  {item.label}
                                                </span>
                                                {item.badge && (
                                                  <span className="text-[9px] px-1.5 py-px bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold uppercase tracking-wide">
                                                    {item.badge}
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-[11px] text-silver-500 dark:text-silver-400 mt-0.5 leading-tight">
                                                {item.desc}
                                              </p>
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Mega footer */}
                              <div className="mt-5 pt-4 border-t border-gray-100/80 dark:border-navy-700/50 flex items-center justify-between">
                                <Link
                                  href="/leistungen"
                                  className="text-[13px] text-teal-600 dark:text-teal-400 font-semibold hover:underline underline-offset-2 flex items-center gap-1.5 group/all"
                                >
                                  Alle Leistungen ansehen
                                  <ArrowRight size={14} className="group-hover/all:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link
                                  href="/buchen"
                                  className="btn-shine text-[13px] px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all font-bold shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5"
                                >
                                  Jetzt buchen
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300",
                      isActive(link.href)
                        ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10"
                        : "text-navy-700 dark:text-silver-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href={`tel:${CONTACT.PRIMARY_PHONE}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-navy-600 dark:text-silver-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <Phone size={15} className="text-teal-500" />
                <span className="hidden xl:inline">{CONTACT.PRIMARY_PHONE_DISPLAY}</span>
              </a>

              <span className="w-px h-5 bg-gray-200 dark:bg-navy-700" />

              <ThemeToggle />

              <Link
                href="/buchen"
                className="btn-shine border border-teal-400 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[13px] font-bold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Jetzt buchen
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:${CONTACT.PRIMARY_PHONE}`}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
                aria-label="Anrufen"
              >
                <Phone size={20} className="text-teal-500" />
              </a>
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors text-navy-800 dark:text-white"
                aria-label="Menü öffnen"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] z-[70] bg-white dark:bg-navy-900 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="p-5">
                {/* Drawer header */}
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                    <Image
                      src="/images/logo.jpeg"
                      alt="Seel Transport"
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-lg"
                    />
                    <div>
                      <span className="text-base font-bold text-navy-800 dark:text-white">SEEL</span>
                      <span className="text-[9px] block text-silver-500 dark:text-silver-400 -mt-0.5">Transport & Reinigung</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
                    aria-label="Schließen"
                  >
                    <X size={22} className="text-navy-800 dark:text-white" />
                  </button>
                </div>

                {/* Mobile nav links */}
                <div className="space-y-0.5">
                  {navLinks.map((link) => {
                    const MIcon = link.mobileIcon;

                    if (link.hasMega) {
                      return (
                        <div key={link.href}>
                          <button
                            onClick={() => setMobileAccordion(!mobileAccordion)}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                              isActive(link.href)
                                ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-500/10"
                                : "text-navy-700 dark:text-silver-200 hover:bg-gray-50 dark:hover:bg-navy-800"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <MIcon size={18} />
                              {link.label}
                            </span>
                            <ChevronDown
                              size={16}
                              className={cn("transition-transform duration-300", mobileAccordion && "rotate-180")}
                            />
                          </button>

                          <AnimatePresence>
                            {mobileAccordion && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 py-2 space-y-4">
                                  {serviceColumns.map((col) => {
                                    const CIcon = col.icon;
                                    return (
                                      <div key={col.title}>
                                        <div className="flex items-center gap-2 mb-1.5 px-2">
                                          <div className={cn("w-5 h-5 rounded flex items-center justify-center", col.bgColor)}>
                                            <CIcon size={11} className={col.color} />
                                          </div>
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-800 dark:text-silver-300">
                                            {col.title}
                                          </span>
                                        </div>
                                        <ul className="space-y-0.5 pl-5">
                                          {col.items.map((item) => (
                                            <li key={item.label}>
                                              <Link
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="block py-1.5 px-2 text-[13px] text-silver-600 dark:text-silver-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors"
                                              >
                                                {item.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                          isActive(link.href)
                            ? "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-500/10"
                            : "text-navy-700 dark:text-silver-200 hover:bg-gray-50 dark:hover:bg-navy-800"
                        )}
                      >
                        <MIcon size={18} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* CTA + contact */}
                <div className="mt-6 pt-5 border-t border-gray-200 dark:border-navy-700/60 space-y-3">
                  <Link
                    href="/buchen"
                    onClick={() => setMobileOpen(false)}
                    className="btn-shine flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 text-sm"
                  >
                    Jetzt buchen <ArrowRight size={16} />
                  </Link>
                  <div className="space-y-1">
                    <a
                      href={`tel:${CONTACT.PRIMARY_PHONE}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-navy-700 dark:text-silver-300 hover:bg-gray-50 dark:hover:bg-navy-800 rounded-xl transition-colors"
                    >
                      <Phone size={16} className="text-teal-500" />
                      {CONTACT.PRIMARY_PHONE_DISPLAY}
                    </a>
                    <a
                      href={`mailto:${CONTACT.EMAIL}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-navy-700 dark:text-silver-300 hover:bg-gray-50 dark:hover:bg-navy-800 rounded-xl transition-colors"
                    >
                      <Mail size={16} className="text-teal-500" />
                      {CONTACT.EMAIL}
                    </a>
                    <div className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-silver-400">
                      <Clock size={16} />
                      {CONTACT.AVAILABILITY}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
