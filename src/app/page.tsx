import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2, PhoneCall, Star } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { getPublicServicePriceLabel, getPublicServicePrices } from "@/lib/public-service-pricing";
import { buildFaqSchema, buildMetadata } from "@/lib/seo";
import { getPublicGalleryItems, getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Umzug Berlin | SEEL Transport & Reinigung",
  description:
    "Professionelle Umzüge, Reinigung und Entrümpelung in Berlin und Brandenburg. Transparent, versichert, kurzfristig buchbar. Ab 34 €/Std.",
  path: "/",
  keywords: ["umzug berlin", "umzugsfirma berlin", "reinigung berlin", "entrümpelung berlin", "expressumzug berlin"],
});

const faqItems = [
  {
    question: "Wie schnell kann SEEL einen Einsatz übernehmen?",
    answer: "Je nach Leistung prüfen wir reguläre Termine und Expressfenster. In dringenden Fällen ist eine Reaktion innerhalb kurzer Zeit möglich.",
  },
  {
    question: "Ist der Umzug versichert?",
    answer: "Ja. Umzüge werden versichert und nach den gesetzlichen Vorgaben inklusive HGB §451e organisiert.",
  },
  {
    question: "Arbeitet SEEL nur in Berlin?",
    answer: "Nein. Wir betreuen Berlin, Brandenburg und auf Anfrage auch deutschlandweite Einsätze.",
  },
];

export default async function HomePage() {
  const [{ prices }, settings, gallery] = await Promise.all([
    getPublicServicePrices(),
    getPublicSiteSettings(),
    getPublicGalleryItems(),
  ]);

  const services = [
    {
      href: "/leistungen/umzug-berlin",
      title: "Privat- & Firmenumzug",
      description: "Klare Einsatzplanung, feste Ansprechpartner und strukturierte Durchführung.",
      image: "/images/umzug-1.jpeg",
      price: getPublicServicePriceLabel(prices, "umzug-berlin"),
    },
    {
      href: "/leistungen/expressumzug",
      title: "Expressumzug",
      description: "Priorisierte Disposition für besonders kurzfristige Einsätze.",
      image: "/images/Express.jpeg",
      price: getPublicServicePriceLabel(prices, "expressumzug"),
    },
    {
      href: "/leistungen/firmenumzug",
      title: "Büro- & Gewerbeumzug",
      description: "Projektlogik für Unternehmen, Praxen und Agenturen mit minimaler Unterbrechung.",
      image: "/images/corporate-hallway-cleaning.png",
      price: getPublicServicePriceLabel(prices, "gewerbe"),
    },
    {
      href: "/leistungen/reinigung",
      title: "Reinigung & Endreinigung",
      description: "Wohnung, Büro und Übergabe aus einer Hand mit sauberer Dokumentation.",
      image: "/images/cleaning-team-office.png",
      price: getPublicServicePriceLabel(prices, "reinigung"),
    },
    {
      href: "/leistungen/entruempelung",
      title: "Entrümpelung & Entsorgung",
      description: "Räumung, Sortierung und fachgerechte Entsorgung in klaren Zeitfenstern.",
      image: "/images/waste-disposal-van.png",
      price: getPublicServicePriceLabel(prices, "entruempelung"),
    },
  ];

  const galleryPreview = gallery.slice(0, 6);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company.name,
    url: settings.contact.websiteUrl,
    logo: `${settings.contact.websiteUrl}/images/logo-new.png`,
    telephone: settings.contact.primaryPhoneDisplay,
    email: settings.contact.email,
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    name: settings.company.name,
    url: settings.contact.websiteUrl,
    telephone: settings.contact.primaryPhoneDisplay,
    email: settings.contact.email,
    openingHours: "Mo-So 07:00-20:00",
    priceRange: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Forster Straße 5",
      postalCode: "12627",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
  };

  const serviceSchemas = services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "LocalBusiness", name: settings.company.name },
    areaServed: "Berlin, Brandenburg, Deutschland",
    url: `https://seeltransport.de${service.href}`,
  }));

  return (
    <>
      <Script id="home-faq-schema" type="application/ld+json">{JSON.stringify(buildFaqSchema(faqItems))}</Script>
      <Script id="home-organization-schema" type="application/ld+json">{JSON.stringify(organizationSchema)}</Script>
      <Script id="home-local-business-schema" type="application/ld+json">{JSON.stringify(localBusinessSchema)}</Script>
      <Script id="home-services-schema" type="application/ld+json">{JSON.stringify(serviceSchemas)}</Script>

      <section className="relative min-h-[100svh] overflow-hidden">
        <Image src="/images/moving-truck-hero.png" alt="SEEL Transport Umzugswagen im Einsatz in Berlin" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,22,40,0.85)_0%,rgba(11,22,40,0.6)_42%,rgba(11,22,40,0.1)_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1200px] items-center px-4 py-24 md:px-8 xl:px-0">
          <div className="hero-copy-flow max-w-3xl text-white">
            <span className="hero-badge-glow inline-flex items-center rounded-pill border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md">
              📍 Berlin · Brandenburg · Deutschlandweit
            </span>
            <h1 className="mt-6 max-w-[12ch] font-display text-5xl font-bold leading-[0.98] text-white sm:text-6xl md:text-7xl">
              Ihr Umzug. Unsere <span className="text-brand-teal">Präzision.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              SEEL organisiert Umzüge, Reinigung und Entrümpelung strukturiert, transparent und stressfrei.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/buchen" className="rounded-pill bg-brand-teal px-8 py-4 text-lg font-semibold text-white transition hover:brightness-110">
                Angebot anfragen <ArrowRight size={18} className="ml-2 inline-flex" />
              </Link>
              <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="rounded-pill border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur">
                Direkt anrufen
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-white/8 backdrop-blur-lg">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-4 px-4 py-4 text-sm font-semibold text-white md:flex-row md:gap-8 md:px-8 xl:px-0">
            <span>⚡ Express ab 2h</span>
            <span className="hidden h-5 w-px bg-white/20 md:block" />
            <span>✓ Vollversichert</span>
            <span className="hidden h-5 w-px bg-white/20 md:block" />
            <span>★ 4.9 Bewertung</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-[1200px] gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 md:px-8 xl:px-0">
          {[
            { value: "500+", label: "Einsätze" },
            { value: "10", label: "Teammitglieder" },
            { value: "48h", label: "Reaktionszeit" },
            { value: "4.9★", label: "Bewertung" },
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border border-border bg-white p-6 text-center shadow-[var(--shadow-card)] dark:border-border-dark dark:bg-surface-dark-card">
              <p className="font-display text-4xl font-bold text-brand-teal">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-text-body dark:text-text-on-dark-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 xl:px-0">
          <div className="max-w-2xl">
            <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Unsere Leistungen</p>
            <h2 className="mt-3 text-4xl font-bold text-text-primary dark:text-text-on-dark">Alles aus einer Hand.</h2>
            <p className="mt-4 text-base leading-7 text-text-body dark:text-text-on-dark-muted">
              Präzise geplant, professionell ausgeführt und so aufgebaut, dass Privat- und Gewerbekunden schnell Entscheidungen treffen können.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="group overflow-hidden rounded-card border border-border bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] dark:border-border-dark dark:bg-surface-dark-card">
                <div className="relative h-[180px] overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1280px) 100vw, 33vw" />
                  <span className="absolute right-4 top-4 rounded-pill bg-brand-gold px-3 py-1 text-xs font-semibold text-brand-navy">{service.price}</span>
                </div>
                <div className="p-6">
                  <p className="text-xl font-bold text-text-primary dark:text-text-on-dark">{service.title}</p>
                  <p className="mt-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal">
                    Mehr erfahren <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 lg:grid-cols-[1.15fr_0.85fr] md:px-8 xl:px-0">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Warum SEEL?</p>
            <h2 className="mt-3 text-4xl font-bold text-text-primary dark:text-text-on-dark">Vertrauen entsteht durch Struktur.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Feste Ansprechpartner statt anonymem Callcenter",
                "Transparente Preise ohne versteckte Kosten",
                "Vollversichert nach HGB §451e",
                "Kombinierte Leistungen aus einer Hand",
                "Express-Verfügbarkeit innerhalb kurzer Zeit",
                "Strukturierte Einsatzplanung für Privat & Gewerbe",
              ].map((item) => (
                <div key={item} className="rounded-[22px] bg-white p-5 shadow-[var(--shadow-card)] dark:bg-surface-dark-card">
                  <p className="flex items-start gap-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-brand-teal" />
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/unternehmen" className="mt-8 inline-flex items-center gap-2 rounded-pill border border-border px-6 py-3 text-sm font-semibold text-text-primary transition hover:border-brand-teal hover:text-brand-teal dark:border-border-dark dark:text-text-on-dark">
              Mehr über uns <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[30px]">
            <Image src="/images/cleaning-team-government.png" alt="SEEL Team bei einem professionellen Einsatz" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 xl:px-0">
          <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Echte Einsätze</p>
          <h2 className="mt-3 text-4xl font-bold text-text-primary dark:text-text-on-dark">Keine Stockfotos.</h2>
          <p className="mt-4 text-base leading-7 text-text-body dark:text-text-on-dark-muted">Einblicke in laufende Arbeiten und Projekte.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {galleryPreview.map((item) => (
              <Link key={item.id} href="/galerie" className="group relative overflow-hidden rounded-[26px]">
                <Image src={item.imageUrl} alt={item.alt} width={800} height={560} className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(11,22,40,0.82)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="rounded-pill bg-brand-teal px-3 py-1 text-xs font-semibold">{item.category}</span>
                  <p className="mt-3 text-lg font-semibold">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/galerie" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal">
            Alle ansehen <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 xl:px-0">
          <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Was unsere Kunden sagen</p>
          <h2 className="mt-3 text-4xl font-bold text-text-primary dark:text-text-on-dark">Erfahrungen aus echten Einsätzen.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                text: "Pünktlich, freundlich und professionell. Unser Umzug lief absolut reibungslos.",
                author: "Thomas K., Privatumzug Berlin-Mitte · Mai 2025",
              },
              {
                text: "Tolle Organisation, transparente Preise. Buchen wir definitiv wieder.",
                author: "Sandra M., Endreinigung Berlin-Prenzlauer Berg · März 2025",
              },
              {
                text: "Express-Entrümpelung in 4 Stunden erledigt. Sehr empfehlenswert.",
                author: "Bau GmbH Berlin, Gewerbekunde · Februar 2025",
              },
            ].map((review) => (
              <div key={review.author} className="rounded-[26px] border border-border bg-white p-6 shadow-[var(--shadow-card)] dark:border-border-dark dark:bg-surface-dark-card">
                <div className="flex gap-1 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">“{review.text}”</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted dark:text-text-on-dark-muted">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 xl:px-0">
          <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#081220_0%,#0B1628_50%,#152238_100%)] px-8 py-14 text-white">
            <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal-light">Bereit für Ihren nächsten Einsatz?</p>
            <h2 className="mt-4 text-4xl font-bold">Angebot in unter 2 Minuten.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Transparent, verbindlich und kostenlos. Wir begleiten Ihren Einsatz von der Anfrage bis zur Ausführung.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/buchen" className="rounded-pill bg-brand-teal px-6 py-3 text-sm font-semibold text-white">
                Jetzt buchen
              </Link>
              <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="rounded-pill border border-white/20 px-6 py-3 text-sm font-semibold text-white">
                <PhoneCall size={16} className="mr-2 inline-flex" />
                {CONTACT.PRIMARY_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
