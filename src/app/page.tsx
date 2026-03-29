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
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    areaServed: [
      { "@type": "City", name: "Berlin" },
      { "@type": "State", name: "Brandenburg" },
    ],
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
    {
      title: "Privat- und Firmenumzug",
      description: "Strukturierte Umzüge mit erfahrenem Team, festen Zeitfenstern und optionaler Montage.",
      href: "/leistungen/umzug-berlin",
      price: formatPricePerHour(prices.umzugStandard),
      image: "/images/moving-workers-furniture.png",
    },
    {
      title: "Büro- & Gewerbeumzug",
      description: "Projektplanung für Unternehmen, Kanzleien, Praxen und Agenturen mit minimaler Ausfallzeit.",
      href: "/leistungen/gewerbe",
      price: formatPricePerHour(prices.gewerbeUmzug),
      image: "/images/corporate-hallway-cleaning.png",
    },
    {
      title: "Schulumzug Berlin",
      description: "Ferien-, Wochenend- und Etappenumzüge für Schulen, Kitas und Bildungseinrichtungen.",
      href: "/leistungen/schulumzug",
      price: formatPricePerHour(prices.umzugStandard),
      image: "/images/corporate-school-cleaning.png",
    },
    {
      title: "Reinigung & Endreinigung",
      description: "Wohnung, Büro und Übergabe aus einer Hand mit klaren Leistungslisten und festen Ansprechpartnern.",
      href: "/leistungen/reinigung",
      price: formatPricePerHour(prices.reinigungWohnung),
      image: "/images/cleaning-team-office.png",
    },
    {
      title: "Entrümpelung",
      description: "Schnelle Räumung, saubere Trennung und fachgerechte Entsorgung in Berlin und Brandenburg.",
      href: "/leistungen/entruempelung",
      price: formatPricePerHour(prices.entruempelung),
      image: "/images/waste-disposal-van.png",
    },
    {
      title: "Expressumzug",
      description: "Kurzfristige Umzüge mit priorisierter Disposition für besonders dringende Fälle.",
      href: "/leistungen/expressumzug",
      price: formatPricePerHour(prices.umzugExpress),
      image: "/images/moving-truck-hero.png",
    },
  ];

  return (
    <>
      <Script id="home-local-business-schema" type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </Script>
      <Script id="home-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqItems))}
      </Script>

      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-teal-400 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500 blur-[160px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-2">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-300 backdrop-blur-xl">
              Umzugsfirma Berlin für Privat, Gewerbe und Bildungseinrichtungen
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Moderne Umzüge, Reinigung und Entrümpelung für Berlin & Brandenburg
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-silver-200">
              SEEL Transport & Reinigung verbindet klare Planung, transparente Preise und eine hochwertige Glass-UI-Erfahrung
              mit echter operativer Zuverlässigkeit vor Ort.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/buchen" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600">
                Jetzt Angebot anfragen
                <ArrowRight size={16} />
              </Link>
              <a href={`tel:${CONTACT.PRIMARY_PHONE}`} className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15">
                {CONTACT.PRIMARY_PHONE_DISPLAY}
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm font-semibold text-white">Zuverlässiger Service in Berlin &amp; Brandenburg</p>
                <p className="mt-2 text-sm text-silver-300">Flexible Termine auch kurzfristig</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm font-semibold text-white">{formatPricePerHour(prices.umzugStandard)}</p>
                <p className="mt-2 text-sm text-silver-300">Mindestabnahme 2 Stunden · Berlin & Brandenburg</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl shadow-black/20">
              <Image
                src="/images/moving-workers-furniture.png"
                alt="SEEL Transport Team beim Umzug in Berlin"
                width={960}
                height={1080}
                priority
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 left-6 rounded-3xl border border-white/20 bg-white/15 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-white">Expressumzug</p>
              <p className="mt-1 text-sm text-teal-300">{formatPricePerHour(prices.umzugExpress)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Unsere Leistungen</p>
            <h2 className="mt-4 text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">Alles zentral geplant, überall klar kommuniziert</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="group overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-navy-700/50 dark:bg-navy-900">
                <div className="relative h-56">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1280px) 100vw, 33vw" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy-800 dark:text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">{service.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-teal-600 dark:text-teal-300">{service.price}</p>
                      <p className="text-xs text-silver-500 dark:text-silver-400">Mindestabnahme 2 Stunden</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 dark:text-white">
                      Mehr erfahren
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-6 lg:grid-cols-4">
            {[
              "24/7 erreichbar",
              "Transparent kalkuliert",
              "Versichert nach HGB §451e",
              "Berlin & Brandenburg",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-navy-700/50 dark:bg-navy-800/60">
                <CheckCircle2 size={20} className="text-teal-500" />
                <p className="mt-4 text-sm font-semibold text-navy-800 dark:text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews data={reviewsData} />

      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-gray-100 bg-white p-5 dark:border-navy-700/50 dark:bg-navy-800/60">
                <summary className="cursor-pointer list-none text-sm font-semibold text-navy-800 dark:text-white">{faq.question}</summary>
                <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-navy py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Bereit für Ihren nächsten Einsatz?</h2>
          <p className="mt-5 text-lg text-silver-300">
            Starten Sie Ihre Buchung online oder senden Sie uns Ihre Festpreisanfrage für Berlin und Brandenburg.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/buchen" className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600">
              Jetzt buchen
            </Link>
            <Link href="/leistungen/umzug-berlin" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
              Umzugsfirma Berlin ansehen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
