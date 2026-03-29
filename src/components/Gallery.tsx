"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { GalleryCategory } from "@/types/site-content";

type GalleryImage = {
  id?: string;
  src: string;
  alt: string;
  title?: string;
  category?: GalleryCategory;
  featured?: boolean;
};

type GalleryProps = {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
};

const categoryLabels: Record<GalleryCategory | "all", string> = {
  all: "Alle",
  umzug: "Umzug",
  reinigung: "Reinigung",
  entruempelung: "Entrümpelung",
  gewerbe: "Gewerbe",
  express: "Express",
};

export default function Gallery({ images, title, subtitle }: GalleryProps) {
  const normalizedImages = useMemo(
    () =>
      images.map((image, index) => ({
        ...image,
        id: image.id || image.src || String(index),
        title: image.title || image.alt,
        category: image.category || "reinigung",
      })),
    [images],
  );
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleImages = useMemo(
    () =>
      activeCategory === "all"
        ? normalizedImages
        : normalizedImages.filter((image) => image.category === activeCategory),
    [activeCategory, normalizedImages],
  );

  const categories = useMemo(() => {
    const values = Array.from(new Set(normalizedImages.map((image) => image.category)));
    return ["all", ...values] as Array<GalleryCategory | "all">;
  }, [normalizedImages]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      setLightboxIndex((previousIndex) => {
        if (previousIndex === null) return null;
        const total = visibleImages.length;
        return direction === "next"
          ? (previousIndex + 1) % total
          : (previousIndex - 1 + total) % total;
      });
    },
    [visibleImages.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") navigate("next");
      if (event.key === "ArrowLeft") navigate("prev");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, navigate]);

  useEffect(() => {
    if (visibleImages.length === 0) {
      setLightboxIndex(null);
    } else if (lightboxIndex !== null && lightboxIndex >= visibleImages.length) {
      setLightboxIndex(0);
    }
  }, [visibleImages, lightboxIndex]);

  if (normalizedImages.length === 0) return null;

  function openLightbox(index: number) {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }

  const featured = visibleImages.find((image) => image.featured) || visibleImages[0];

  return (
    <>
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {title && (
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-teal-300">
                  {subtitle || "Galerie"}
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                  {title}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-white/60">
                  Ein kuratierter Einblick in reale Einsätze von SEEL Transport & Reinigung.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeCategory === category
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                    }`}
                  >
                    {categoryLabels[category]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <button
              type="button"
              onClick={() => openLightbox(visibleImages.indexOf(featured))}
              className="group relative min-h-[320px] overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100 text-left dark:border-white/10 dark:bg-white/5"
            >
              <Image
                src={featured.src}
                alt={featured.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">{categoryLabels[featured.category]}</p>
                  <p className="mt-2 text-xl font-semibold">{featured.title}</p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                  <ZoomIn size={18} />
                </span>
              </div>
            </button>

            <div className="grid gap-4 sm:grid-cols-2">
              {visibleImages
                .filter((image) => image.id !== featured.id)
                .map((image, index) => {
                  const targetIndex = visibleImages.findIndex((entry) => entry.id === image.id);
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => openLightbox(targetIndex)}
                      className={`group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 text-left dark:border-white/10 dark:bg-white/5 ${
                        index === 0 ? "sm:col-span-2 sm:aspect-[2.1/1]" : "aspect-[4/4.2]"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-sm font-semibold">{image.title}</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && visibleImages[lightboxIndex] && (
        <div className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center" onClick={closeLightbox}>
          <button
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              navigate("prev");
            }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              navigate("next");
            }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>

          <div className="lightbox-card relative mx-4 max-h-[85vh] max-w-6xl overflow-hidden p-3" onClick={(event) => event.stopPropagation()}>
            <Image
              src={visibleImages[lightboxIndex].src}
              alt={visibleImages[lightboxIndex].alt}
              width={1400}
              height={1000}
              className="max-h-[78vh] w-auto rounded-2xl object-contain"
              priority
            />
            <div className="px-2 pb-2 pt-4 text-white">
              <p className="text-lg font-semibold">{visibleImages[lightboxIndex].title}</p>
              <p className="mt-1 text-sm text-white/60">{visibleImages[lightboxIndex].alt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
