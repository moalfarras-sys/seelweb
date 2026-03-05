import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privatumzug Berlin | SEEL Transport",
  description: "Privatumzug in Berlin mit verlässlicher Planung, sauberem Transport und transparenten Preisen.",
  alternates: { canonical: "https://seeltransport.de/leistungen/privatumzug" },
};

const vorteile = [
  "Verpackung, Transport und Aufbau aus einer Hand",
  "Feste Zeitfenster statt unklarer Ankunft",
  "Versicherter Möbeltransport nach HGB",
  "Optional: Endreinigung und Entsorgung",
];

export default function PrivatumzugPage() {
  return (
    <>
      <section className="gradient-navy py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Privatumzug ohne Stress</h1>
            <p className="text-silver-300 mt-5 text-lg">SEEL organisiert Ihren Umzug in Berlin strukturiert und termingerecht – vom ersten Karton bis zur letzten Schraube.</p>
            <div className="mt-8 flex gap-4">
              <Link href="/buchen?service=MOVING" className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold inline-flex items-center gap-2">Jetzt buchen <ArrowRight size={16} /></Link>
              <Link href="/kontakt" className="px-6 py-3 rounded-xl glass text-white hover:bg-white/15">Beratung</Link>
            </div>
          </div>
          <div className="relative h-72 rounded-2xl overflow-hidden border border-white/10">
            <Image src="/images/moving-workers-furniture.png" alt="Privatumzug Berlin" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-navy-800 dark:text-white">Warum Kunden uns wählen</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {vorteile.map((v) => (
              <div key={v} className="rounded-xl border border-gray-200 dark:border-navy-700 p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-teal-500 mt-0.5" size={18} />
                <p className="text-silver-700 dark:text-silver-200">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
