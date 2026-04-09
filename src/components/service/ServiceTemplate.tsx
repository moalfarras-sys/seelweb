"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type CtaLink = {
  href: string;
  label: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type ServiceTemplateProps = {
  badge?: string;
  title: string;
  intro: string;
  highlights?: string[];
  benefitsTitle?: string;
  benefits: string[];
  includedTitle?: string;
  includedServices: string[];
  priceLabel: string;
  priceHint?: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  closingTitle?: string;
  closingText?: string;
  faqItems: FaqItem[];
  relatedLinks?: CtaLink[];
};

export function ServiceTemplate({
  badge,
  title,
  intro,
  highlights = [],
  benefitsTitle = "Warum Kundinnen und Kunden uns wählen",
  benefits,
  includedTitle = "Was enthalten ist",
  includedServices,
  priceLabel,
  priceHint,
  primaryCta,
  secondaryCta,
  closingTitle,
  closingText,
  faqItems,
  relatedLinks = [],
}: ServiceTemplateProps) {
  return (
    <>
      <section className="page-hero-shell">
        <div className="page-hero-grid">
          <div>
            <p className="page-kicker">Leistung</p>
            <h1 className="page-title max-w-[14ch]">{title}</h1>
            <p className="page-copy max-w-3xl">{intro}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={primaryCta.href} className="btn-primary-glass px-5 py-3 text-sm font-semibold text-white">
                <span className="inline-flex items-center gap-2">
                  {primaryCta.label}
                  <ArrowRight size={15} />
                </span>
              </Link>
              {secondaryCta ? (
                <Link href={secondaryCta.href} className="btn-secondary-glass px-5 py-3 text-sm font-semibold">
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>

            {highlights.length > 0 ? (
              <div className="page-chip-row">
                {highlights.map((item) => (
                  <span key={item} className="page-chip">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="page-info-card-light p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {(badge ? [{ label: "Profil", value: badge }] : [])
                .concat([
                  { label: "Preis", value: priceLabel },
                  { label: "Einsatzgebiet", value: "Berlin, Brandenburg und auf Anfrage bundesweit" },
                  { label: "Ablauf", value: "Strukturiert geplant, verbindlich kommuniziert" },
                ])
                .map((item) => (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="rounded-[18px] border border-white/45 bg-white/58 p-4 text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:border-white/10 dark:bg-white/7 dark:text-white"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted dark:text-white/46">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 sm:text-base sm:leading-7">{item.value}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6">
            <p className="page-kicker">Vorteile</p>
            <h2 className="section-title">{benefitsTitle}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {benefits.map((item) => (
              <div key={item} className="glass-card flex items-start gap-3 p-4 sm:p-5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal/12 text-brand-teal">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm leading-6 text-text-primary dark:text-text-on-dark">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-[1200px] grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div>
            <div className="mb-6">
              <p className="page-kicker">Leistungsumfang</p>
              <h2 className="section-title">{includedTitle}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {includedServices.map((item) => (
                <div key={item} className="glass-card p-4 text-sm leading-6 text-text-body dark:text-text-on-dark-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="page-info-card-light p-5 sm:p-6 lg:sticky lg:top-24">
            <p className="page-kicker">Preisrahmen</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary dark:text-text-on-dark">{priceLabel}</p>
            {priceHint ? (
              <p className="mt-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{priceHint}</p>
            ) : null}
            <div className="mt-5 flex flex-col gap-3">
              <Link href={primaryCta.href} className="btn-primary-glass px-5 py-3 text-center text-sm font-semibold text-white">
                {primaryCta.label}
              </Link>
              {secondaryCta ? (
                <Link href={secondaryCta.href} className="btn-secondary-glass px-5 py-3 text-center text-sm font-semibold">
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6">
            <p className="page-kicker">FAQ</p>
            <h2 className="section-title">Häufige Fragen</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-text-primary dark:text-text-on-dark">
                  {faq.question}
                </summary>
                <div className="px-5 pb-5 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-[1200px] premium-panel-dark px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="page-kicker text-brand-teal">Nächster Schritt</p>
              <h2 className="section-title text-white">{closingTitle ?? title}</h2>
              {closingText ? <p className="section-copy text-white/72">{closingText}</p> : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={primaryCta.href} className="btn-primary-glass px-6 py-3 text-sm font-semibold text-white">
                {primaryCta.label}
              </Link>
              {secondaryCta ? (
                <Link href={secondaryCta.href} className="btn-secondary-glass px-6 py-3 text-sm font-semibold">
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {relatedLinks.length > 0 ? (
        <section className="mt-8 pb-8">
          <div className="mx-auto max-w-[1200px]">
            <p className="page-kicker">Weitere Leistungen</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="page-chip">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
