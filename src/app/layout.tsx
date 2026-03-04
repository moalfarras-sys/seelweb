import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060e1f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://seeltransport.de"),
  title: "Seel Transport â€“ UmzÃ¼ge, Reinigung & Dienstleistungen in Berlin",
  description:
    "Professionelle UmzÃ¼ge, MÃ¶beltransporte, Reinigungsdienste und EntrÃ¼mpelung in Berlin. Jetzt online buchen â€“ zuverlÃ¤ssig, schnell und mit hÃ¶chster Sorgfalt.",
  keywords: [
    "Umzug Berlin",
    "MÃ¶beltransport",
    "Reinigungsservice Berlin",
    "EntrÃ¼mpelung",
    "BÃ¼roumzug",
    "Schulumzug",
    "Transport Berlin",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SEEL Transport",
  },
  openGraph: {
    title: "Seel Transport â€“ UmzÃ¼ge & Reinigung in Berlin",
    description: "Professionelle UmzÃ¼ge, Transporte und Reinigungsdienste â€“ alles aus einer Hand.",
    url: "https://seeltransport.de",
    siteName: "Seel Transport",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/images/logo.jpeg", width: 512, height: 512, alt: "Seel Transport Logo" }],
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

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/images/logo.jpeg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isAdmin && <Navbar />}
          <main className="min-h-screen">{children}</main>
          {!isAdmin && <Footer />}
          {!isAdmin && <WhatsAppButton />}
          {!isAdmin && <CookieBanner />}
        </ThemeProvider>
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
                  await navigator.serviceWorker.register('/sw.js');
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
      </body>
    </html>
  );
}

