import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "../styles/globals.css";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CookieBanner } from "@/components/layout/CookieBanner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getPublicSiteSettings } from "@/lib/site-content";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const uiFont = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://seeltransport.de";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F7FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1628" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SEEL Transport & Reinigung",
    template: "%s",
  },
  description:
    "Professionelle Umzüge, Reinigung und Entrümpelung in Berlin und Brandenburg. Transparent, versichert, kurzfristig buchbar. Ab 34 €/Std.",
  keywords: [
    "Umzug Berlin",
    "Umzugsfirma Berlin",
    "Entrümpelung Berlin",
    "Transport Berlin",
    "Reinigung Berlin",
  ],
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
    languages: {
      de: "/",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SEEL Transport",
  },
  openGraph: {
    title: "Umzug Berlin | SEEL Transport & Reinigung",
    description: "Umzug, Transport, Reinigung und Entrümpelung aus einer Hand.",
    url: BASE_URL,
    siteName: "SEEL Transport & Reinigung",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "SEEL Transport & Reinigung" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umzug Berlin | SEEL Transport & Reinigung",
    description: "Professionelle Umzüge, Reinigung und Entrümpelung in Berlin und Brandenburg.",
    images: ["/og-image.jpg"],
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
    logo: `${siteContent.contact.websiteUrl}/images/logo-new.png`,
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
      opens: "07:00",
      closes: "20:00",
    },
    priceRange: "EUR",
  };

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="de" href={`${BASE_URL}/`} />
        <meta name="mobile-web-app-capable" content="yes" />
        <Script id="local-business-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(localBusinessSchema)}
        </Script>
      </head>
      <body
        className={`antialiased ${displayFont.variable} ${interFont.variable} ${uiFont.variable} ${isAdmin ? "admin-site" : "public-site"}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteContentProvider value={siteContent}>
            {!isAdmin && <div className="site-aurora" />}
            {!isAdmin && <div className="site-grid-overlay" />}
            {!isAdmin && <div className="site-noise" />}
            {!isAdmin && <div className="site-spotlight" />}
            {!isAdmin && <div className="site-beam site-beam-1" />}
            {!isAdmin && <div className="site-beam site-beam-2" />}
            {!isAdmin && <div className="bg-blob-1" />}
            {!isAdmin && <div className="bg-blob-2" />}
            {!isAdmin && <div className="bg-blob-3" />}
            {!isAdmin && <Navbar />}
            <main className="relative z-10 min-h-screen page-shell">{children}</main>
            {!isAdmin && <Footer />}
            {!isAdmin && <WhatsAppButton />}
            {!isAdmin && <CookieBanner />}
          </SiteContentProvider>

          {!isAdmin && (
            <>
              <Script id="scroll-reveal" strategy="afterInteractive">{`
                (function() {
                  var io = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                      if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                      }
                    });
                  }, { threshold: 0.14, rootMargin: '0px 0px -48px 0px' });

                  function observeTargets() {
                    document.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger').forEach(function(el) {
                      io.observe(el);
                    });
                  }

                  observeTargets();
                  new MutationObserver(observeTargets).observe(document.body, { childList: true, subtree: true });
                })();
              `}</Script>
              <Script id="ambient-motion" strategy="afterInteractive">{`
                (function() {
                  var root = document.documentElement;
                  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  root.style.setProperty('--pointer-x', window.innerWidth / 2 + 'px');
                  root.style.setProperty('--pointer-y', window.innerHeight * 0.24 + 'px');
                  root.style.setProperty('--pointer-rx', '0');
                  root.style.setProperty('--pointer-ry', '0');
                  root.style.setProperty('--scroll-y', '0px');
                  root.classList.add('ux-ready');

                  var raf = 0;
                  function applyPointer(x, y) {
                    root.style.setProperty('--pointer-x', x + 'px');
                    root.style.setProperty('--pointer-y', y + 'px');
                    root.style.setProperty('--pointer-rx', ((x / window.innerWidth) - 0.5).toFixed(4));
                    root.style.setProperty('--pointer-ry', ((y / window.innerHeight) - 0.5).toFixed(4));
                  }

                  function handleMouseMove(event) {
                    if (reduceMotion) return;
                    if (raf) cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(function() {
                      applyPointer(event.clientX, event.clientY);
                    });
                  }

                  function handleScroll() {
                    root.style.setProperty('--scroll-y', window.scrollY.toFixed(1) + 'px');
                  }

                  window.addEventListener('mousemove', handleMouseMove, { passive: true });
                  window.addEventListener('scroll', handleScroll, { passive: true });
                  window.addEventListener('resize', function() {
                    applyPointer(window.innerWidth / 2, window.innerHeight * 0.24);
                    handleScroll();
                  });
                  handleScroll();
                })();
              `}</Script>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
