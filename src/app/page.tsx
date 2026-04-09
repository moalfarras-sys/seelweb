import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
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
    answer: "Je nach Leistung prüfen wir reguläre Termine und Expressfenster. In dringenden Fällen ist eine strukturierte Reaktion innerhalb kurzer Zeit möglich.",
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
      description: "Klare Einsatzplanung, feste Ansprechpartner und ein ruhiger, versicherter Ablauf.",
      image: "/images/umzug-1.jpeg",
      price: getPublicServicePriceLabel(prices, "umzug-berlin"),
      accent: "Planbar",
    },
    {
      href: "/leistungen/expressumzug",
      title: "Expressumzug",
      description: "Kurzfristige Einsätze mit priorisierter Disposition und sauberer Kommunikation.",
      image: "/images/Express.jpeg",
      price: getPublicServicePriceLabel(prices, "expressumzug"),
      accent: "Sofort",
    },
    {
      href: "/leistungen/firmenumzug",
      title: "Büro- & Gewerbeumzug",
      description: "Projektlogik für Unternehmen, Praxen und Betriebsflächen mit minimaler Unterbrechung.",
      image: "/images/corporate-hallway-cleaning.png",
      price: getPublicServicePriceLabel(prices, "gewerbe"),
      accent: "Business",
    },
    {
      href: "/leistungen/reinigung",
      title: "Reinigung & Endreinigung",
      description: "Wohnung, Büro und Übergabe aus einer Hand mit dokumentierter Qualität.",
      image: "/images/cleaning-team-office.png",
      price: getPublicServicePriceLabel(prices, "reinigung"),
      accent: "Sauber",
    },
    {
      href: "/leistungen/entruempelung",
      title: "Entrümpelung & Entsorgung",
      description: "Räumung, Sortierung und fachgerechte Entsorgung in klar definierten Zeitfenstern.",
      image: "/images/waste-disposal-van.png",
      price: getPublicServicePriceLabel(prices, "entruempelung"),
      accent: "Effizient",
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

      <section className="hero-led-section relative min-h-[100svh] overflow-hidden px-4 pb-8 pt-28 md:px-6 md:pt-32 xl:px-0">
        <Image
          src="/images/moving-truck-hero.png"
          alt="SEEL Transport Umzugswagen im Einsatz in Berlin"
          fill
          priority
          className="image-cinematic object-cover object-center"
          sizes="100vw"
        />
        <div className="hero-film absolute inset-0" />
        <div className="hero-light-sweep" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.14),transparent_22%),linear-gradient(180deg,transparent_0%,rgba(5,12,22,0.22)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1240px] items-center">
          <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="hero-copy-flow max-w-3xl text-white">
              <span className="hero-badge-glow inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/88 backdrop-blur-2xl">
                <Sparkles size={14} className="text-brand-teal-light" />
                Berlin · Brandenburg · Deutschlandweit
              </span>
              <h1 className="headline-prism max-w-[12ch] font-display text-5xl font-bold leading-[0.94] sm:text-6xl md:text-7xl">
                Ihr Umzug. Unsere Präzision.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/78">
                SEEL organisiert Umzüge, Reinigung und Entrümpelung mit klarer Struktur, sauberer Kommunikation und einer Premium-Präsentation, die Vertrauen sofort sichtbar macht.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/buchen" className="btn-primary-glass gap-2 px-7 py-4 text-base">
                  Angebot anfragen <ArrowRight size={17} />
                </Link>
                <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="btn-secondary-glass gap-2 px-7 py-4 text-base">
                  Direkt anrufen <PhoneCall size={17} />
                </a>
              </div>
              <div className="hero-metrics">
                <span className="hero-metric">Express verfügbar</span>
                <span className="hero-metric">Vollversichert</span>
                <span className="hero-metric">4.9 Bewertung</span>
              </div>
            </div>

            <div className="grid gap-4 lg:justify-self-end">
              <div className="premium-panel-dark max-w-[460px] p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-teal-light">One Mission</p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-[2rem]">Premium-Ablauf statt Transport-Chaos.</h2>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  Für Privatkunden, Unternehmen und Expressfälle mit einer Oberfläche, die sich kontrolliert, modern und hochwertig anfühlt.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/46">Standardumzug</p>
                    <p className="mt-3 text-2xl font-semibold">{getPublicServicePriceLabel(prices, "umzug-berlin")}</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/46">Expressumzug</p>
                    <p className="mt-3 text-2xl font-semibold">{getPublicServicePriceLabel(prices, "expressumzug")}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm text-white/74">
                  {[
                    "Feste Ansprechpartner statt unklarer Hotline-Prozesse",
                    "Versicherte Ausführung nach HGB §451e",
                    "Kombinierbar mit Reinigung und Entrümpelung",
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-teal-light" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "500+", label: "Einsätze" },
                  { value: "10", label: "Mitarbeiter" },
                  { value: "48h", label: "Reaktionszeit" },
                ].map((item) => (
                  <div key={item.label} className="premium-panel px-5 py-4">
                    <p className="text-3xl font-bold text-text-primary dark:text-text-on-dark">{item.value}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted dark:text-text-on-dark-muted">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 xl:px-0">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Unsere Leistungen</p>
              <h2 className="section-title mt-4">Alles aus einer Hand. Klarer. Ruhiger. Wertiger.</h2>
              <p className="section-copy mt-4">
                Die neue Oberfläche ordnet jede Leistung wie ein hochwertiges Produkt ein. Weniger Lärm, mehr Vertrauen, klarere Entscheidungen.
              </p>
            </div>
            <div className="premium-panel max-w-md p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-gold">Leistungsbild</p>
              <p className="mt-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                SEEL verbindet Umzug, Reinigung und Entsorgung zu einem stimmigen Auftritt für Berlin und Brandenburg.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Link key={service.href} href={service.href} className={index === 0 ? "md:col-span-2 xl:col-span-1" : ""}>
                <article className="glass-card group h-full overflow-hidden">
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="image-cinematic object-cover"
                      sizes="(max-width: 1280px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,22,0.04)_0%,rgba(5,12,22,0.18)_52%,rgba(5,12,22,0.82)_100%)]" />
                    <div className="absolute left-5 top-5 flex items-center gap-2">
                      <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-xl">
                        {service.accent}
                      </span>
                    </div>
                    <span className="absolute right-5 top-5 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-navy">
                      {service.price}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-2xl font-semibold">{service.title}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{service.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal">
                      Mehr erfahren <ArrowRight size={15} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 md:px-6 lg:grid-cols-[0.96fr_1.04fr] xl:px-0">
          <div className="premium-panel-dark overflow-hidden p-0">
            <div className="relative min-h-[520px]">
              <Image
                src="/images/cleaning-team-government.png"
                alt="SEEL Team bei einem professionellen Einsatz"
                fill
                className="image-cinematic object-cover"
                sizes="(max-width: 1024px) 100vw, 44vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,22,0.08)_0%,rgba(5,12,22,0.2)_42%,rgba(5,12,22,0.88)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-teal-light">Warum SEEL?</p>
                <p className="mt-3 max-w-sm text-3xl font-semibold text-white">Vertrauen entsteht durch Struktur, nicht durch Lautstärke.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="premium-panel p-6 md:p-8">
              <p className="section-eyebrow">Warum SEEL?</p>
              <h2 className="section-title mt-4">Eine Samsung-artige Ruhe statt typischer Umzugshektik.</h2>
              <p className="section-copy mt-4">
                Die Marke soll modern, konzentriert und technisch präzise wirken. Deshalb setzen wir auf klare Hierarchien, gläserne Flächen und kontrollierte Bewegungen statt visuellem Chaos.
              </p>
              <Link href="/unternehmen" className="btn-secondary-glass mt-6 gap-2">
                Mehr über uns <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Feste Ansprechpartner statt anonymem Callcenter",
                "Transparente Preise ohne versteckte Kosten",
                "Vollversichert nach HGB §451e",
                "Kombinierte Leistungen aus einer Hand",
                "Express-Verfügbarkeit für dringende Einsätze",
                "Strukturierte Einsatzplanung für Privat & Gewerbe",
              ].map((item) => (
                <div key={item} className="glass-card p-5">
                  <p className="flex items-start gap-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                    <ShieldCheck size={18} className="mt-1 shrink-0 text-brand-teal" />
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 xl:px-0">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="section-eyebrow">Echte Einsätze</p>
              <h2 className="section-title mt-4">Reale Bilder. Stärker inszeniert.</h2>
              <p className="section-copy mt-4">
                Der neue Auftritt zeigt echte Arbeit wie ein kuratiertes Portfolio. Nicht als Bilderwand, sondern als sichtbaren Qualitätsbeweis.
              </p>
            </div>
            <div className="premium-panel p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-gold">Galerie Preview</p>
              <p className="mt-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                Echte Aufnahmen aus Umzug, Reinigung und Entsorgung mit ruhigerem Raster, stärkerem Fokus und hochwertigerem Kontrast.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Link href="/galerie" className="premium-panel-dark group overflow-hidden p-0">
              <div className="relative min-h-[420px]">
                <Image
                  src={galleryPreview[0]?.imageUrl || "/images/cleaning-team-office.png"}
                  alt={galleryPreview[0]?.alt || "SEEL Galerie Vorschau"}
                  fill
                  className="image-cinematic object-cover"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,22,0.04)_0%,rgba(5,12,22,0.2)_54%,rgba(5,12,22,0.88)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-teal-light">Portfolio Wall</p>
                  <p className="mt-3 text-3xl font-semibold">Keine Stockfotos. Keine Füllbilder.</p>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/72">
                    Die Galerie wird als echter Nachweis für Qualität, Sauberkeit und strukturiertes Arbeiten inszeniert.
                  </p>
                </div>
              </div>
            </Link>

            <div className="grid gap-4 sm:grid-cols-2">
              {galleryPreview.slice(1, 5).map((item) => (
                <Link key={item.id} href="/galerie" className="glass-card group overflow-hidden p-0">
                  <div className="relative h-[205px] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.alt}
                      fill
                      className="image-cinematic object-cover"
                      sizes="(max-width: 1024px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,rgba(5,12,22,0.84)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur-xl">
                        {item.category}
                      </span>
                      <p className="mt-3 text-sm font-semibold leading-6">{item.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/galerie" className="btn-primary-glass mt-8 gap-2">
            Alle ansehen <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 xl:px-0">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Kundenstimmen</p>
              <h2 className="section-title mt-4">Erfahrungen aus echten Einsätzen.</h2>
            </div>
            <div className="hidden rounded-full border border-border/70 bg-white/70 px-4 py-2 text-sm font-semibold text-text-body shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-border-dark dark:bg-white/5 dark:text-text-on-dark-muted md:inline-flex">
              5 echte Stimmen
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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
              <article key={review.author} className="glass-card p-6">
                <div className="flex gap-1 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-8 text-text-body dark:text-text-on-dark-muted">“{review.text}”</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted dark:text-text-on-dark-muted">
                  {review.author}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 xl:px-0">
          <div className="premium-panel-dark overflow-hidden px-8 py-10 sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-teal-light">Bereit für Ihren nächsten Einsatz?</p>
                <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Angebot in unter 2 Minuten.</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
                  Transparent, verbindlich und kostenlos. Der neue Auftritt ist schöner – die Anfrage bleibt genauso direkt und funktional.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/buchen" className="btn-primary-glass gap-2 px-6 py-3.5">
                  Jetzt buchen <ArrowRight size={16} />
                </Link>
                <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="rounded-full border border-white/12 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  <PhoneCall size={16} className="mr-2 inline-flex" />
                  {CONTACT.PRIMARY_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
