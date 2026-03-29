import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { getPrices, formatPricePerHour } from "@/lib/getPrices";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { fetchGoogleReviews } from "@/lib/google-reviews";
import GoogleReviews from "@/components/GoogleReviews";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = buildMetadata({
  title: "Umzüge, Reinigung und Entrümpelung",
  description:
    "SEEL Transport & Reinigung ist Ihre Umzugsfirma in Berlin für Privatumzug, Firmenumzug, Schulumzug, Reinigung und Entrümpelung in Berlin und Brandenburg.",
  path: "/",
});

const faqItems = [
  {
    question: "Wie schnell können Sie einen Umzug in Berlin übernehmen?",
    answer: "Reguläre Umzüge planen wir mit festen Zeitfenstern. Für besonders dringende Fälle bieten wir einen Expressumzug mit kurzfristiger Disposition an.",
  },
  {
    question: "Arbeiten Sie auch außerhalb von Berlin?",
    answer: "Ja. Neben Berlin betreuen wir regelmäßig Brandenburg und deutschlandweite Umzüge mit klarer Einsatzplanung und transparenter Preisstruktur.",
  },
  {
    question: "Sind Möbel und Inventar versichert?",
    answer: "Ja. Transporte werden nach HGB §451e durchgeführt. Auf Wunsch beraten wir zusätzlich zu erweiterten Absicherungen.",
  },
  {
    question: "Kann ich Reinigung und Umzug kombinieren?",
    answer: "Ja. Viele Kundinnen und Kunden kombinieren Privatumzug, Endreinigung und Entrümpelung in einem abgestimmten Ablauf.",
  },
];

const galleryImages = [
  { src: "/images/umzug-1.jpeg", alt: "Umzug Berlin" },
  { src: "/images/Express.jpeg", alt: "Expressumzug" },
  { src: "/images/cleaning-team-office.png", alt: "Büroreinigung" },
  { src: "/images/corporate-hallway-cleaning.png", alt: "Gewerbereinigung" },
  { src: "/images/corporate-glass-cleaning.png", alt: "Glasreinigung" },
  { src: "/images/corporate-school-cleaning.png", alt: "Schulreinigung" },
  { src: "/images/waste-disposal-van.png", alt: "Entrümpelung" },
  { src: "/images/waste-disposal-apartment.png", alt: "Wohnungsräumung" },
  { src: "/images/clean/clean (1).jpeg", alt: "Reinigung Projekt 1" },
  { src: "/images/clean/clean (2).jpeg", alt: "Reinigung Projekt 2" },
  { src: "/images/clean/clean (3).jpeg", alt: "Reinigung Projekt 3" },
  { src: "/images/clean/clean (4).jpeg", alt: "Reinigung Projekt 4" },
];

export default async function HomePage() {
  const prices = await getPrices();
  const reviewsData = await fetchGoogleReviews();

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    name: "SEEL Transport & Reinigung",
    url: "https://seeltransport.de",
    telephone: "+49 172 8003410",
    email: "info@seeltransport.de",
    address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
    areaServed: [{ "@type": "City", name: "Berlin" }, { "@type": "State", name: "Brandenburg" }],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "€€",
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
    { title: "Privat- und Firmenumzug", description: "Strukturierte Umzüge mit erfahrenem Team, festen Zeitfenstern und optionaler Montage.", href: "/leistungen/umzug-berlin", price: formatPricePerHour(prices.umzugStandard), image: "/images/umzug-1.jpeg" },
    { title: "Büro- & Gewerbeumzug", description: "Projektplanung für Unternehmen, Kanzleien, Praxen und Agenturen mit minimaler Ausfallzeit.", href: "/leistungen/gewerbe", price: formatPricePerHour(prices.gewerbeUmzug), image: "/images/corporate-hallway-cleaning.png" },
    { title: "Schulumzug Berlin", description: "Ferien-, Wochenend- und Etappenumzüge für Schulen, Kitas und Bildungseinrichtungen.", href: "/leistungen/schulumzug", price: formatPricePerHour(prices.umzugStandard), image: "/images/corporate-school-cleaning.png" },
    { title: "Reinigung & Endreinigung", description: "Wohnung, Büro und Übergabe aus einer Hand mit klaren Leistungslisten.", href: "/leistungen/reinigung", price: formatPricePerHour(prices.reinigungWohnung), image: "/images/cleaning-team-office.png" },
    { title: "Entrümpelung", description: "Schnelle Räumung, saubere Trennung und fachgerechte Entsorgung.", href: "/leistungen/entruempelung", price: formatPricePerHour(prices.entruempelung), image: "/images/waste-disposal-van.png" },
    { title: "Expressumzug", description: "Kurzfristige Umzüge mit priorisierter Disposition.", href: "/leistungen/expressumzug", price: formatPricePerHour(prices.umzugExpress), image: "/images/Express.jpeg" },
  ];

  return (
    <>
      <Script id="home-local-business-schema" type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </Script>
      <Script id="home-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/umzug-1.jpeg" alt="SEEL Transport Berlin" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 py-20 md:px-8">
          <div className="max-w-3xl">
            <p className="stat-card inline-flex px-4 py-2 text-sm font-semibold !text-cyan-400">
              Umzugsfirma Berlin · Seit 2016
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Umzüge, Reinigung &amp; Entrümpelung für Berlin
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              SEEL Transport verbindet klare Planung, transparente Preise und zuverlässige Teams.
              Privat, Gewerbe oder Express — wir kümmern uns um alles.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/buchen" className="btn-primary-glass inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold">
                Jetzt Angebot anfragen <ArrowRight size={16} />
              </Link>
              <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="btn-secondary-glass inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold !text-white !border-white/20 !bg-white/10 hover:!bg-white/20">
                {CONTACT.PRIMARY_PHONE_DISPLAY}
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <p className="text-lg font-bold text-white">{formatPricePerHour(prices.umzugStandard)}</p>
                <p className="mt-1 text-xs text-white/50">Umzug Standard</p>
              </div>
              <div className="stat-card">
                <p className="text-lg font-bold text-white">{formatPricePerHour(prices.reinigungWohnung)}</p>
                <p className="mt-1 text-xs text-white/50">Reinigung</p>
              </div>
              <div className="stat-card">
                <p className="text-lg font-bold text-cyan-400">24/7</p>
                <p className="mt-1 text-xs text-white/50">Erreichbar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section-glass relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600 dark:text-cyan-400">Unsere Leistungen</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Alles zentral geplant</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="glass-card group overflow-hidden rounded-2xl">
                <div className="relative h-56">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1280px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="stat-card inline-flex px-3 py-1.5 text-xs font-semibold !text-cyan-400">
                      {service.price}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-white/60">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-cyan-400">
                    Mehr erfahren <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="section-glass-alt relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["24/7 erreichbar", "Transparent kalkuliert", "Versichert nach HGB §451e", "Berlin & Brandenburg"].map((item) => (
              <div key={item} className="glass-card flex items-start gap-3 rounded-2xl p-6">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-teal-500 dark:text-cyan-400" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <GoogleReviews data={reviewsData} />

      {/* ── FAQ ── */}
      <section className="section-glass relative z-10 py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-white">Häufige Fragen</h2>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details key={faq.question} className="glass-card rounded-2xl p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-white">{faq.question}</summary>
                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-white/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <Gallery
        images={galleryImages}
        title="Unsere Arbeit in Bildern"
        subtitle="Galerie"
      />

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <div className="glass-strong rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Bereit für Ihren nächsten Einsatz?</h2>
            <p className="mt-5 text-lg text-slate-500 dark:text-white/60">
              Starten Sie Ihre Buchung online oder senden Sie uns Ihre Festpreisanfrage.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/buchen" className="btn-primary-glass inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold">
                Jetzt buchen
              </Link>
              <Link href="/leistungen/umzug-berlin" className="btn-secondary-glass inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold">
                Umzugsfirma Berlin ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
