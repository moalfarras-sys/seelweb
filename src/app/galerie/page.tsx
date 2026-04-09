import type { Metadata } from "next";
import Image from "next/image";
import Gallery from "@/components/Gallery";
import { buildMetadata } from "@/lib/seo";
import { getPublicGalleryItems, getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Galerie – Echte Einsätze | SEEL Transport & Reinigung",
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
      <section className="hero-led-section kinetic-hero relative overflow-hidden bg-[#06101d] py-28 md:py-36">
        <div className="absolute inset-0 opacity-[0.34]">
          <Image
            src="/images/cleaning-team-government.png"
            alt=""
            fill
            className="image-cinematic object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,20,0.55)_0%,rgba(4,10,20,0.74)_28%,rgba(4,10,20,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,229,186,0.18),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(125,211,252,0.16),transparent_24%)]" />
        <div className="hero-light-sweep opacity-60" />
        <div className="cine-grid absolute inset-0 opacity-40" />

        <div className="hero-copy-flow relative mx-auto max-w-7xl px-4 text-center md:px-8">
          <p className="section-eyebrow text-cyan-200/90">Galerie</p>
          <h1 className="hero-title-strong mt-4 font-display text-4xl font-bold text-white md:text-6xl">
            Echte Einsätze, stärker inszeniert.
          </h1>
          <p className="hero-body mx-auto mt-6 max-w-3xl text-white/82">
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
