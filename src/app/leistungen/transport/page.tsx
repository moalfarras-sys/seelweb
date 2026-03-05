import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transport Service Berlin | SEEL Transport",
  description: "Transport-Service in Berlin für Möbel, Einzelstücke, Geräte und gewerbliche Lieferfahrten.",
  alternates: { canonical: "https://seeltransport.de/leistungen/transport" },
};

export default function TransportPage() {
  return (
    <section className="section-padding bg-white dark:bg-navy-950">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-navy-800 dark:text-white">Transport-Service Berlin</h1>
        <p className="mt-5 text-silver-700 dark:text-silver-200 text-lg">Schneller und sicherer Transport für private und gewerbliche Aufträge. Ideal für Möbel, Einzeltransporte und terminkritische Lieferungen.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {["Einzelmöbel und schwere Gegenstände", "Kurzfristige City-Transporte", "Transparente Kilometerkalkulation", "Optionale Tragehilfe und Montage"].map((item) => (
            <div key={item} className="p-4 rounded-xl border border-gray-200 dark:border-navy-700">{item}</div>
          ))}
        </div>
        <Link href="/buchen?service=MOVING" className="mt-8 inline-flex px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold">Transport anfragen</Link>
      </div>
    </section>
  );
}
