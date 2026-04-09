import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von SEEL Transport & Reinigung mit Angaben zu Formularen, Terminanfragen und Zahlungsabwicklung.",
  path: "/datenschutz",
});

export default async function DatenschutzPage() {
  const settings = await getPublicSiteSettings();
  const addressLines = [settings.company.addressLine1, settings.company.addressLine2, `${settings.company.city}, ${settings.company.country}`].filter(Boolean);

  return (
    <>
      <section className="relative px-4 pb-8 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="page-hero-shell">
            <div className="page-hero-grid">
              <div className="hero-copy-flow max-w-3xl">
                <p className="page-kicker">Datenschutz</p>
                <h1 className="page-title max-w-[10ch]">Datenschutzerklärung</h1>
                <p className="page-copy">
                  Informationen zur Verarbeitung personenbezogener Daten bei Kontakt-, Buchungs- und Ausschreibungsanfragen von SEEL Transport & Reinigung.
                </p>
                <div className="page-chip-row">
                  <span className="page-chip">DSGVO</span>
                  <span className="page-chip">Anfragen & Buchungen</span>
                  <span className="page-chip">Stand 2026</span>
                </div>
              </div>

              <div className="page-info-card p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/48">Kontakt Datenschutz</p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-white/74">
                  <p>{settings.company.name}</p>
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>{settings.contact.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="glass-strong p-8 md:p-10">
            <div className="space-y-8 text-sm leading-8 text-text-body dark:text-white/68">
              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">1. Verantwortliche Stelle</h2>
                <div className="mt-4 space-y-1">
                  <p>{settings.company.name}</p>
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>Telefon: {settings.contact.primaryPhoneDisplay}</p>
                  <p>E-Mail: {settings.contact.email}</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">2. Zugriffsdaten und technische Verarbeitung</h2>
                <p className="mt-4">
                  Beim Besuch dieser Website werden technisch erforderliche Informationen verarbeitet, um Stabilität, Sicherheit und Auslieferung der Website sicherzustellen. Dazu können IP-Adresse, Zeitstempel, Browserinformationen und Server-Logdaten gehören.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">3. Kontakt-, Angebots- und Buchungsanfragen</h2>
                <p className="mt-4">
                  Daten aus Formularen verarbeiten wir zur Beantwortung Ihrer Anfrage, zur Angebotserstellung, zur Terminabstimmung und zur Durchführung vorvertraglicher Maßnahmen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">4. Ausschreibungen und Unternehmensanfragen</h2>
                <p className="mt-4">
                  Angaben aus Unternehmens- oder Ausschreibungsformularen werden genutzt, um Leistungsumfang, Ansprechpartner, Budgetrahmen und organisatorische Anforderungen zu prüfen und strukturiert zu beantworten.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">5. Karten-, Adress- und Routingdienste</h2>
                <p className="mt-4">
                  Für die Auswahl von Adressen, Entfernungsschätzungen und Einsatzrouten können externe Geocoding- oder Kartendienste eingebunden werden. Dabei können technische Verbindungsdaten an den jeweiligen Anbieter übermittelt werden.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">6. Zahlungsabwicklung</h2>
                <p className="mt-4">
                  Für digitale Zahlungen kann Stripe eingesetzt werden. Zahlungsdaten werden in diesem Fall direkt durch den Zahlungsdienstleister verarbeitet. Weitere Informationen finden Sie unter{" "}
                  <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-teal underline">
                    stripe.com/de/privacy
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">7. Speicherdauer</h2>
                <p className="mt-4">
                  Wir speichern personenbezogene Daten nur so lange, wie dies für die Bearbeitung der Anfrage, für gesetzliche Nachweis- und Aufbewahrungspflichten oder für die Vertragsabwicklung erforderlich ist.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">8. Ihre Rechte</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  <li>Auskunft über gespeicherte Daten gemäß Art. 15 DSGVO</li>
                  <li>Berichtigung unrichtiger Daten gemäß Art. 16 DSGVO</li>
                  <li>Löschung gemäß Art. 17 DSGVO</li>
                  <li>Einschränkung der Verarbeitung gemäß Art. 18 DSGVO</li>
                  <li>Datenübertragbarkeit gemäß Art. 20 DSGVO</li>
                  <li>Widerspruch gegen die Verarbeitung gemäß Art. 21 DSGVO</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">9. Kontakt zum Datenschutz</h2>
                <p className="mt-4">
                  Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten können Sie uns jederzeit unter{" "}
                  <a href={`mailto:${settings.contact.email}`} className="font-semibold text-brand-teal">
                    {settings.contact.email}
                  </a>{" "}
                  kontaktieren.
                </p>
              </section>

              <div className="border-t border-white/20 pt-6 text-xs uppercase tracking-[0.24em] text-text-muted dark:border-white/10 dark:text-white/38">
                Stand: März 2026
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
