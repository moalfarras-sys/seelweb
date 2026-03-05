"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Truck, Building2, Trash2, Sparkles, ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";

type ServiceCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  href: string;
  image: string;
};

const cards: ServiceCard[] = [
  {
    id: "umzug",
    title: "Umzug & Privatumzug",
    subtitle: "Sicher, pünktlich und stressfrei",
    description:
      "Von der 1-Zimmer-Wohnung bis zum kompletten Hausumzug: Wir planen jede Etappe präzise und transportieren Ihr Inventar mit professioneller Sicherung.",
    bullets: ["Feste Ansprechpartner", "Möbelmontage inklusive Option", "Versicherung nach HGB §451e", "Berlin & Umland"],
    href: "/leistungen/privatumzug",
    image: "/images/moving-truck-hero.png",
  },
  {
    id: "firmenumzug",
    title: "Firmenumzug & Büroservice",
    subtitle: "Minimale Ausfallzeit im Betrieb",
    description:
      "Wir verlegen Arbeitsplätze, Archive und IT-Strukturen mit klaren Zeitfenstern, damit Ihr Tagesgeschäft ohne unnötige Unterbrechung weiterläuft.",
    bullets: ["Wochenendtermine", "IT-Equipment Handling", "Projektplan mit Meilensteinen", "DSGVO-sensibler Dokumententransport"],
    href: "/leistungen/firmenumzug",
    image: "/images/corporate-hallway-cleaning.png",
  },
  {
    id: "entruempelung",
    title: "Entrümpelung & Entsorgung",
    subtitle: "Fachgerecht und nachvollziehbar",
    description:
      "Wohnung, Keller, Dachboden oder Gewerbeobjekt: Wir räumen effizient, trennen Wertstoffe sauber und entsorgen gemäß den geltenden Vorschriften.",
    bullets: ["Besenreine Übergabe", "Nachweisbare Entsorgung", "Kurzfristige Termine", "Transparente Volumenkalkulation"],
    href: "/leistungen/entruempelung",
    image: "/images/waste-disposal-van.png",
  },
  {
    id: "reinigung",
    title: "Reinigung nach Maß",
    subtitle: "Wohnung, Büro, Übergabe",
    description:
      "Unsere Reinigungsteams arbeiten strukturiert mit professionellen Checklisten für Endreinigung, Unterhaltsreinigung und Sonderreinigung.",
    bullets: ["Ergebnisorientierte Endkontrolle", "Flexible Intervalle", "Geeignet für Privat & Gewerbe", "Moderne, materialschonende Verfahren"],
    href: "/leistungen/reinigung",
    image: "/images/cleaning-team-office.png",
  },
];

const quickLinks = [
  { label: "Umzug Berlin", href: "/leistungen/umzug-berlin", icon: MapPin },
  { label: "Deutschlandweite Umzüge", href: "/leistungen/deutschlandweite-umzuege", icon: Truck },
  { label: "Transport-Service", href: "/leistungen/transport", icon: ShieldCheck },
  { label: "Expressumzug", href: "/leistungen/expressumzug", icon: Sparkles },
];

export default function LeistungenPage() {
  return (
    <>
      <section className="gradient-navy py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold text-white">
            Leistungen für Umzug, Transport und Reinigung
          </motion.h1>
          <p className="text-silver-300 mt-6 max-w-3xl mx-auto text-lg">
            Premium-Service für private und gewerbliche Kunden. Klar kalkuliert, sauber organisiert und zuverlässig ausgeführt.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white hover:bg-white/20 transition-colors">
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-8">
          {cards.map((card) => (
            <article key={card.id} className="group rounded-2xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-56">
                <Image src={card.image} alt={card.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <h2 className="absolute left-5 bottom-5 text-2xl font-bold text-white">{card.title}</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-teal-600 font-semibold">{card.subtitle}</p>
                <p className="mt-3 text-silver-700 dark:text-silver-200 leading-relaxed">{card.description}</p>
                <ul className="mt-4 space-y-2">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-navy-700 dark:text-silver-200">
                      <CheckCircle2 size={16} className="text-teal-500 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={card.href} className="mt-5 inline-flex items-center gap-2 font-semibold text-teal-600 hover:text-teal-500">
                  Details ansehen <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding gradient-navy">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Jetzt Angebot in unter 2 Minuten starten</h2>
          <p className="text-silver-300 mt-4">Wählen Sie Leistung, Termin und Adressen. Sie erhalten sofort eine transparente Preisübersicht.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/buchen" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors">
              Jetzt buchen <ArrowRight size={18} />
            </Link>
            <Link href="/kontakt" className="inline-flex items-center justify-center px-8 py-4 rounded-xl glass text-white hover:bg-white/15 transition-colors">
              Beratung anfragen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
