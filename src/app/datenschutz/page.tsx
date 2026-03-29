import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von SEEL Transport & Reinigung gemäß DSGVO. Informationen zu Datenerfassung, Cookies, Zahlungsdaten und Ihren Rechten.",
  path: "/datenschutz",
});

export default function DatenschutzPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Datenschutzerklärung</h1>
          <p className="text-silver-300 mt-3">Gemäß DSGVO · Stand: März 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 md:px-0">
          <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 shadow-sm p-6 md:p-12 space-y-8 text-sm leading-relaxed text-navy-700 dark:text-silver-300 break-words">
            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">1. Datenschutz auf einen Blick</h2>
              <h3 className="font-semibold text-navy-800 dark:text-white mb-2">Allgemeine Hinweise</h3>
              <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">2. Verantwortliche Stelle</h2>
              <p>
                Seel Transport &amp; Reinigung<br />
                Deutschland<br />
                Telefon: +49 172 8003410<br />
                E-Mail: info@seeltransport.de
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">3. Datenerfassung auf dieser Website</h2>

              <h3 className="font-semibold text-navy-800 dark:text-white mb-2 mt-4">Cookies</h3>
              <p>Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Sie richten keinen Schaden an. Wir nutzen Cookies, um unser Angebot nutzerfreundlich zu gestalten. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen.</p>

              <h3 className="font-semibold text-navy-800 dark:text-white mb-2 mt-4">Server-Log-Dateien</h3>
              <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt (Browsertyp, Betriebssystem, Referrer URL, Hostname, Uhrzeit).</p>

              <h3 className="font-semibold text-navy-800 dark:text-white mb-2 mt-4">Kontakt- und Buchungsformulare</h3>
              <p>Wenn Sie uns per Kontaktformular oder Buchungsformular Anfragen zukommen lassen, werden Ihre Angaben einschließlich der von Ihnen angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
              <p className="mt-2">Die Verarbeitung der in das Buchungsformular eingegebenen Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">4. Zahlungsdaten</h2>
              <p>Für die Abwicklung von Online-Zahlungen nutzen wir den Zahlungsdienstleister Stripe, Inc. Ihre Zahlungsdaten werden direkt von Stripe verarbeitet und nicht auf unseren Servern gespeichert. Die Datenschutzerklärung von Stripe finden Sie unter:{" "}
                <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline break-all">stripe.com/de/privacy</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">5. Google Maps</h2>
              <p>Diese Website nutzt den Kartendienst Google Maps zur Entfernungsberechnung. Bei der Nutzung wird eine Verbindung zu den Servern von Google hergestellt. Dabei kann Ihre IP-Adresse an Google übermittelt werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">6. Ihre Rechte</h2>
              <p>Sie haben jederzeit das Recht auf:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">7. Datenspeicherung</h2>
              <p>Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Erfüllung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen. Buchungsdaten werden gemäß den handels- und steuerrechtlichen Aufbewahrungsfristen (6 bzw. 10 Jahre) gespeichert.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">8. SSL-/TLS-Verschlüsselung</h2>
              <p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt.</p>
            </div>

            <div className="border-t border-gray-200 dark:border-navy-700 pt-6 text-silver-500">
              <p>Seel Transport &amp; Reinigung · Deutschland · Stand: März 2026</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


