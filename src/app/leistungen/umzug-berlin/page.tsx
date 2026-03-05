import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Umzug Berlin | SEEL Umzugsfirma",
  description: "Umzug in Berlin mit erfahrener Crew, klaren Zeitfenstern und transparenter Preisstruktur.",
  alternates: { canonical: "https://seeltransport.de/leistungen/umzug-berlin" },
};

export default function UmzugBerlinPage() {
  return (
    <section className="section-padding bg-white dark:bg-navy-950">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-navy-800 dark:text-white">Umzug Berlin – schnell, sicher, strukturiert</h1>
        <p className="mt-5 text-silver-700 dark:text-silver-200 text-lg">Als lokale Umzugsfirma in Berlin kennen wir Zufahrten, Halteverbotszonen und typische Zeitfenster. Das reduziert Risiko und spart Zeit.</p>
        <div className="mt-8 p-6 rounded-2xl border border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-800/40">
          <h2 className="text-2xl font-semibold text-navy-800 dark:text-white">Leistungen in Berlin</h2>
          <p className="mt-3 text-silver-700 dark:text-silver-200">Privatumzug, Firmenumzug, Entrümpelung, Transport und Reinigung – alles in einem durchgängigen Ablauf.</p>
        </div>
        <Link href="/buchen" className="mt-8 inline-flex px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold">Umzug in Berlin starten</Link>
      </div>
    </section>
  );
}
