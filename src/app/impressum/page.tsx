import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Impressum",
  description:
    "Impressum von SEEL Transport & Reinigung mit zentral gepflegten Kontakt- und Unternehmensdaten.",
  path: "/impressum",
});

export default async function ImpressumPage() {
  const settings = await getPublicSiteSettings();
  const addressLines = [
    settings.company.addressLine1,
    settings.company.addressLine2,
    `${settings.company.city}, ${settings.company.country}`,
  ].filter(Boolean);

  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-300">
            Rechtliche Angaben
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Impressum</h1>
          <p className="mt-4 text-base leading-8 text-white/68">
            Zentrale Unternehmens- und Kontaktdaten von {settings.company.name}.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <aside className="space-y-6">
              <div className="glass-card rounded-[30px] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">
                  Unternehmen
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                  {settings.company.name}
                </h2>
                <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-white/62">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-[30px] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">
                  Direkter Kontakt
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-white/62">
                  <p>
                    Telefon:{" "}
                    <a
                      href={`tel:${settings.contact.primaryPhone}`}
                      className="font-semibold text-emerald-700 dark:text-teal-300"
                    >
                      {settings.contact.primaryPhoneDisplay}
                    </a>
                  </p>
                  <p>
                    E-Mail:{" "}
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="font-semibold text-emerald-700 dark:text-teal-300"
                    >
                      {settings.contact.email}
                    </a>
                  </p>
                  <p>
                    Website:{" "}
                    <a
                      href={settings.contact.websiteUrl}
                      className="font-semibold text-emerald-700 dark:text-teal-300"
                    >
                      {settings.contact.websiteDisplay}
                    </a>
                  </p>
                </div>
              </div>
            </aside>

            <div className="glass-strong rounded-[32px] p-8 md:p-10">
              <div className="space-y-8 text-sm leading-8 text-slate-700 dark:text-white/68">
                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Angaben gemäß § 5 TMG
                  </h2>
                  <div className="mt-4 space-y-1">
                    <p>{settings.company.name}</p>
                    {addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    {settings.company.legalRepresentative && (
                      <p>Vertreten durch: {settings.company.legalRepresentative}</p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Kontakt</h2>
                  <div className="mt-4 space-y-1">
                    <p>Telefon: {settings.contact.primaryPhoneDisplay}</p>
                    {settings.contact.secondaryPhoneDisplay && (
                      <p>Weitere Nummer: {settings.contact.secondaryPhoneDisplay}</p>
                    )}
                    <p>E-Mail: {settings.contact.email}</p>
                    <p>Servicegebiet: {settings.contact.serviceRegion}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Steuer- und Registerangaben
                  </h2>
                  <div className="mt-4 space-y-1">
                    <p>
                      Umsatzsteuer-Identifikationsnummer gemäß §27a UStG:{" "}
                      {settings.company.vatId || "Bitte ergänzen"}
                    </p>
                    <p>Steuernummer: {settings.company.taxNo || "Bitte ergänzen"}</p>
                    {settings.company.registerCourt && (
                      <p>Registergericht: {settings.company.registerCourt}</p>
                    )}
                    {settings.company.registerNo && (
                      <p>Registernummer: {settings.company.registerNo}</p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Bankverbindung
                  </h2>
                  <div className="mt-4 space-y-1">
                    <p>Bank: {settings.bank.name}</p>
                    <p>IBAN: {settings.bank.iban}</p>
                    <p>BIC: {settings.bank.bic}</p>
                    <p>Kontoinhaber: {settings.bank.accountHolder}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Hinweis zur Streitbeilegung
                  </h2>
                  <p className="mt-4">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
                    bereit:{" "}
                    <a
                      href="https://ec.europa.eu/consumers/odr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-700 underline dark:text-teal-300"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                    . Wir sind nicht bereit und nicht verpflichtet, an
                    Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                    teilzunehmen.
                  </p>
                </section>

                <div className="border-t border-slate-200 pt-6 text-xs uppercase tracking-[0.24em] text-slate-500 dark:border-white/10 dark:text-white/38">
                  Stand: März 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
