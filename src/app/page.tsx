import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { fetchGoogleReviews } from "@/lib/google-reviews";
import GoogleReviews from "@/components/GoogleReviews";
import Gallery from "@/components/Gallery";
import { getHomepageGalleryItems, getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Umzüge, Reinigung und Entrümpelung",
  description:
    "SEEL Transport & Reinigung begleitet Umzug, Reinigung und Entrümpelung in Berlin, Brandenburg und bei geplanten deutschlandweiten Einsätzen.",
  path: "/",
});

const faqItems = [
  {
    question: "Wie schnell können Sie einen Umzug in Berlin übernehmen?",
    answer: "Reguläre Einsätze planen wir mit festen Zeitfenstern. Für dringende Fälle prüfen wir kurzfristige Expresskapazitäten.",
  },
  {
    question: "Arbeiten Sie auch außerhalb von Berlin?",
    answer: "Ja. Neben Berlin betreuen wir Brandenburg und deutschlandweite Umzüge mit klarer Einsatzplanung und transparenter Preisstruktur.",
  },
  {
    question: "Sind Möbel und Inventar versichert?",
    answer: "Ja. Transporte werden nach den gesetzlichen Vorgaben durchgeführt. Bei Sonderfällen beraten wir zusätzlich zu erweiterten Absicherungen.",
  },
  {
    question: "Kann ich Reinigung und Umzug kombinieren?",
    answer: "Ja. Viele Kundinnen und Kunden kombinieren Umzug, Endreinigung und Entrümpelung in einem abgestimmten Ablauf.",
  },
];

export default async function HomePage() {
  const [prices, reviewsData, settings, galleryItems] = await Promise.all([
    getPrices(),
    fetchGoogleReviews(),
    getPublicSiteSettings(),
    getHomepageGalleryItems(),
  ]);

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    name: settings.company.name,
    url: settings.contact.websiteUrl,
    telephone: settings.contact.primaryPhoneDisplay,
    email: settings.contact.email,
    address: { "@type": "PostalAddress", addressLocality: settings.company.city, addressCountry: "DE" },
    areaServed: [{ "@type": "City", name: "Berlin" }, { "@type": "State", name: "Brandenburg" }],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "EUR",
  };

  if (reviewsData && reviewsData.totalReviews > 0) {
    localBusinessSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewsData.rating,
      reviewCount: reviewsData.totalReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const services = [
    {
      title: "Privat- und Firmenumzug",
      alt: "SEEL Transport Umzugsteam beim Möbeltransport in Berlin",
      description: "Strukturierte Umzüge mit erfahrenem Team, festen Zeitfenstern und optionaler Montage.",
      href: "/leistungen/umzug-berlin",
      price: formatPricePerHour(prices.umzugStandard),
      image: "/images/umzug-1.jpeg",
    },
    {
      title: "Büro- und Gewerbeumzug",
      alt: "Professioneller Büroumzug Berlin – Gewerbeumzug mit SEEL Transport",
      description: "Projektplanung für Unternehmen, Kanzleien, Praxen und Agenturen mit minimaler Ausfallzeit.",
      href: "/leistungen/gewerbe",
      price: formatPricePerHour(prices.gewerbeUmzug),
      image: "/images/corporate-hallway-cleaning.png",
    },
    {
      title: "Reinigung & Endreinigung",
      alt: "SEEL Reinigungsteam bei der professionellen Büroreinigung in Berlin",
      description: "Wohnung, Büro und Übergabe aus einer Hand mit klaren Leistungslisten und sauberer Dokumentation.",
      href: "/leistungen/reinigung",
      price: formatPricePerHour(prices.reinigungWohnung),
      image: "/images/cleaning-team-office.png",
    },
    {
      title: "Entrümpelung",
      alt: "SEEL Transport Entrümpelung und Entsorgung in Berlin – Räumungsfahrzeug",
      description: "Schnelle Räumung, saubere Trennung und fachgerechte Entsorgung mit klarer Abstimmung.",
      href: "/leistungen/entruempelung",
      price: formatPricePerHour(prices.entruempelung),
      image: "/images/waste-disposal-van.png",
    },
  ];

  const galleryImages = galleryItems.map((item) => ({
    id: item.id,
    src: item.imageUrl,
    alt: item.alt,
    title: item.title,
    category: item.category,
    featured: item.isFeatured,
  }));

  return (
    <>
      <Script id="home-local-business-schema" type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </Script>
      <Script id="home-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pb-16 pt-12 md:flex md:min-h-[88vh] md:items-center md:pb-0 md:pt-0">
        {/* Background radial accents */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_20%_50%,rgba(16,185,129,0.1),transparent_55%),radial-gradient(ellipse_50%_40%_at_85%_15%,rgba(15,23,42,0.06),transparent_50%)]" />
        {/* Subtle right-side texture from workers image */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-[0.04] dark:opacity-[0.06]"
          style={{ maskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 20%, transparent 100%)" }}
          aria-hidden="true"
        >
          <Image src="/images/moving-workers-furniture.png" alt="" fill className="object-cover object-right-top" priority={false} />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          {/* Left column — text */}
          <div>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
              {settings.homepage.heroBadge}
            </span>

            <h1 className="font-display mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-[3.5rem] md:leading-[1.1]">
              {settings.homepage.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-white/65">
              {settings.homepage.heroDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/buchen" className="btn-primary-glass gap-2 px-6 py-3.5 text-sm font-semibold">
                {settings.homepage.primaryCtaLabel} <ArrowRight size={16} />
              </Link>
              <a href={`tel:${settings.contact.primaryPhone}`} className="btn-secondary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
                <PhoneCall size={16} />
                {settings.homepage.secondaryCtaLabel}
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="premium-stat">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">Umzug</p>
                <p className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-white">{formatPricePerHour(prices.umzugStandard)}</p>
              </div>
              <div className="premium-stat">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">Reinigung</p>
                <p className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-white">{formatPricePerHour(prices.reinigungWohnung)}</p>
              </div>
              <div className="premium-stat">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-white/40">Erreichbarkeit</p>
                <p className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-white">{settings.contact.availability}</p>
              </div>
            </div>
          </div>

          {/* Right column — images */}
          <div>
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              {/* Main image card */}
              <div className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-white/70 bg-slate-200 shadow-[0_32px_80px_rgba(15,23,42,0.18)] transition-all duration-500 hover:shadow-[0_40px_100px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-white/5">
                <Image
                  src="/images/moving-truck-hero.png"
                  alt="SEEL Transport Umzugswagen bereit für Einsatz in Berlin"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="font-display text-sm font-semibold leading-tight">Saubere Planung und ruhige Durchführung</p>
                  <p className="mt-1.5 text-sm text-white/70">Für Privatkunden, Unternehmen und institutionelle Einsätze.</p>
                </div>
              </div>

              {/* Small card column */}
              <div className="grid gap-4">
                <div className="relative min-h-[200px] overflow-hidden rounded-[28px] border border-white/70 bg-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.16)] transition-all duration-500 hover:shadow-[0_28px_64px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-white/5">
                  <Image
                    src="/images/cleaning-team-office.png"
                    alt="Professionelles Reinigungsteam von SEEL Transport & Reinigung bei der Arbeit"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                </div>
                <div className="glass-card rounded-[28px] p-6">
                  <p className="section-eyebrow mb-0 text-[0.65rem]">Warum Kunden bleiben</p>
                  <ul className="mt-4 space-y-3">
                    {settings.whyChooseUs.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-white/70">
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600 dark:text-teal-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="border-y border-slate-200/70 bg-white/60 py-4 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          {settings.trustBar.map((item) => (
            <div key={item.id} className="trust-pill">
              <ShieldCheck size={16} className="shrink-0 text-emerald-600 dark:text-teal-300" />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 max-w-2xl scroll-reveal">
            <div className="accent-line" />
            <p className="section-eyebrow">Leistungen</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Klare Services statt generischer Pakete
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-white/60">
              Jede Leistung ist klar beschrieben, mit transparentem Einstiegspreis und direktem Weg zu Anfrage oder Buchung.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className="glass-card card-interactive group overflow-hidden rounded-[28px] scroll-reveal"
                style={{ transitionDelay: `${i * 80}ms` } as React.CSSProperties}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    sizes="(max-width: 1280px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  <span className="price-badge absolute bottom-4 left-4">
                    {service.price}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-[1.05rem] font-bold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-slate-600 dark:text-white/60">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:gap-3 dark:text-teal-300">
                    Mehr erfahren <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY SEEL (dark section) ─── */}
      <section className="relative overflow-hidden py-24 text-white">
        <div className="absolute inset-0 bg-slate-950" />
        {/* Subtle background image */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ maskImage: "linear-gradient(to right, transparent 10%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.7) 60%, transparent 90%)" }}
          aria-hidden="true"
        >
          <Image src="/images/moving-workers-furniture.png" alt="" fill className="object-cover object-center" />
        </div>
        {/* Radial accent top-right */}
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-[90px]" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="scroll-reveal">
            <div className="accent-line" />
            <p className="section-eyebrow text-teal-300">Warum SEEL</p>
            <h2 className="font-display mt-4 text-3xl font-bold md:text-4xl">
              Vertrauen entsteht durch Struktur, nicht durch laute Versprechen.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/65">
              Deshalb setzen wir auf realistische Kommunikation, saubere Abläufe und nachvollziehbare Preise.
            </p>
            <Link href="/unternehmen" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 transition hover:text-teal-200">
              Mehr über uns <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 scroll-reveal">
            {settings.whyChooseUs.map((item, i) => (
              <div key={item} className="feature-card" style={{ transitionDelay: `${i * 60}ms` } as React.CSSProperties}>
                <Sparkles size={17} className="text-teal-300" />
                <p className="mt-4 text-sm leading-7 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GOOGLE REVIEWS ─── */}
      <GoogleReviews data={reviewsData} />

      {/* ─── GALLERY ─── */}
      <Gallery
        images={galleryImages}
        title={settings.homepage.galleryTitle}
        subtitle={settings.homepage.galleryEyebrow}
        description={settings.homepage.galleryDescription}
      />

      {/* ─── FAQ ─── */}
      <section className="py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="scroll-reveal lg:sticky lg:top-28">
            <div className="accent-line" />
            <p className="section-eyebrow">FAQ</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Häufige Fragen</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-white/60">
              Antworten auf typische Fragen zu Ablauf, Region, Versicherung und Kombinationsleistungen.
            </p>
            <Link href="/kontakt" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-600 dark:text-teal-300 dark:hover:text-teal-200">
              Weitere Fragen? Schreiben Sie uns <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3 scroll-reveal">
            {faqItems.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary className="faq-summary">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="pb-28 pt-4">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200/50 px-8 py-14 text-white shadow-[0_32px_80px_rgba(15,23,42,0.30)] md:px-14 md:py-18">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#0d2234_40%,#0e3332_70%,#163b36_100%)]" />
            {/* Radial highlights */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.1),transparent_35%)]" />
            {/* Texture */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true">
              <Image src="/images/moving-truck-hero.png" alt="" fill className="object-cover object-right" />
            </div>

            <div className="relative z-10 md:flex md:items-center md:justify-between md:gap-12">
              <div className="mb-8 md:mb-0">
                <h2 className="font-display text-3xl font-bold md:text-4xl">{settings.homepage.finalCtaTitle}</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-white/70">{settings.homepage.finalCtaDescription}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/buchen"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_4px_16px_rgba(255,255,255,0.15)] transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                >
                  Jetzt buchen <ArrowRight size={16} />
                </Link>
                <a
                  href={`tel:${settings.contact.primaryPhone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <PhoneCall size={16} />
                  {settings.contact.primaryPhoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
