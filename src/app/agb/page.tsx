import type { Metadata } from "next";
import { SEEL_AGB_SECTIONS, SEEL_AGB_VERSION, SEEL_CANCELLATION_RULES } from "@/lib/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Allgemeine Geschäftsbedingungen (AGB)",
  description:
    "AGB von SEEL Transport & Reinigung für Umzug, Transport, Reinigung und Entsorgung. Rechtliche Rahmenbedingungen klar und transparent.",
  path: "/agb",
});

const sectionIds = SEEL_AGB_SECTIONS.map((section) => ({
  title: section.title,
  id: section.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, ""),
}));

export default function AGBPage() {
  return (
    <>
      <section className="hero-led-section relative overflow-hidden px-4 pb-8 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.24),transparent_22%),linear-gradient(135deg,#071a33_0%,#10335d_48%,#0d9ea0_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-teal-200 mb-4">SEEL Transport & Reinigung</p>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">Allgemeine Geschäftsbedingungen</h1>
              <p className="text-slate-200 mt-5 max-w-3xl text-base md:text-lg leading-8">
                Rechtlich klare Rahmenbedingungen für Umzug, Transport, Reinigung, Entsorgung, Montage und alle damit verbundenen Zusatzleistungen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-teal-100">Version</p>
                  <p className="mt-1 text-white font-semibold">{SEEL_AGB_VERSION}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-teal-100">Stand</p>
                  <p className="mt-1 text-white font-semibold">März 2026</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-teal-100">Geltung</p>
                  <p className="mt-1 text-white font-semibold">Berlin, Brandenburg & deutschlandweite Einsätze</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-2xl shadow-[#071a33]/30">
              <p className="text-xs uppercase tracking-[0.28em] text-teal-100 mb-4">Auf einen Blick</p>
              <div className="space-y-3">
                <div className="rounded-2xl bg-white/10 px-4 py-4">
                  <p className="text-white font-semibold">Vertrag</p>
                  <p className="text-sm text-slate-200 mt-1">Verbindlich nach Freigabe durch SEEL und Bestätigung oder digitaler Unterschrift durch den Kunden.</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-4">
                  <p className="text-white font-semibold">Leistung</p>
                  <p className="text-sm text-slate-200 mt-1">Maßgeblich sind immer Angebot, Vertrag, Zusatzpositionen und dokumentierte Nachträge.</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-4">
                  <p className="text-white font-semibold">Haftung</p>
                  <p className="text-sm text-slate-200 mt-1">Transport nach gesetzlichen Vorgaben, weitere Dienstleistungen nach den allgemeinen Haftungsregeln.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8fbfd_0%,#eef4f7_100%)] dark:bg-navy-950 py-10 md:py-14 border-b border-slate-200/70 dark:border-navy-800">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {SEEL_CANCELLATION_RULES.map((rule, index) => (
              <div key={rule.label} className="rounded-[24px] border border-white bg-white/90 shadow-sm px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Storno {index + 1}</p>
                <p className="mt-2 text-2xl font-bold text-navy-900">{rule.fee}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{rule.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50 dark:bg-navy-950">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.52fr] items-start">
            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 mb-4">Inhaltsverzeichnis</p>
                <nav className="space-y-2">
                  {sectionIds.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        {index + 1}
                      </span>
                      <span className="leading-5">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="rounded-[28px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-teal-600 mb-3">Hinweis</p>
                <p className="text-sm leading-7 text-slate-700">
                  Maßgeblich für den konkreten Auftrag bleiben stets das freigegebene Angebot, der digitale Vertrag sowie dokumentierte Zusatzleistungen oder Nachträge.
                </p>
              </div>
            </aside>

            <div className="space-y-5">
              {SEEL_AGB_SECTIONS.map((section, index) => {
                const anchor = sectionIds[index];
                return (
                  <section
                    key={section.title}
                    id={anchor.id}
                    className="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fbfd_0%,#edf7f7_55%,#f6fbff_100%)] px-6 md:px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-900 text-sm font-bold text-white shadow-md shadow-navy-900/20">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">AGB Abschnitt</p>
                          <h2 className="mt-1 text-xl md:text-2xl font-semibold text-navy-900">{section.title}</h2>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 md:px-8 py-6 space-y-4">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-[15px] leading-8 text-slate-700">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
