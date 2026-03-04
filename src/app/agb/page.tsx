export default function AGBPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-silver-300 mt-3">SEEL Transport & Reinigung – Stand: März 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-navy-950">
        <div className="max-w-4xl mx-auto prose prose-navy px-4 md:px-0">
          <div className="bg-white dark:bg-navy-800/60 rounded-2xl border border-gray-100 dark:border-navy-700/50 shadow-sm p-6 md:p-12 space-y-8 text-sm leading-relaxed text-navy-700 dark:text-silver-300 break-words">
            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 1 Geltungsbereich</h2>
              <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen SEEL Transport & Reinigung (nachfolgend &bdquo;Unternehmen&ldquo;) und Auftraggebern (nachfolgend &bdquo;Kunden&ldquo;).</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 2 Vertragsschluss</h2>
              <p>Online-Buchungen stellen eine Anfrage dar. Ein Vertrag kommt erst durch Angebotsfreigabe und anschließende Vertragsbestätigung zustande.</p>
              <p className="mt-2">Preisangaben im Rechner sind vorläufig. Verbindlich ist ausschließlich das freigegebene Angebot.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 3 Leistungen und Preise</h2>
              <p>Leistungsumfang, Zuschläge und Extras ergeben sich aus Angebot und Vertrag. Alle Beträge werden in Euro ausgewiesen; die gesetzliche Umsatzsteuer wird separat dargestellt.</p>
              <p className="mt-2">Bankverbindung: Deutsche Bank, IBAN DE44 1007 1324 0066 0068 00, BIC DEUTDEDBP31, Kontoinhaberin Lisaveta Al-Shamaileh.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 4 Zahlungsarten</h2>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Überweisung (zahlbar innerhalb von 14 Tagen nach Rechnungsstellung)</li>
                <li>Barzahlung am Leistungstag</li>
                <li>PayPal</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 5 Stornierung</h2>
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-3">
                <p className="font-semibold text-amber-900 dark:text-amber-300 mb-2">Stornierungsbedingungen gemäß AGB</p>
                <ul className="list-disc pl-6 space-y-1 text-amber-800 dark:text-amber-300">
                  <li>mehr als 7 Tage vor Termin: 20 %</li>
                  <li>6 bis 3 Tage vor Termin: 40 %</li>
                  <li>48 bis 24 Stunden vor Termin: 60 %</li>
                  <li>unter 24 Stunden vor Termin: 80 %</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 6 Haftung</h2>
              <p>Es gelten die gesetzlichen Haftungsregelungen. Für Umzugsleistungen gelten zusätzlich die einschlägigen Bestimmungen des HGB.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 7 Höhere Gewalt</h2>
              <p>Bei höherer Gewalt, behördlichen Maßnahmen oder unvorhersehbaren Ereignissen können Termine verschoben werden, ohne dass hieraus Schadensersatzansprüche entstehen.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 8 Datenschutz</h2>
              <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß Datenschutzerklärung und geltendem Datenschutzrecht.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4">§ 9 Schlussbestimmungen</h2>
              <p>Es gilt deutsches Recht. Gerichtsstand ist – soweit gesetzlich zulässig – Deutschland.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
