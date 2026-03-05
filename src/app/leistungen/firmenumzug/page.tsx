import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Firmenumzug Berlin | SEEL Transport",
  description: "Firmenumzug mit klarer Projektplanung, IT-sicherem Transport und minimaler Betriebsunterbrechung.",
  alternates: { canonical: "https://seeltransport.de/leistungen/firmenumzug" },
};

export default function FirmenumzugPage() {
  return (
    <section className="gradient-navy py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Firmenumzug mit Plan</h1>
          <p className="text-silver-300 mt-5 text-lg">Wir koordinieren Arbeitsplätze, Technik und Archivsysteme mit einem belastbaren Ablaufplan für Ihr Team.</p>
          <ul className="mt-6 text-silver-200 space-y-2 list-disc pl-5">
            <li>Umzug außerhalb Ihrer Kernzeiten</li>
            <li>Projektleitung mit festen Meilensteinen</li>
            <li>Sicherer Transport sensibler Geräte</li>
          </ul>
          <Link href="/kontakt" className="mt-8 inline-flex px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold">Firmenanfrage stellen</Link>
        </div>
        <div className="relative h-72 rounded-2xl overflow-hidden border border-white/10">
          <Image src="/images/corporate-hallway-cleaning.png" alt="Firmenumzug" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
