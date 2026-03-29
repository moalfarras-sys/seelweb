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
      description: "Strukturierte Umzüge mit erfahrenem Team, festen Zeitfenstern und optionaler Montage.",
      href: "/leistungen/umzug-berlin",
      price: formatPricePerHour(prices.umzugStandard),
      image: "/images/moving-truck-hero.png",
    },
    {
      title: "Büro- und Gewerbeumzug",
      description: "Projektplanung für Unternehmen, Kanzleien, Praxen und Agenturen mit minimaler Ausfallzeit.",
      href: "/leistungen/gewerbe",
      price: formatPricePerHour(prices.gewerbeUmzug),
      image: "/images/corporate-hallway-cleaning.png",
    },
    {
      title: "Reinigung & Endreinigung",
      description: "Wohnung, Büro und Übergabe aus einer Hand mit klaren Leistungslisten und sauberer Dokumentation.",
      href: "/leistungen/reinigung",
      price: formatPricePerHour(prices.reinigungWohnung),
      image: "/images/cleaning-team-office.png",
    },
    {
      title: "Entrümpelung",
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

      <section className="relative overflow-hidden pb-14 pt-10 md:pb-20 md:pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_90%_20%,rgba(15,23,42,0.08),transparent_22%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
              {settings.homepage.heroBadge}
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-6xl">
              {settings.homepage.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-white/65">
              {settings.homepage.heroDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/buchen" className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
                {settings.homepage.primaryCtaLabel} <ArrowRight size={16} />
              </Link>
              <a href={`tel:${settings.contact.primaryPhone}`} className="btn-secondary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
                <PhoneCall size={16} />
                {settings.homepage.secondaryCtaLabel}
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="premium-stat">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Umzug</p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{formatPricePerHour(prices.umzugStandard)}</p>
              </div>
              <div className="premium-stat">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reinigung</p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{formatPricePerHour(prices.reinigungWohnung)}</p>
              </div>
              <div className="premium-stat">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Erreichbarkeit</p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{settings.contact.availability}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-white/70 bg-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-white/5">
                <Image src="/images/umzug-1.jpeg" alt="Umzugsteam von SEEL Transport in Berlin" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm font-semibold">Saubere Planung und ruhige Durchführung</p>
                  <p className="mt-2 text-sm text-white/75">Für Privatkunden, Unternehmen und institutionelle Einsätze.</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="relative min-h-[200px] overflow-hidden rounded-[28px] border border-white/70 bg-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/5">
                  <Image src="/images/cleaning-team-office.png" alt="Reinigungsteam von SEEL Transport & Reinigung" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 20vw" />
                </div>
                <div className="glass-card rounded-[28px] p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Warum Kunden bleiben</p>
                  <ul className="mt-4 space-y-3">
                    {settings.whyChooseUs.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-white/70">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-teal-300" />
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

      <section className="border-y border-slate-200/80 bg-white/75 py-5 backdrop-blur dark:border-white/5 dark:bg-white/5">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          {settings.trustBar.map((item) => (
            <div key={item.id} className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              <ShieldCheck size={18} className="text-emerald-600 dark:text-teal-300" />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">Leistungen</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">Klare Services statt generischer Pakete</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-white/60">
              Jede Leistung ist klar beschrieben, mit transparentem Einstiegspreis und direktem Weg zu Anfrage oder Buchung.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="glass-card group overflow-hidden rounded-[28px]">
                <div className="relative h-56">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1280px) 100vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900">
                    {service.price}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/60">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-teal-300">
                    Mehr erfahren <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">Warum SEEL</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Vertrauen entsteht durch Struktur, nicht durch laute Versprechen.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              Deshalb setzen wir auf realistische Kommunikation, saubere Abläufe und nachvollziehbare Preise.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {settings.whyChooseUs.map((item) => (
              <div key={item} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <Sparkles size={18} className="text-teal-300" />
                <p className="mt-4 text-sm leading-7 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews data={reviewsData} />

      <Gallery
        images={galleryImages}
        title={settings.homepage.galleryTitle}
        subtitle={settings.homepage.galleryEyebrow}
        description={settings.homepage.galleryDescription}
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">Häufige Fragen</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-white/60">
              Antworten auf typische Fragen zu Ablauf, Region, Versicherung und Kombinationsleistungen.
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details key={faq.question} className="glass-card rounded-[24px] p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#102234_45%,#163b36_100%)] px-8 py-12 text-white shadow-[0_24px_70px_rgba(15,23,42,0.26)] md:px-12 md:py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_24%)]" />
            <div className="relative">
              <h2 className="text-3xl font-semibold md:text-4xl">{settings.homepage.finalCtaTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">{settings.homepage.finalCtaDescription}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/buchen" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  Jetzt buchen <ArrowRight size={16} />
                </Link>
                <a href={`tel:${settings.contact.primaryPhone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
                  Anrufen: {settings.contact.primaryPhoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
