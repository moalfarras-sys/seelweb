import { SEEL_AGB_SECTIONS, SEEL_AGB_VERSION, SEEL_CANCELLATION_RULES } from "@/lib/legal";

export default function AGBPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-teal-200 mb-3">SEEL Transport & Reinigung</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Allgemeine Geschaeftsbedingungen</h1>
          <p className="text-silver-300 mt-4 max-w-2xl mx-auto">
            Verbindliche Rahmenbedingungen fuer Transport, Umzug, Reinigung, Entsorgung, Montage und begleitende Dienstleistungen.
          </p>
          <p className="text-silver-400 mt-3 text-sm">Stand: Maerz 2026 | Version {SEEL_AGB_VERSION}</p>
        </div>
      </section>

      <section className="section-padding bg-slate-50 dark:bg-navy-950">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          <div className="grid lg:grid-cols-[1.55fr_0.85fr] gap-6 items-start">
            <div className="bg-white dark:bg-navy-800/70 rounded-[28px] border border-gray-100 dark:border-navy-700/50 shadow-sm p-6 md:p-10 space-y-8">
              {SEEL_AGB_SECTIONS.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 className="text-xl md:text-2xl font-semibold text-navy-900 dark:text-white">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm md:text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-[28px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-teal-500/10 dark:via-navy-900 dark:to-navy-900 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-teal-600 dark:text-teal-300 mb-3">Stornierungsstaffel</p>
                <div className="space-y-3">
                  {SEEL_CANCELLATION_RULES.map((rule) => (
                    <div key={rule.label} className="rounded-2xl border border-white/80 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-3">
                      <p className="text-sm font-semibold text-navy-900 dark:text-white">{rule.fee}</p>
                      <p className="text-xs leading-5 text-slate-600 dark:text-slate-300 mt-1">{rule.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 dark:border-navy-700/50 bg-white dark:bg-navy-800/70 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400 mb-3">Hinweis</p>
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                  Massgeblich fuer den konkreten Auftrag bleiben stets das freigegebene Angebot, der digitale Vertrag sowie
                  dokumentierte Zusatzleistungen oder Nachtraege.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
