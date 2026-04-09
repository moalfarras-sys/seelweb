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
      <section className="relative px-4 pb-8 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="page-hero-shell">
            <div className="page-hero-grid">
              <div className="hero-copy-flow max-w-3xl">
                <p className="page-kicker">SEEL Transport & Reinigung</p>
                <h1 className="page-title max-w-[12ch]">Allgemeine Geschäftsbedingungen</h1>
                <p className="page-copy">
                  Rechtlich klare Rahmenbedingungen für Umzug, Transport, Reinigung, Entsorgung, Montage und alle damit verbundenen Zusatzleistungen.
                </p>
                <div className="page-chip-row">
                  <span className="page-chip">Version {SEEL_AGB_VERSION}</span>
                  <span className="page-chip">Stand März 2026</span>
                  <span className="page-chip">Berlin · Brandenburg · bundesweit</span>
                </div>
              </div>

              <div className="page-info-card p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/48">Auf einen Blick</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-white">
                    <p className="font-semibold">Vertrag</p>
                    <p className="mt-1 text-sm text-white/66">Verbindlich nach Freigabe durch SEEL und Bestätigung oder digitaler Unterschrift durch den Kunden.</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-white">
                    <p className="font-semibold">Leistung</p>
                    <p className="mt-1 text-sm text-white/66">Maßgeblich sind immer Angebot, Vertrag, Zusatzpositionen und dokumentierte Nachträge.</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-white">
                    <p className="font-semibold">Haftung</p>
                    <p className="mt-1 text-sm text-white/66">Transport nach gesetzlichen Vorgaben, weitere Dienstleistungen nach den allgemeinen Haftungsregeln.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8 pt-2 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {SEEL_CANCELLATION_RULES.map((rule, index) => (
              <div key={rule.label} className="glass-card px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-text-muted">Storno {index + 1}</p>
                <p className="mt-2 text-2xl font-bold text-text-primary dark:text-white">{rule.fee}</p>
                <p className="mt-2 text-sm leading-6 text-text-body dark:text-white/64">{rule.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.52fr] items-start">
            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="page-info-card-light p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-text-muted mb-4">Inhaltsverzeichnis</p>
                <nav className="space-y-2">
                  {sectionIds.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-text-body transition-colors hover:bg-white/50 dark:text-white/72 dark:hover:bg-white/6"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-xs font-semibold text-text-muted dark:bg-white/8 dark:text-white/54">
                        {index + 1}
                      </span>
                      <span className="leading-5">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="glass-card p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-brand-teal mb-3">Hinweis</p>
                <p className="text-sm leading-7 text-text-body dark:text-white/64">
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
                    className="page-info-card-light overflow-hidden rounded-[30px] p-0"
                  >
                    <div className="border-b border-white/20 px-6 py-5 md:px-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(18,215,198,0.2),rgba(111,121,255,0.18))] text-sm font-bold text-text-primary shadow-[0_14px_32px_rgba(18,215,198,0.14)] dark:text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.28em] text-text-muted">AGB Abschnitt</p>
                          <h2 className="mt-1 text-xl md:text-2xl font-semibold text-text-primary dark:text-white">{section.title}</h2>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 md:px-8 py-6 space-y-4">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-[15px] leading-8 text-text-body dark:text-white/68">
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
