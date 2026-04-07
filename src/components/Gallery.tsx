"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers3, Sparkles, X, ZoomIn } from "lucide-react";
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
  description?: string;
  mode?: "showcase" | "compact";
  entryHref?: string;
};

const categoryLabels: Record<GalleryCategory | "all", string> = {
  all: "Alle Einblicke",
  umzug: "Umzug",
  reinigung: "Reinigung",
  entruempelung: "Entrümpelung",
  gewerbe: "Gewerbe",
  express: "Express",
};

const categoryDescriptions: Record<GalleryCategory | "all", string> = {
  all: "Ein kuratierter Überblick über Einsätze, Abläufe und Objektpflege.",
  umzug: "Private und gewerbliche Transporte mit strukturierter Durchführung.",
  reinigung: "Saubere Übergaben, laufende Pflege und sichtbare Detailarbeit.",
  entruempelung: "Räumungen mit abgestimmter Entsorgung und klaren Zeitfenstern.",
  gewerbe: "Einsätze für Büros, Einrichtungen und betreute Gewerbeflächen.",
  express: "Kurzfristige Einsätze, wenn Tempo und Klarheit gleichzeitig zählen.",
};

export default function Gallery({ images, title, subtitle, description, mode = "showcase", entryHref }: GalleryProps) {
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

  const categories = useMemo(() => {
    const values = Array.from(new Set(normalizedImages.map((image) => image.category)));
    return ["all", ...values] as Array<GalleryCategory | "all">;
  }, [normalizedImages]);

  const visibleImages = useMemo(
    () =>
      activeCategory === "all"
        ? normalizedImages
        : normalizedImages.filter((image) => image.category === activeCategory),
    [activeCategory, normalizedImages],
  );

  const featured = useMemo(
    () => visibleImages.find((image) => image.featured) || visibleImages[0],
    [visibleImages],
  );

  const totalImages = visibleImages.length;
  const totalCollections = Math.max(categories.length - 1, 1);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
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
  }, [closeLightbox, lightboxIndex, navigate]);

  useEffect(() => {
    if (visibleImages.length === 0) {
      setLightboxIndex(null);
    } else if (lightboxIndex !== null && lightboxIndex >= visibleImages.length) {
      setLightboxIndex(0);
    }
  }, [lightboxIndex, visibleImages]);

  if (!normalizedImages.length || !featured) return null;

  if (mode === "compact") {
    return (
      <>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="premium-panel rounded-[28px] p-5 sm:rounded-[32px] sm:p-6 md:p-8">
              <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <div className="max-w-xl">
                  <div className="accent-line" />
                  <p className="section-eyebrow">{subtitle || "Galerie"}</p>
                  <h2 className="headline-prism section-title mt-4">
                    {title || "Unsere Galerie"}
                  </h2>
                  <p className="section-copy mt-5">
                    {description ||
                      "Ausgewählte Eindrücke aus Umzug, Reinigung und Objektbetreuung. Die komplette Galerie öffnen Sie direkt im Viewer."}
                  </p>
                  {entryHref ? (
                    <Link href={entryHref} className="btn-primary-glass mt-7 gap-2">
                      Galerie ansehen <ZoomIn size={16} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openLightbox(0)}
                      className="btn-primary-glass mt-7 gap-2"
                    >
                      Galerie ansehen <ZoomIn size={16} />
                    </button>
                  )}
                </div>

                {entryHref ? (
                  <Link
                    href={entryHref}
                    className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#040a14] text-left text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-all duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.34)] sm:rounded-[30px]"
                  >
                    <div className="relative aspect-[16/11] sm:aspect-[16/10]">
                      <Image
                        src={featured.src}
                        alt={featured.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 48vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.06)_0%,rgba(2,8,18,0.26)_46%,rgba(2,8,18,0.84)_100%)]" />
                      <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-white/[0.16]">
                          <ZoomIn size={16} />
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                        <p className="text-xl font-semibold text-white sm:text-2xl">Galerie ansehen</p>
                        <p className="mt-2 max-w-lg text-sm leading-6 text-white/70 sm:leading-7">
                          Alle Bilder bleiben erhalten und öffnen sich gesammelt in einer vollständigen Galerieansicht.
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#040a14] text-left text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-all duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.34)] sm:rounded-[30px]"
                >
                  <div className="relative aspect-[16/11] sm:aspect-[16/10]">
                    <Image
                      src={featured.src}
                      alt={featured.alt}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 48vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.06)_0%,rgba(2,8,18,0.26)_46%,rgba(2,8,18,0.84)_100%)]" />
                    <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-white/[0.16]">
                        <ZoomIn size={16} />
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <p className="text-xl font-semibold text-white sm:text-2xl">Galerie ansehen</p>
                      <p className="mt-2 max-w-lg text-sm leading-6 text-white/70 sm:leading-7">
                        Alle Bilder bleiben erhalten und öffnen sich gesammelt in einer vollständigen Galerieansicht.
                      </p>
                    </div>
                  </div>
                </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {lightboxIndex !== null && visibleImages[lightboxIndex] && (
          <div className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center" onClick={closeLightbox}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeLightbox();
              }}
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.16] hover:scale-110"
              aria-label="Galerie schlie?en"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigate("prev");
              }}
              className="absolute left-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.16] hover:scale-110 sm:flex"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigate("next");
              }}
              className="absolute right-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.16] hover:scale-110 sm:flex"
              aria-label="N?chstes Bild"
            >
              <ChevronRight size={24} />
            </button>

            <div
              className="lightbox-card relative mx-4 max-h-[90vh] max-w-6xl overflow-hidden p-3"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={visibleImages[lightboxIndex].src}
                alt={visibleImages[lightboxIndex].alt}
                width={1600}
                height={1100}
                unoptimized
                className="max-h-[76vh] w-auto rounded-[24px] object-contain"
                priority
              />
              <div className="px-2 pb-2 pt-4 text-white">
                <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/50">
                  {categoryLabels[visibleImages[lightboxIndex].category]}
                </p>
                <p className="mt-2 text-lg font-semibold">{visibleImages[lightboxIndex].title}</p>
                <p className="mt-1 text-sm text-white/55">{visibleImages[lightboxIndex].alt}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <section className="showcase-shell relative overflow-hidden py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-sky-300/15 blur-[130px] dark:bg-sky-500/8" />
          <div className="absolute right-[8%] top-1/3 h-60 w-60 rounded-full bg-cyan-300/15 blur-[140px] dark:bg-cyan-500/8" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.60)_0%,rgba(241,245,249,0.88)_48%,rgba(248,250,252,0.78)_100%)] dark:bg-[linear-gradient(180deg,rgba(3,8,16,0.96)_0%,rgba(3,8,16,0.98)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 grid gap-6 sm:mb-12 sm:gap-8 lg:mb-14 lg:gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div className="max-w-xl scroll-reveal">
              <div className="accent-line" />
              <p className="section-eyebrow">{subtitle || "Galerie"}</p>
              <h2 className="headline-prism section-title mt-4">
                {title || "Unsere Arbeit in Bildern"}
              </h2>
              <p className="section-copy mt-5">
                {description ||
                  "Eine kuratierte Auswahl realer Einsätze mit Fokus auf Sorgfalt, Organisation und sichtbar gepflegte Ergebnisse."}
              </p>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-3 scroll-reveal">
              <div className="premium-panel rounded-[28px] p-5 md:col-span-1">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                  <Layers3 size={18} className="text-sky-700 dark:text-cyan-300" />
                  <p className="text-sm font-semibold">Cinematic Grid</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/55">
                  Eine filmische Wand aus echten Einsätzen statt einer statischen Standardgalerie.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/[0.08] bg-[#040a14] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.30)]">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-cyan-300/80" />
                  <p className="text-sm font-semibold">Cinematic Viewer</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  Großzügige Bildflächen, ruhige Kontraste und ein dunkler Viewer erzeugen Portfolio-Gefühl statt Standardraster.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/70 bg-white/75 p-5 text-slate-900 shadow-[0_22px_60px_rgba(15,23,42,0.08)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Archiv</p>
                <div className="mt-4 flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-semibold">{totalImages}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-white/55">Bilder aktuell sichtbar</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200 dark:bg-white/10" />
                  <div>
                    <p className="text-3xl font-semibold">{totalCollections}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-white/55">Leistungswelten</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 scroll-reveal sm:mb-8">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300 sm:px-4 sm:py-2.5 sm:text-sm ${
                  activeCategory === category
                    ? "bg-[#040a14] text-white shadow-[0_14px_36px_rgba(0,0,0,0.14)] dark:bg-white dark:text-slate-950"
                    : "border border-slate-200/70 bg-white/80 text-slate-700 hover:border-sky-300 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/65 dark:hover:bg-white/[0.08]"
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="gallery-floating-panel">
                <p className="text-[11px] uppercase tracking-[0.32em] text-sky-700 dark:text-cyan-300">Cinematic Collection</p>
                <h3 className="section-title mt-4 text-2xl md:text-3xl">
                  Einheitliche Bildkarten mit stärkerem Fokus auf Eleganz, Rhythmus und Klarheit.
                </h3>
                <p className="section-copy mt-4 text-sm md:text-base">
                  Alle Bilder erscheinen jetzt in derselben Größe. Das Ergebnis wirkt ruhiger, hochwertiger und näher an einem kuratierten Marken-Portfolio als an einer technischen Standardgalerie.
                </p>
              </div>
              <div className="rounded-[30px] border border-white/[0.08] bg-[#06111d] p-6 text-white shadow-[0_28px_90px_rgba(2,8,18,0.30)]">
                <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/65">Aktive Auswahl</p>
                <p className="mt-4 text-3xl font-semibold">{categoryLabels[activeCategory]}</p>
                <p className="mt-3 text-sm leading-7 text-white/68">{categoryDescriptions[activeCategory]}</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.06] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Frames</p>
                    <p className="mt-2 text-2xl font-semibold">{totalImages}</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.06] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Collections</p>
                    <p className="mt-2 text-2xl font-semibold">{totalCollections}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-showcase-grid">
              {visibleImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="group gallery-uniform-card"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index < 6}
                    loading={index < 6 ? "eager" : "lazy"}
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="image-cinematic object-cover"
                  />
                  <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(2,8,18,0.02)_0%,rgba(2,8,18,0.18)_54%,rgba(2,8,18,0.9)_100%)] transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute right-3 top-3 z-[2] sm:right-4 sm:top-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white/90 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100">
                      <ZoomIn size={15} />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-[2] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                      {categoryLabels[image.category]}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-white">{image.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && visibleImages[lightboxIndex] && (
        <div className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center" onClick={closeLightbox}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.16] hover:scale-110"
            aria-label="Galerie schließen"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate("prev");
            }}
            className="absolute left-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.16] hover:scale-110 sm:flex"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate("next");
            }}
            className="absolute right-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.16] hover:scale-110 sm:flex"
            aria-label="Nächstes Bild"
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="lightbox-card relative mx-4 max-h-[90vh] max-w-6xl overflow-hidden p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={visibleImages[lightboxIndex].src}
              alt={visibleImages[lightboxIndex].alt}
              width={1600}
              height={1100}
              unoptimized
              className="max-h-[76vh] w-auto rounded-[24px] object-contain"
              priority
            />
            <div className="px-2 pb-2 pt-4 text-white">
              <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/50">
                {categoryLabels[visibleImages[lightboxIndex].category]}
              </p>
              <p className="mt-2 text-lg font-semibold">{visibleImages[lightboxIndex].title}</p>
              <p className="mt-1 text-sm text-white/55">{visibleImages[lightboxIndex].alt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
