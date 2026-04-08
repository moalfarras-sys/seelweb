import type { Metadata } from "next";

const SITE_NAME = "SEEL Transport & Reinigung";
const BASE_URL = "https://seeltransport.de";

export function buildMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const normalizedTitle = title.includes("SEEL")
    ? title
    : `${title} | SEEL Transport & Reinigung`;
  const openGraphTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  return {
    title: normalizedTitle,
    description,
    keywords: keywords || [
      "umzug berlin",
      "umzugsfirma berlin",
      "reinigung berlin",
      "entrümpelung berlin",
      "transport berlin",
    ],
    openGraph: {
      title: openGraphTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "de_DE",
      type: "website",
      images: [{ url: `${BASE_URL}/images/logo.png`, width: 512, height: 512, alt: "SEEL Transport Logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
    },
    alternates: {
      canonical: url,
      languages: { "de": url },
    },
  };
}

export function buildFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function buildServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    name: service.name,
    description: service.description,
    url: `${BASE_URL}${service.url}`,
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Forster Straße 5",
        addressLocality: "Berlin",
        postalCode: "12627",
        addressCountry: "DE",
      },
    },
    areaServed: service.areaServed || "Berlin, Brandenburg",
    ...(service.priceRange ? { priceRange: service.priceRange } : {}),
  };
}
