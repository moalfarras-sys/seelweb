import { CONTACT, COMPANY_LEGAL, COMPANY_BANK } from "@/config/contact";

export default function ImpressumPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Impressum</h1>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 shadow-sm p-8 md:p-12 space-y-8 text-sm leading-relaxed text-navy-700 dark:text-silver-300">
            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Angaben gemäß § 5 TMG</h2>
              <p>
                {COMPANY_LEGAL.NAME}<br />
                {COMPANY_LEGAL.ADDRESS_LINE_1}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Kontakt</h2>
              <p>
                Telefon: <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="text-teal-600 dark:text-teal-400">{CONTACT.PRIMARY_PHONE_DISPLAY}</a><br />
                Telefon (Zweitnummer): <a href={`tel:${CONTACT.SECONDARY_PHONE}`} className="text-teal-600 dark:text-teal-400">{CONTACT.SECONDARY_PHONE_DISPLAY}</a><br />
                E-Mail: <a href={`mailto:${CONTACT.EMAIL}`} className="text-teal-600 dark:text-teal-400">{CONTACT.EMAIL}</a><br />
                Website: <a href={CONTACT.WEBSITE_URL} className="text-teal-600 dark:text-teal-400">{CONTACT.WEBSITE_DISPLAY}</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Umsatzsteuer-Identifikationsnummer</h2>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: {COMPANY_LEGAL.VAT_ID}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Bankverbindung</h2>
              <p>
                Bank: {COMPANY_BANK.BANK_NAME}<br />
                IBAN: {COMPANY_BANK.IBAN}<br />
                BIC: {COMPANY_BANK.BIC}<br />
                Kontoinhaberin: {COMPANY_BANK.ACCOUNT_HOLDER}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
              <p>Berufsbezeichnung: Transport- und Reinigungsdienstleister<br />
                Zuständige Aufsichtsbehörde: Gewerbeamt</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mt-2">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">Haftung für Links</h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-navy-700 pt-6 text-silver-500">
              <p>{COMPANY_LEGAL.NAME} · {COMPANY_LEGAL.ADDRESS_LINE_1} · Stand: März 2026</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

