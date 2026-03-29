import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Impressum",
  description:
    "Impressum von SEEL Transport & Reinigung mit Kontaktdaten, Umsatzsteuer-ID und rechtlichen Hinweisen.",
  path: "/impressum",
});

export default async function ImpressumPage() {
  const settings = await getPublicSiteSettings();

  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Impressum</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="glass-strong rounded-[32px] p-8 md:p-12 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-white/70">
            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Angaben gemäß § 5 TMG</h2>
              <p>
                {settings.company.name}
                <br />
                {settings.company.addressLine1}
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Kontakt</h2>
              <p>
                Telefon: <a href={`tel:${settings.contact.primaryPhone}`} className="text-emerald-700 dark:text-teal-300">{settings.contact.primaryPhoneDisplay}</a>
                <br />
                Telefon (Zweitnummer): <a href={`tel:${settings.contact.secondaryPhone}`} className="text-emerald-700 dark:text-teal-300">{settings.contact.secondaryPhoneDisplay}</a>
                <br />
                E-Mail: <a href={`mailto:${settings.contact.email}`} className="text-emerald-700 dark:text-teal-300">{settings.contact.email}</a>
                <br />
                Website: <a href={settings.contact.websiteUrl} className="text-emerald-700 dark:text-teal-300">{settings.contact.websiteDisplay}</a>
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Umsatzsteuer-Identifikationsnummer</h2>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {settings.company.vatId || "Bitte ergänzen"}</p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Bankverbindung</h2>
              <p>
                Bank: {settings.bank.name}
                <br />
                IBAN: {settings.bank.iban}
                <br />
                BIC: {settings.bank.bic}
                <br />
                Kontoinhaber: {settings.bank.accountHolder}
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline dark:text-teal-300">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mt-2">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
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
