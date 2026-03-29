import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getPublicSiteSettings } from "@/lib/site-content";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1722" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://seeltransport.de"),
  title: "SEEL Transport - Umzüge, Reinigung und Entrümpelung in Berlin",
  description:
    "Professionelle Umzüge, Transporte, Reinigung und Entrümpelung in Berlin, Brandenburg und bei geplanten deutschlandweiten Einsätzen.",
  keywords: [
    "Umzug Berlin",
    "Umzugsfirma Berlin",
    "Entrümpelung Berlin",
    "Transport Service Berlin",
    "Reinigung Berlin",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SEEL Transport",
  },
  openGraph: {
    title: "SEEL Transport - Umzugsfirma Berlin",
    description: "Umzug, Transport, Reinigung und Entrümpelung aus einer Hand.",
    url: "https://seeltransport.de",
    siteName: "SEEL Transport",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/images/logo.jpeg", width: 512, height: 512, alt: "SEEL Transport Logo" }],
  },
  alternates: {
    canonical: "https://seeltransport.de",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-next-url") ?? headersList.get("x-invoke-path") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const siteContent = await getPublicSiteSettings();
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MovingCompany"],
    name: siteContent.company.name,
    url: siteContent.contact.websiteUrl,
    logo: `${siteContent.contact.websiteUrl}/images/logo.jpeg`,
    telephone: siteContent.contact.primaryPhoneDisplay,
    email: siteContent.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: [siteContent.company.addressLine1, siteContent.company.addressLine2].filter(Boolean).join(", "),
      addressLocality: siteContent.company.city,
      addressCountry: "DE",
    },
    areaServed: siteContent.contact.serviceRegion,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "EUR",
  };

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" href="/images/logo.jpeg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <Script id="local-business-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(localBusinessSchema)}
        </Script>
      </head>
      <body className={`antialiased ${displayFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SiteContentProvider value={siteContent}>
            {!isAdmin && <div className="bg-blob-1" />}
            {!isAdmin && <div className="bg-blob-2" />}
            {!isAdmin && <div className="bg-blob-3" />}
            {!isAdmin && <Navbar />}
            <main className="relative z-10 min-h-screen">{children}</main>
            {!isAdmin && <Footer />}
            {!isAdmin && <WhatsAppButton />}
            {!isAdmin && <CookieBanner />}
          </SiteContentProvider>

          {!isAdmin && (
            <>
              <Script id="sw-register" strategy="afterInteractive">{`
                (async function() {
                  if (!('serviceWorker' in navigator)) return;
                  try {
                    var isDev = ${process.env.NODE_ENV === "development" ? "true" : "false"};
                    if (isDev) {
                      var regs = await navigator.serviceWorker.getRegistrations();
                      await Promise.all(regs.map(function(r) { return r.unregister(); }));
                      if ('caches' in window) {
                        var keys = await caches.keys();
                        await Promise.all(keys.map(function(k) { return caches.delete(k); }));
                      }
                      return;
                    }
                    await navigator.serviceWorker.register('/sw.js?v=20260305-2');
                  } catch (e) {}
                })();
              `}</Script>
              <Script id="scroll-reveal" strategy="afterInteractive">{`
                (function() {
                  var io = new IntersectionObserver(function(entries) {
                    entries.forEach(function(e) {
                      if (e.isIntersecting) {
                        e.target.classList.add('visible');
                        io.unobserve(e.target);
                      }
                    });
                  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
                  document.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger').forEach(function(el) {
                    io.observe(el);
                  });
                  new MutationObserver(function() {
                    document.querySelectorAll('.scroll-reveal:not(.visible), .scroll-reveal-stagger:not(.visible)').forEach(function(el) {
                      io.observe(el);
                    });
                  }).observe(document.body, { childList: true, subtree: true });
                })();
              `}</Script>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
