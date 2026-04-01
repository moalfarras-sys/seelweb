import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { buildMetadata } from "@/lib/seo";
import { getPublicGalleryItems, getPublicSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata({
  title: "Galerie | SEEL Transport Berlin",
  description: "Einblicke in Umzug, Reinigung und Entrümpelung von SEEL Transport & Reinigung in Berlin.",
  path: "/galerie",
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
    <main className="pt-8">
      <Gallery
        images={images}
        title={settings.homepage.galleryTitle}
        subtitle={settings.homepage.galleryEyebrow}
        description={settings.homepage.galleryDescription}
      />
    </main>
  );
}
