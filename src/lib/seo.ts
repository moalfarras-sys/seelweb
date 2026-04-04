import type { Metadata } from "next";

const SITE_NAME = "SEEL Transport & Reinigung";
const BASE_URL = "https://seeltransport.de";

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const normalizedTitle = title.includes("SEEL Transport Berlin")
    ? title
    : `${title} | SEEL Transport Berlin`;
  const openGraphTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  return {
    title: normalizedTitle,
    description,
    openGraph: {
      title: openGraphTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "de_DE",
      type: "website",
    },
    alternates: {
      canonical: url,
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
