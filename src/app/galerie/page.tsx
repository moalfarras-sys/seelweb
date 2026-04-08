import type { Metadata } from "next";
import Image from "next/image";
import Gallery from "@/components/Gallery";
import { buildMetadata } from "@/lib/seo";
import { getPublicGalleryItems, getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Galerie – Echte Einsätze | SEEL Transport & Reinigung Berlin",
  description:
    "Bildergalerie mit echten Einsätzen aus Umzug, Reinigung, Entrümpelung und Gebäudepflege in Berlin und Brandenburg von SEEL Transport & Reinigung.",
  path: "/galerie",
  keywords: [
    "galerie umzug berlin",
    "reinigung bilder",
    "entrümpelung fotos",
    "umzugsfirma berlin bilder",
    "seel transport galerie",
  ],
});

export default async function GaleriePublicPage() {
  const [settings, items] = await Promise.all([getPublicSiteSettings(), getPublicGalleryItems()]);

  const images = items.map((item) => ({
    id: item.id,
    src: item.imageUrl,
    alt: item.alt,
    title: item.title,
    category: item.category,
    featured: item.isFeatured,
  }));

  return (
    <>
      <section className="hero-led-section kinetic-hero gradient-navy relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 opacity-[0.12]">
          <Image
            src="/images/cleaning-team-government.png"
            alt=""
            fill
            className="image-cinematic object-cover object-center"
          />
        </div>
        <div className="hero-light-sweep" />
        <div className="cine-grid absolute inset-0 opacity-35" />
        <div className="hero-copy-flow relative mx-auto max-w-7xl px-4 text-center md:px-8">
          <p className="section-eyebrow text-cyan-200/80">Galerie</p>
          <h1 className="headline-prism hero-title-strong font-display mt-4 text-4xl font-bold md:text-6xl">
            Echte Einsätze, echte Ergebnisse
          </h1>
          <p className="hero-body mx-auto mt-6 max-w-2xl text-white/80 dark:text-white/80">
            {settings.homepage.galleryDescription ||
              "Keine Stockfotos – alle Bilder zeigen reale Einsätze aus Umzug, Reinigung und Objektbetreuung in Berlin und Brandenburg."}
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">{images.length} Bilder</span>
            <span className="hero-metric">Echte Einsätze</span>
            <span className="hero-metric">Mehrere Kategorien</span>
          </div>
        </div>
      </section>

      <Gallery
        images={images}
        title={settings.homepage.galleryTitle}
        subtitle={settings.homepage.galleryEyebrow}
        description={settings.homepage.galleryDescription}
      />
    </>
  );
}
