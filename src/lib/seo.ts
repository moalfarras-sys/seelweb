import type { Metadata } from "next";

const SITE_NAME = "SEEL Transport & Reinigung";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://seeltransport.de";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

function absoluteUrl(path: string) {
  return new URL(path, BASE_URL).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const titleBase = title.includes("|") ? title.split("|")[0].trim() : title.trim();
  const normalizedTitle = titleBase === SITE_NAME ? SITE_NAME : `${titleBase} | ${SITE_NAME}`;
  const openGraphTitle = normalizedTitle;
  const imageUrl = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

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
    alternates: {
      canonical: url,
      languages: {
        de: url,
      },
    },
    openGraph: {
      title: openGraphTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "de_DE",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} Open Graph Bild`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
      images: [imageUrl],
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
      item: absoluteUrl(item.url),
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
    url: absoluteUrl(service.url),
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
