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
      <section className="relative px-4 pb-8 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="page-hero-shell">
            <div className="page-hero-grid">
              <div className="hero-copy-flow max-w-3xl">
                <p className="page-kicker">Galerie</p>
                <h1 className="page-title max-w-[10ch]">Echte Einsätze mit klarer Bildsprache.</h1>
                <p className="page-copy">
                  {settings.homepage.galleryDescription ||
                    "Keine Stockfotos – alle Bilder zeigen reale Einsätze aus Umzug, Reinigung und Objektbetreuung in Berlin und Brandenburg."}
                </p>
                <div className="page-chip-row">
                  <span className="page-chip">{images.length} Bilder</span>
                  <span className="page-chip">Echte Einsätze</span>
                  <span className="page-chip">Mehrere Kategorien</span>
                </div>
              </div>

              <div className="page-info-card p-4 sm:p-5">
                <div className="relative min-h-[250px] overflow-hidden rounded-[26px]">
                  <Image
                    src="/images/cleaning-team-government.png"
                    alt="SEEL Galerie mit echten Einsätzen aus Umzug und Reinigung"
                    fill
                    priority
                    className="image-cinematic object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,22,0.08)_0%,rgba(5,12,22,0.24)_44%,rgba(5,12,22,0.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="page-kicker">Portfolio</p>
                    <p className="mt-3 text-2xl font-semibold leading-tight sm:text-[2rem]">
                      Reale Arbeiten, filmisch und ruhig präsentiert.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Archiv", value: `${images.length}+` },
                    { label: "Fokus", value: "Echt" },
                    { label: "Stil", value: "Cinematic" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/7 p-4 text-white">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/46">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
