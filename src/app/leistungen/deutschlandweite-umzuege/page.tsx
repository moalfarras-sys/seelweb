import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Deutschlandweite Umzüge | SEEL Transport",
  description: "Deutschlandweite Umzüge mit geplanter Route, verbindlichen Zeitfenstern und klarer Preisstruktur.",
  alternates: { canonical: "https://seeltransport.de/leistungen/deutschlandweite-umzuege" },
};

export default function DeutschlandweiteUmzuegePage() {
  return (
    <section className="gradient-navy py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Deutschlandweite Umzüge</h1>
        <p className="mt-5 text-silver-300 text-lg">Von Berlin in jede Region Deutschlands: Wir planen Strecke, Ladezeiten und Personal passgenau für Ihren Termin.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4 text-silver-200">
          <div className="p-4 rounded-xl glass">Klare Distanzkalkulation mit €/km-Richtwert</div>
          <div className="p-4 rounded-xl glass">Terminfenster mit Status-Updates</div>
          <div className="p-4 rounded-xl glass">Optional: Zwischenlagerung</div>
          <div className="p-4 rounded-xl glass">Versicherung und Dokumentation inklusive</div>
        </div>
        <Link href="/buchen?service=MOVING" className="mt-8 inline-flex px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold">Fernumzug anfragen</Link>
      </div>
    </section>
  );
}
