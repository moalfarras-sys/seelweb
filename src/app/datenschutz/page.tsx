import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von SEEL Transport & Reinigung gemäß DSGVO mit Informationen zu Formularen, Cookies und Zahlungsdaten.",
  path: "/datenschutz",
});

export default async function DatenschutzPage() {
  const settings = await getPublicSiteSettings();

  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Datenschutzerklärung</h1>
          <p className="mt-3 text-white/65">Gemäß DSGVO · Stand: März 2026</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="glass-strong rounded-[32px] p-6 md:p-12 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-white/70 break-words">
            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">1. Verantwortliche Stelle</h2>
              <p>
                {settings.company.name}
                <br />
                {settings.company.addressLine1}
                <br />
                Telefon: {settings.contact.primaryPhoneDisplay}
                <br />
                E-Mail: {settings.contact.email}
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">2. Erhebung personenbezogener Daten</h2>
              <p>
                Wir verarbeiten personenbezogene Daten, wenn Sie unsere Website besuchen, Kontaktformulare ausfüllen, eine Buchung anfragen oder uns im Rahmen einer Ausschreibung kontaktieren.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">3. Kontakt- und Buchungsformulare</h2>
              <p>
                Angaben aus Formularen werden zur Bearbeitung Ihrer Anfrage, zur Angebotserstellung und für eventuelle Rückfragen verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um vorvertragliche Maßnahmen oder Vertragsabwicklung geht.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">4. Cookies und technische Daten</h2>
              <p>
                Unsere Website verwendet notwendige technische Cookies sowie serverseitige Logdaten, um den Betrieb, die Sicherheit und die Nutzung der Website sicherzustellen.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">5. Zahlungsdaten</h2>
              <p>
                Für Online-Zahlungen kann Stripe als Zahlungsdienstleister eingesetzt werden. Zahlungsdaten werden dabei direkt durch Stripe verarbeitet. Weitere Informationen finden Sie unter{" "}
                <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline dark:text-teal-300">
                  stripe.com/de/privacy
                </a>.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">6. Karten- und Standortdienste</h2>
              <p>
                Für Entfernungsberechnung und Adressauswahl können externe Karten- und Geocoding-Dienste genutzt werden. Dabei kann Ihre IP-Adresse an den jeweiligen Anbieter übermittelt werden.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">7. Ihre Rechte</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Auskunft über gespeicherte Daten gemäß Art. 15 DSGVO</li>
                <li>Berichtigung unrichtiger Daten gemäß Art. 16 DSGVO</li>
                <li>Löschung gemäß Art. 17 DSGVO</li>
                <li>Einschränkung der Verarbeitung gemäß Art. 18 DSGVO</li>
                <li>Datenübertragbarkeit gemäß Art. 20 DSGVO</li>
                <li>Widerspruch gegen die Verarbeitung gemäß Art. 21 DSGVO</li>
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-6 text-slate-500 dark:border-white/10 dark:text-white/40">
              <p>{settings.company.name} · {settings.company.addressLine1} · Stand: März 2026</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
