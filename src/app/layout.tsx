import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, Inter, Outfit } from "next/font/google";
import "./globals.css";

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
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getPublicSiteSettings } from "@/lib/site-content";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2f8" },
    { media: "(prefers-color-scheme: dark)", color: "#050b14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://seeltransport.de"),
  title: "Umzug Berlin | SEEL Transport & Reinigung",
  description:
    "Professionelle Umzüge, Reinigung und Entrümpelung in Berlin und Brandenburg. Transparent, versichert, kurzfristig buchbar. Ab 34 €/Std.",
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
    images: [{ url: "/images/logo.png", width: 512, height: 512, alt: "SEEL Transport Logo" }],
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
    logo: `${siteContent.contact.websiteUrl}/images/logo.png`,
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
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <Script id="local-business-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(localBusinessSchema)}
        </Script>
      </head>
      <body className={`antialiased ${displayFont.variable} ${interFont.variable} ${uiFont.variable} ${isAdmin ? "admin-site" : "public-site"}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
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
              <Script id="sw-register" strategy="afterInteractive">{`
                (async function() {
                  if (!('serviceWorker' in navigator)) return;
                  try {
                    var regs = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(regs.map(function(r) { return r.unregister(); }));
                    if ('caches' in window) {
                      var keys = await caches.keys();
                      await Promise.all(keys.map(function(k) {
                        return /^seel-v|^workbox/i.test(k) ? caches.delete(k) : Promise.resolve(false);
                      }));
                    }
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
