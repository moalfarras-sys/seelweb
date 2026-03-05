import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reinigung Berlin | SEEL Transport",
  description: "Professionelle Reinigung für Wohnungen, Büros und Objektübergaben in Berlin.",
  alternates: { canonical: "https://seeltransport.de/leistungen/reinigung" },
};

export default function ReinigungPage() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-navy-900">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-navy-800 dark:text-white">Reinigung mit Qualitätsstandard</h1>
        <p className="mt-5 text-silver-700 dark:text-silver-200 text-lg">Ob Wohnungsreinigung, Endreinigung oder Büroflächen: Wir arbeiten mit klaren Leistungslisten und dokumentierter Endkontrolle.</p>
        <ul className="mt-6 list-disc pl-6 text-silver-700 dark:text-silver-200 space-y-2">
          <li>Endreinigung für Übergabe und Auszug</li>
          <li>Unterhaltsreinigung für Büros und Praxis</li>
          <li>Planbare Intervalle und feste Teams</li>
          <li>Fair kalkulierte Preise ohne versteckte Pauschalen</li>
        </ul>
        <Link href="/buchen?service=HOME_CLEANING" className="mt-8 inline-flex px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold">Reinigung buchen</Link>
      </div>
    </section>
  );
}
