"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Truck,
  SprayCan,
  Building2,
  GraduationCap,
  Trash2,
  ArrowRight,
  Check,
  Shield,
  Clock,
  Star,
  Package,
  Wrench,
  Sparkles,
  Recycle,
  ChevronDown,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";

const services = [
  {
    id: "umzuege",
    icon: Truck,
    title: "UmzÃ¼ge & MÃ¶beltransporte",
    subtitle: "Privat- und WohnungsumzÃ¼ge in Berlin",
    description:
      "Professioneller Umzugsservice mit modernen 3,5-Tonnen-Fahrzeugen und geschultem Personal. Wir transportieren Ihre MÃ¶bel sicher, pÃ¼nktlich und stressfrei â€“ vom Kleinumzug bis zum Komplettumzug.",
    features: [
      "Moderne 3,5-Tonnen Fahrzeuge",
      "Erfahrenes und geschultes Personal",
      "MÃ¶belmontage und -demontage",
      "Verpackungsmaterial inklusive",
      "Halteverbot-Einrichtung mÃ¶glich",
      "Versicherung gemÃ¤ÃŸ HGB Â§451e",
      "Flexible Terminplanung",
      "Transparente Preisgestaltung",
    ],
    gradient: "from-blue-500 to-navy-800",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    price: "45",
    image: "/images/moving-truck-hero.png",
    extras: [
      { icon: Package, label: "Verpackungsservice" },
      { icon: Wrench, label: "MÃ¶belmontage" },
      { icon: Shield, label: "Transportversicherung" },
    ],
  },
  {
    id: "buero",
    icon: Building2,
    title: "BÃ¼roumzÃ¼ge",
    subtitle: "Professionelle FirmenumzÃ¼ge",
    description:
      "Effiziente BÃ¼roumzÃ¼ge mit minimaler Ausfallzeit. Wir kÃ¼mmern uns um IT-Equipment, BÃ¼romÃ¶bel und sensible Dokumente. Planung und DurchfÃ¼hrung aus einer Hand.",
    features: [
      "Minimale Betriebsunterbrechung",
      "IT-Equipment-Transport",
      "Aktenvernichtung auf Wunsch",
      "WochenendumzÃ¼ge mÃ¶glich",
      "Einrichtungsplanung",
      "Netzwerk-Neuverkabelung",
      "Projektmanagement",
      "Versicherungsschutz fÃ¼r sensible GerÃ¤te",
    ],
    gradient: "from-teal-500 to-teal-700",
    bgColor: "bg-teal-50 dark:bg-teal-500/10",
    price: "49",
    image: "/images/corporate-hallway-cleaning.png",
    extras: [
      { icon: Clock, label: "Am Wochenende mÃ¶glich" },
      { icon: Shield, label: "Spezialversicherung" },
      { icon: Sparkles, label: "Endreinigung" },
    ],
  },
  {
    id: "schule",
    icon: GraduationCap,
    title: "SchulumzÃ¼ge",
    subtitle: "Schulen, KindergÃ¤rten & Bildungseinrichtungen",
    description:
      "Spezialisierte UmzÃ¼ge fÃ¼r Bildungseinrichtungen. Reibungsloser Ablauf â€“ in den Ferienzeiten oder bei laufendem Betrieb mit besonderer Sorgfalt.",
    features: [
      "Umzug in den Schulferien",
      "Sensible Handhabung von Lehrmaterial",
      "Transport von Spiel- und SportgerÃ¤ten",
      "Einrichtung neuer RÃ¤umlichkeiten",
      "Koordination mit Schulleitung",
      "Entsorgung alter MÃ¶bel und GerÃ¤te",
      "Reinigung der alten RÃ¤umlichkeiten",
      "JahresvertrÃ¤ge fÃ¼r Institutionen",
    ],
    gradient: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    price: "49",
    image: "/images/corporate-school-cleaning.png",
    extras: [
      { icon: Recycle, label: "Umweltgerechte Entsorgung" },
      { icon: Sparkles, label: "Endreinigung" },
      { icon: Clock, label: "FerienumzÃ¼ge" },
    ],
  },
  {
    id: "reinigung",
    icon: SprayCan,
    title: "Reinigungsservice",
    subtitle: "Wohnungen, BÃ¼ros, Schulen & TreppenhÃ¤user",
    description:
      "GrÃ¼ndliche und professionelle Reinigung fÃ¼r jeden Bereich. Von der WohnungsÃ¼bergabereinigung Ã¼ber die regelmÃ¤ÃŸige BÃ¼roreinigung â€“ umweltfreundlich und zuverlÃ¤ssig.",
    features: [
      "WohnungsÃ¼bergabereinigung",
      "BÃ¼ro- und Praxisreinigung",
      "Treppenhausreinigung",
      "Schulen und KindergÃ¤rten",
      "Fensterreinigung",
      "Grundreinigung und Unterhaltsreinigung",
      "Umweltfreundliche Reinigungsmittel",
      "RegelmÃ¤ÃŸige oder einmalige Reinigung",
    ],
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-500/10",
    price: "34",
    image: "/images/cleaning-team-office.png",
    extras: [
      { icon: Recycle, label: "Umweltfreundlich" },
      { icon: Clock, label: "RegelmÃ¤ÃŸig buchbar" },
      { icon: Star, label: "QualitÃ¤tsgarantie" },
    ],
  },
  {
    id: "entruempelung",
    icon: Trash2,
    title: "EntrÃ¼mpelung",
    subtitle: "Wohnungen, Keller, BÃ¼ros & DachbÃ¶den",
    description:
      "Schnelle und umweltgerechte EntrÃ¼mpelung. Wir rÃ¤umen Wohnungen, Keller, DachbÃ¶den und BÃ¼ros â€“ inklusive fachgerechter Entsorgung und Recycling.",
    features: [
      "WohnungsentrÃ¼mpelung",
      "Keller- und DachbodenrÃ¤umung",
      "BÃ¼roauflÃ¶sungen",
      "Fachgerechte Entsorgung",
      "Recycling und Wiederverwertung",
      "SperrmÃ¼llabfuhr",
      "Besenreine Ãœbergabe",
      "Nachweisliche Entsorgung",
    ],
    gradient: "from-red-500 to-rose-600",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    price: "42",
    image: "/images/waste-disposal-van.png",
    extras: [
      { icon: Recycle, label: "Recycling" },
      { icon: Sparkles, label: "Besenrein" },
      { icon: Shield, label: "Entsorgungsnachweis" },
    ],
  },
];

const serviceQueryMap: Record<string, string> = {
  umzuege: "MOVING",
  buero: "MOVING",
  schule: "MOVING",
  reinigung: "HOME_CLEANING",
  entruempelung: "DISPOSAL",
};

export default function LeistungenPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-navy py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-20 w-72 h-72 bg-teal-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div initial={{ opacity : 0, y: 30 }} animate={{ opacity : 1, y: 0 }} transition={{ duration : 0.7 }}
          >
            <span className="inline-flex items-center gap-2 glass rounded-full text-teal-400 px-5 py-2.5 text-sm mb-8 border-glow">
              <Star size={16} />
              Unsere Leistungen
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-3 mb-6">
              Professionelle Dienstleistungen
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">
                fÃ¼r jeden Bedarf
              </span>
            </h1>
            <p className="text-silver-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Von UmzÃ¼gen Ã¼ber Reinigung bis zur EntrÃ¼mpelung â€“ alles aus einer Hand mit hÃ¶chster QualitÃ¤t und ZuverlÃ¤ssigkeit.
            </p>
          </motion.div>

          {/* Scroll hint */}
          <motion.div initial={{ opacity : 0 }} animate={{ opacity : 1 }} transition={{ delay : 0.8 }}
            className="mt-12 scroll-indicator"
          >
            <ChevronDown size={24} className="text-silver-400 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white dark:bg-navy-950 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-32 overflow-x-hidden">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isEven = i % 2 === 0;
            return (
              <ScrollReveal key={service.id}>
                <div id={service.id} className="scroll-mt-24">
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-dense" : ""}`}>
                    {/* Text */}
                    <div className={!isEven ? "lg:col-start-2" : ""}>
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div whileHover={{ scale : 1.1, rotate: 5 }}
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="text-white" size={32} />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-white">{service.title}</h2>
                          <p className="text-silver-600 dark:text-silver-200 text-sm">{service.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-silver-600 dark:text-silver-200 leading-relaxed mb-8 break-words">{service.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {service.features.map((feature, fi) => (
                          <motion.div
                            key={feature} initial={{ opacity : 0, x: -10 }} whileInView={{ opacity : 1, x: 0 }} viewport={{ once : true }} transition={{ delay : fi * 0.04 }}
                            className="flex items-start gap-2"
                          >
                            <Check size={18} className="text-teal-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-navy-700 dark:text-silver-200">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      <Link
                        href={`/buchen?service=${serviceQueryMap[service.id] ?? ""}`}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 btn-shine"
                      >
                        Jetzt buchen
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Card side */}
                    <div className={!isEven ? "lg:col-start-1" : ""}>
                      <TiltCard>
                        <div className={`${service.bgColor} rounded-2xl p-8 md:p-10 glass-reflect border border-white/10 dark:border-navy-700/50`}>
                          {service.image && (
                            <div className="relative h-48 rounded-xl overflow-hidden mb-8 shadow-md">
                              <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 40vw"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                          )}

                          <div className="space-y-4">
                            {service.extras.map((extra, ei) => {
                              const ExtraIcon = extra.icon;
                              return (
                                <motion.div
                                  key={extra.label} initial={{ opacity : 0, y: 10 }} whileInView={{ opacity : 1, y: 0 }} viewport={{ once : true }} transition={{ delay : ei * 0.1 }}
                                  className="flex items-center gap-4 bg-white dark:bg-navy-800/60 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-navy-700/50 hover:shadow-md transition-shadow"
                                >
                                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-sm`}>
                                    <ExtraIcon className="text-white" size={22} />
                                  </div>
                                  <span className="font-medium text-navy-800 dark:text-white">{extra.label}</span>
                                </motion.div>
                              );
                            })}
                          </div>

                          <div className="mt-8 p-6 glass rounded-xl">
                            <p className="text-sm text-silver-500 dark:text-silver-400 mb-1">Ab</p>
                            <p className="text-3xl font-bold text-navy-800 dark:text-white">
                              {service.price} <span className="text-lg font-normal text-silver-400">€/Std.</span>
                            </p>
                            <p className="text-xs text-silver-500 dark:text-silver-400 mt-1">zzgl. MwSt. · Endpreis abhängig von Umfang</p>
                          </div>
                        </div>
                      </TiltCard>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-teal-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Kostenlos und unverbindlich anfragen
            </h2>
            <p className="text-silver-300 mb-8 max-w-2xl mx-auto">
              Nutzen Sie unseren Online-Rechner fÃ¼r ein sofortiges Angebot oder kontaktieren Sie uns direkt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/buchen"
                className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25 btn-shine"
              >
                Angebot berechnen
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 glass rounded-xl text-white hover:bg-white/15 transition-all"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}


