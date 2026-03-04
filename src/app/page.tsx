"use client";

import { CONTACT } from "@/config/contact";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  SprayCan,
  Building2,
  GraduationCap,
  Trash2,
  ClipboardCheck,
  CalendarCheck,
  ThumbsUp,
  Phone,
  Star,
  Shield,
  ChevronDown,
  ArrowRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import HeroVideo from "@/components/three/HeroVideo";

// DATA

const services = [
  {
    icon: Truck,
    title: "Umzüge & Möbeltransporte",
    desc: "Professioneller Umzugsservice mit modernen 3,5-Tonnen-Fahrzeugen und erfahrenem Team. Sicher, pünktlich und stressfrei.",
    href: "/leistungen/umzug",
    gradient: "from-blue-500 to-blue-700",
    image: "/images/moving-workers-furniture.png",
    price: "ab 45 €/Std.",
  },
  {
    icon: Building2,
    title: "Büro- & Gewerbeumzüge",
    desc: "Effiziente Büroumzüge mit minimaler Ausfallzeit. IT-Equipment, Möbel und sensible Dokumente.",
    href: "/leistungen/gewerbe",
    gradient: "from-teal-500 to-teal-700",
    image: "/images/corporate-hallway-cleaning.png",
    price: "ab 45 €/Std.",
  },
  {
    icon: GraduationCap,
    title: "Schulumzüge",
    desc: "Spezialisierte Umzüge für Schulen und Bildungseinrichtungen mit besonderer Sorgfalt.",
    href: "/leistungen/umzug",
    gradient: "from-amber-500 to-orange-600",
    image: "/images/corporate-school-cleaning.png",
    price: "ab 45 €/Std.",
  },
  {
    icon: SprayCan,
    title: "Reinigungsservice",
    desc: "Gründliche Reinigung von Wohnungen, Büros und Treppenhäusern. Umweltfreundlich und zuverlässig.",
    href: "/leistungen/endreinigung",
    gradient: "from-green-500 to-emerald-600",
    image: "/images/cleaning-team-office.png",
    price: "ab 34 €/Std.",
  },
  {
    icon: Trash2,
    title: "Entrümpelung & Entsorgung",
    desc: "Schnelle und umweltgerechte Entrümpelung inklusive fachgerechter Entsorgung.",
    href: "/leistungen/entsorgung",
    gradient: "from-red-500 to-rose-600",
    image: "/images/waste-disposal-van.png",
    price: "ab 42 €/Std.",
  },
  {
    icon: Zap,
    title: "Expressumzug",
    desc: "Kurzfristiger Umzug innerhalb von 24–48 Stunden. Priorisierter Service für dringende Fälle.",
    href: "/leistungen/expressumzug",
    gradient: "from-amber-400 to-yellow-500",
    image: "/images/moving-truck-hero.png",
    price: "ab 65 €/Std.",
    badge: "Express",
  },
];

const steps = [
  { icon: ClipboardCheck, title: "Service wählen", desc: "Wählen Sie Ihren gewünschten Service und geben Sie die Details ein." },
  { icon: CalendarCheck, title: "Termin buchen", desc: "Wählen Sie Ihren Wunschtermin und erhalten Sie sofort ein transparentes Angebot." },
  { icon: ThumbsUp, title: "Wir erledigen den Rest", desc: "Unser Team kümmert sich um alles – pünktlich und zuverlässig." },
];

const statsData = [
  { value: 500, suffix: "+", label: "Erfolgreiche Umzüge" },
  { value: 98, suffix: "%", label: "Kundenzufriedenheit" },
  { value: 24, suffix: "/7", label: "Erreichbarkeit" },
  { value: 10, suffix: "+", label: "Jahre Erfahrung" },
];

const testimonials = [
  { name: "Maria S.", text: "Sehr professioneller und freundlicher Service. Der Umzug lief reibungslos und schneller als erwartet.", rating: 5, service: "Umzug" },
  { name: "Thomas K.", text: "Die Büroreinigung war erstklassig. Das Team war gründlich, pünktlich und hat alles perfekt hinterlassen.", rating: 5, service: "Reinigung" },
  { name: "Sandra M.", text: "Unsere Schulrenovierung erforderte einen kompletten Umzug. Seel Transport hat alles perfekt organisiert.", rating: 5, service: "Schulumzug" },
];

const faqs = [
  { q: "Wie berechnet sich der Preis für einen Umzug?", a: "Der Preis setzt sich aus Stundensatz, Volumen, Entfernung, Arbeitskräften und eventuellen Zuschlägen zusammen. Über unseren Online-Rechner erhalten Sie sofort ein transparentes Angebot." },
  { q: "Bieten Sie auch Wochenend-Umzüge an?", a: "Ja, wir sind 24/7 für Sie da – auch an Wochenenden und Feiertagen. Für Wochenenden wird ein Zuschlag von 30% erhoben." },
  { q: "Sind meine Möbel während des Transports versichert?", a: "Gemäß HGB §451e haften wir mit bis zu 620 € pro Kubikmeter. Zusätzlich bieten wir erweiterte Versicherungsoptionen an." },
  { q: "Kann ich online bezahlen?", a: "Ja, wir bieten Zahlung per Überweisung, Barzahlung und PayPal an." },
  { q: "Was kostet ein Expressumzug?", a: "Expressumzüge beginnen ab 65 €/Std. mit einem Prioritätszuschlag von 40% auf den regulären Umzugspreis. Buchung innerhalb von 24–48 Stunden möglich." },
];

// COMPONENTS

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-teal-400">
      {count}{suffix}
    </div>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: { icon: LucideIcon; title: string; desc: string; href: string; gradient: string; image: string; price: string; badge?: string };
  index: number;
}) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link
        href={service.href}
        className="group block relative rounded-[2rem] overflow-hidden h-full glass-card hover:-translate-y-2"
      >
        {service.badge && (
          <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-400 to-yellow-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {service.badge}
          </div>
        )}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-navy-800 via-black/5 to-transparent" />
        </div>
        <div className="p-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 shadow-md`}>
            <Icon className="text-white" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-navy-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-silver-500 dark:text-silver-300 text-sm leading-relaxed mb-3">{service.desc}</p>
          <div className="flex items-center justify-between">
            <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">{service.price}</span>
            <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              Mehr <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// PAGE

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[100vh] flex items-center bg-navy-900 text-white">
        <HeroVideo />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-teal-300 px-5 py-2.5 text-sm mb-8 shadow-lg">
                <Shield size={16} />
                Ihr Partner in Deutschland seit über 10 Jahren
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
                Zuverlässige{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-teal-400">
                  Umzüge
                </span>
                <br />
                und gründliche{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-teal-400">
                  Reinigung
                </span>
              </h1>

              <p className="text-lg md:text-xl text-silver-200 mb-10 leading-relaxed max-w-xl">
                Professionelle Umzüge, Möbeltransporte und Reinigungsdienste – alles aus einer Hand. Zuverlässig, schnell und mit höchster Sorgfalt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/buchen"
                  className="btn-shine group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-400 font-bold rounded-2xl hover:from-teal-400 hover:to-teal-300 transition-all duration-300 shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-1"
                >
                  Jetzt Angebot erhalten
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`tel:${CONTACT.PRIMARY_PHONE}`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <Phone size={20} />
                  {CONTACT.PRIMARY_PHONE_DISPLAY}
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 mt-12">
                <div className="flex -space-x-3">
                  {["A", "B", "C", "D"].map((letter) => (
                    <div key={letter} className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-navy-600 border-2 border-navy-800 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-silver-400 text-sm">500+ zufriedene Kunden</p>
                </div>
              </div>
            </motion.div>

            {/* Hero right — image card with glass frame */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main image card */}
                <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-navy-950/60 backdrop-blur-sm">
                  <div className="relative h-[420px]">
                    <Image
                      src="/images/moving-workers-furniture.png"
                      alt="Seel Transport Team"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
                  </div>
                  {/* Glass overlay card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Heute verfügbar</p>
                        <p className="text-silver-300 text-xs">Expressumzug ab 24h möglich</p>
                      </div>
                      <Link href="/buchen?service=EXPRESS_MOVING" className="ml-auto text-xs bg-teal-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-teal-400 transition-colors">
                        Buchen
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating badge top right */}
                <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Zap size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Express</p>
                      <p className="text-teal-400 text-xs font-semibold">ab 65 €/Std.</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge bottom left */}
                <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                      <Shield size={16} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Versichert</p>
                      <p className="text-silver-300 text-xs">HGB §451e</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-silver-400"
          >
            <span className="text-xs tracking-widest uppercase">Scrollen</span>
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 sm:py-32 bg-gray-50/80 dark:bg-navy-950" id="services">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider">Unsere Leistungen</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mt-3 mb-4">
              Alles aus einer Hand
            </h2>
            <p className="text-silver-500 dark:text-silver-300 max-w-2xl mx-auto">
              Von professionellen Umzügen über gründliche Reinigung bis hin zur fachgerechten Entrümpelung – der komplette Service aus Berlin.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/leistungen" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-teal-500 text-teal-600 dark:text-teal-400 font-semibold rounded-xl hover:bg-teal-500 hover:text-white transition-all duration-300">
              Alle Leistungen ansehen <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-32 bg-white dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider">So funktioniert&apos;s</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mt-3 mb-4">
              In 3 Schritten zum Ziel
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal-300 dark:from-teal-600 to-transparent" />
                  )}
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center mb-6 relative group hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors">
                    <Icon className="text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" size={36} />
                    <span className="absolute -top-3 -right-3 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-navy-800 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-silver-500 dark:text-silver-300 text-sm">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/buchen"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-teal-300 transition-all shadow-lg shadow-teal-500/25"
            >
              Jetzt buchen
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy-800 text-white py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-64 h-64 bg-teal-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-blue-500 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat) => (
              <div key={stat.label} className="text-center">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-silver-300 mt-2 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-32 bg-gray-50/80 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider">Kundenbewertungen</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mt-3 mb-4">
              Was unsere Kunden sagen
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <div className="bg-white/80 dark:bg-navy-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/60 dark:border-navy-700/50 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={18} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-navy-700 dark:text-silver-200 mb-6 leading-relaxed">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-navy-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-800 dark:text-white text-sm">{t.name}</p>
                      <p className="text-silver-500 dark:text-silver-400 text-xs">{t.service}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B TEASER */}
      <section className="py-20 sm:py-32 bg-white dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="/images/corporate-glass-cleaning.png"
                alt="Business Solutions"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/50" />
            </div>
            <div className="relative z-10 text-white p-8 md:p-16 max-w-2xl">
              <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Für Unternehmen</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
                Maßgeschneiderte Lösungen für Ihr Unternehmen
              </h2>
              <p className="text-silver-300 mb-8 leading-relaxed">
                Jahresverträge für Reinigungsdienste, Büroumzüge und mehr. Profitieren Sie von transparenter Preisgestaltung und zuverlässigem Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/unternehmen" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-500 font-semibold rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25">
                  Mehr erfahren <ArrowRight size={20} />
                </Link>
                <Link href="/kontakt" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all">
                  Kontakt aufnehmen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISPOSAL CTA with real images */}
      <section className="py-20 sm:py-24 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/leistungen/entsorgung" className="group relative rounded-2xl overflow-hidden h-64 block">
              <Image src="/images/waste-disposal-apartment.png" alt="Entrümpelung" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm text-teal-300 font-semibold mb-1">Entrümpelung</p>
                <h3 className="text-xl font-bold mb-2">Wohnungsräumung</h3>
                <div className="flex items-center gap-2 text-sm text-silver-300 group-hover:text-white transition-colors">
                  Mehr erfahren <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            <Link href="/leistungen/entsorgung" className="group relative rounded-2xl overflow-hidden h-64 block">
              <Image src="/images/waste-disposal-recycling.png" alt="Entsorgung" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm text-teal-300 font-semibold mb-1">Entsorgung</p>
                <h3 className="text-xl font-bold mb-2">Umweltgerechtes Recycling</h3>
                <div className="flex items-center gap-2 text-sm text-silver-300 group-hover:text-white transition-colors">
                  Mehr erfahren <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-32 bg-white dark:bg-navy-950" id="faq">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mt-3 mb-4">
              Häufig gestellte Fragen
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-navy-800/60 backdrop-blur-sm rounded-xl border border-white/60 dark:border-navy-700/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50/80 dark:hover:bg-navy-700/30 transition-colors"
                >
                  <span className="font-medium text-navy-800 dark:text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-silver-400 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 pb-5 text-silver-500 dark:text-silver-300 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-white mb-6">
              Bereit für Ihren Umzug?
            </h2>
            <p className="text-silver-500 dark:text-silver-300 mb-8 max-w-2xl mx-auto">
              Erhalten Sie jetzt ein unverbindliches Angebot. Unser Team steht Ihnen 24/7 zur Verfügung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/buchen"
                className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-teal-300 transition-all shadow-lg shadow-teal-500/25"
              >
                Jetzt Angebot anfordern
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`tel:${CONTACT.PRIMARY_PHONE}`}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-navy-800 dark:border-silver-300 text-navy-800 dark:text-white font-semibold rounded-xl hover:bg-navy-800 dark:hover:bg-white/10 hover:text-white transition-all"
              >
                <Phone size={20} />
                {CONTACT.PRIMARY_PHONE_DISPLAY}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
