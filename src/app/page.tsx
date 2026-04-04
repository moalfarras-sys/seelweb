import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { fetchGoogleReviews } from "@/lib/google-reviews";
import GoogleReviews from "@/components/GoogleReviews";
import Gallery from "@/components/Gallery";
import { getPublicServicePriceLabel, getPublicServicePrices } from "@/lib/public-service-pricing";
import { getHomepageGalleryItems, getPublicGalleryItems, getPublicSiteSettings } from "@/lib/site-content";
import { CONTACT } from "@/config/contact";

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
  const [{ prices }, reviewsData, settings, homepageGalleryItems, publicGalleryItems] = await Promise.all([
    getPublicServicePrices(),
    fetchGoogleReviews(),
    getPublicSiteSettings(),
    getHomepageGalleryItems(),
    getPublicGalleryItems(),
  ]);
  const heroTitle = "Umzüge, Reinigung und Entrümpelung mit klarer Organisation.";
  const heroDescription =
    "SEEL Transport & Reinigung begleitet private und gewerbliche Einsätze mit festen Ansprechpartnern, transparenten Preisen und einem ruhigen, professionellen Ablauf.";
  const primaryCtaLabel = "Jetzt Angebot anfragen";
  const secondaryCtaLabel = "WhatsApp schreiben";

  const whatsappHref = `https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hallo, ich möchte ein Angebot für SEEL Transport & Reinigung anfragen.",
  )}`;
  const galleryItems = homepageGalleryItems.length > 0 ? homepageGalleryItems : publicGalleryItems.slice(0, 1);


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
      price: getPublicServicePriceLabel(prices, "umzug-berlin"),
      image: "/images/umzug-1.jpeg",
    },
    {
      title: "Expressumzug",
      alt: "Kurzfristiger Expressumzug von SEEL Transport in Berlin",
      description: "Kurzfristige Umzüge mit priorisierter Disposition, klarem Expresspreis und schneller Rückmeldung.",
      href: "/leistungen/expressumzug",
      price: getPublicServicePriceLabel(prices, "expressumzug"),
      image: "/images/Express.jpeg",
    },
    {
      title: "Büro- und Gewerbeumzug",
      alt: "Professioneller Büroservice von SEEL in Berlin",
      description: "Projektplanung für Unternehmen, Kanzleien, Praxen und Agenturen mit minimaler Ausfallzeit.",
      href: "/leistungen/gewerbe",
      price: getPublicServicePriceLabel(prices, "gewerbe"),
      image: "/images/corporate-hallway-cleaning.png",
    },
    {
      title: "Reinigung & Endreinigung",
      alt: "SEEL Reinigungsteam bei der professionellen Büroreinigung in Berlin",
      description: "Wohnung, Büro und Übergabe aus einer Hand mit klaren Leistungslisten und sauberer Dokumentation.",
      href: "/leistungen/reinigung",
      price: getPublicServicePriceLabel(prices, "reinigung"),
      image: "/images/cleaning-team-office.png",
    },
    {
      title: "Entrümpelung",
      alt: "SEEL Transport Entrümpelung und Entsorgung in Berlin",
      description: "Schnelle Räumung, saubere Trennung und fachgerechte Entsorgung mit klarer Abstimmung.",
      href: "/leistungen/entruempelung",
      price: getPublicServicePriceLabel(prices, "entruempelung"),
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

      <section className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/moving-truck-hero.png"
            alt="SEEL Transport Umzugswagen bereit für den Einsatz in Berlin"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.54)_0%,rgba(2,8,18,0.66)_38%,rgba(2,8,18,0.78)_100%)]" />
        </div>

        <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 pb-16 pt-28 md:justify-start md:px-8 md:pb-20 md:pt-32">
          <div className="mx-auto max-w-[700px] text-center md:mx-0 md:max-w-3xl md:text-left">
            <span className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/90 backdrop-blur-xl">
              {settings.homepage.heroBadge}
            </span>

            <h1 className="font-display mt-8 max-w-[12ch] text-[2.35rem] font-bold leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.38)] sm:max-w-[12.5ch] sm:text-[3.1rem] md:max-w-[13ch] md:text-[3.7rem] md:leading-[1.03] lg:text-[3.95rem]">
              {settings.homepage.heroTitle || heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.48)] sm:text-lg md:mt-6 md:text-[1.05rem] md:leading-8">
              {settings.homepage.heroDescription || heroDescription}
            </p>

            <div className="mt-7 flex flex-col items-center gap-4 sm:mt-8 sm:flex-row md:items-start">
              <Link href="/buchen" className="btn-primary-glass gap-2 text-sm font-semibold">
                {(settings.homepage.primaryCtaLabel || primaryCtaLabel)} <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-glass gap-2 border border-white/10 bg-white/10 text-sm font-semibold text-white"
              >
                <PhoneCall size={16} />
                {settings.homepage.secondaryCtaLabel || secondaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-8 pt-8">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-3 rounded-[28px] border border-white/40 bg-white/65 p-3 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.03] md:grid-cols-2 lg:grid-cols-4">
            {settings.trustBar.map((item) => (
              <div key={item.id} className="trust-pill justify-center border-transparent bg-transparent shadow-none">
                <ShieldCheck size={16} className="shrink-0 text-sky-600 dark:text-cyan-300" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-14 max-w-2xl scroll-reveal">
            <div className="accent-line" />
            <p className="section-eyebrow">Leistungen</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">
              Klare Leistungsfelder in einer präzisen visuellen Struktur.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-white/58">
              Jede Leistung ist klar beschrieben, mit transparentem Einstiegspreis und direktem Weg zu Anfrage oder Buchung.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className="premium-panel card-interactive group overflow-hidden rounded-[30px] scroll-reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    sizes="(max-width: 1280px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.04)_0%,rgba(2,8,18,0.14)_35%,rgba(2,8,18,0.84)_100%)]" />
                  <span className="price-badge absolute left-4 top-4">{service.price}</span>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/50">Premium Einsatz</p>
                    <h3 className="font-display mt-2 text-xl font-bold">{service.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-7 text-slate-600 dark:text-white/58">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-all duration-300 group-hover:gap-3 dark:text-cyan-300">
                    Mehr erfahren <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#020810_0%,#061320_34%,#0a1a2e_65%,#071e30_100%)]" />
        <div className="absolute inset-0 opacity-[0.12]">
          <Image src="/images/cleaning-team-government.png" alt="" fill className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(ellipse_at_10%_85%,rgba(56,189,248,0.08),transparent_30%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="scroll-reveal">
            <div className="accent-line" />
            <p className="section-eyebrow text-cyan-200">Warum SEEL</p>
            <h2 className="font-display mt-4 text-3xl font-bold md:text-5xl">
              Vertrauen entsteht durch Struktur, nicht durch laute Versprechen.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/65">
              Deshalb setzen wir auf realistische Kommunikation, saubere Abläufe und nachvollziehbare Preise.
            </p>
            <Link href="/unternehmen" className="btn-secondary-glass mt-8 gap-2 border border-white/10 bg-white/10 text-white">
              Mehr über uns <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 scroll-reveal">
            {settings.whyChooseUs.map((item, i) => (
              <div key={item} className="feature-card" style={{ transitionDelay: `${i * 60}ms` }}>
                <Sparkles size={17} className="text-cyan-300/80" />
                <p className="mt-4 text-sm leading-7 text-white/78">{item}</p>
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
        mode="compact"
        entryHref="/galerie"
      />

      <section className="pb-8">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="scroll-reveal lg:sticky lg:top-28">
            <div className="accent-line" />
            <p className="section-eyebrow">FAQ</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">Häufige Fragen</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-white/58">
              Antworten auf typische Fragen zu Ablauf, Region, Versicherung und Kombinationsleistungen.
            </p>
            <Link href="/kontakt" className="btn-ghost-premium mt-6 gap-2">
              Weitere Fragen? Schreiben Sie uns <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3 scroll-reveal">
            {faqItems.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary className="faq-summary">{faq.question}</summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-white/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28 pt-10">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-[40px] border border-white/[0.06] px-8 py-16 text-white shadow-[0_30px_90px_rgba(2,8,18,0.30)] md:px-14">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#04111d_0%,#082035_36%,#0a2a3f_72%,#0b3445_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_30%)]" />
            <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="relative z-10 md:flex md:items-center md:justify-between md:gap-12">
              <div className="mb-8 md:mb-0">
                <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-200/70">Finale Anfrage</p>
                <h2 className="font-display mt-4 text-3xl font-bold md:text-5xl">{settings.homepage.finalCtaTitle}</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-white/68">{settings.homepage.finalCtaDescription}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
                <Link href="/buchen" className="btn-primary-glass gap-2">
                  Jetzt buchen <ArrowRight size={16} />
                </Link>
                <a href={`tel:${settings.contact.primaryPhone}`} className="btn-secondary-glass gap-2 border border-white/10 bg-white/10 text-white">
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
