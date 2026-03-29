"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

export default function Gallery({ images, title, subtitle, description }: GalleryProps) {
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

  const sideImages = visibleImages.filter((image) => image.id !== featured?.id).slice(0, 5);
  const railImages = visibleImages.filter((image) => image.id !== featured?.id).slice(5, 9);

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

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(248,250,252,0.74)_0%,rgba(255,255,255,1)_28%,rgba(248,250,252,0.9)_100%)] py-24 dark:bg-[linear-gradient(180deg,rgba(6,13,23,0.96)_0%,rgba(8,17,29,1)_100%)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[8%] top-20 h-48 w-48 rounded-full bg-emerald-200/45 blur-[110px] dark:bg-teal-500/10" />
          <div className="absolute right-[6%] top-1/3 h-52 w-52 rounded-full bg-slate-300/45 blur-[110px] dark:bg-sky-500/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700 dark:text-teal-300">
                {subtitle || "Galerie"}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                {title || "Unsere Arbeit in Bildern"}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-white/62">
                {description ||
                  "Eine kuratierte Auswahl realer Einsätze mit Fokus auf Sorgfalt, Organisation und sichtbar gepflegte Ergebnisse."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <Layers3 size={18} className="text-emerald-700 dark:text-teal-300" />
                    <p className="text-sm font-semibold">Kuratiert statt angehängt</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/60">
                    Jede Aufnahme wird thematisch eingeordnet und bewusst in die Präsentation eingebettet.
                  </p>
                </div>
                <div className="rounded-[28px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-teal-300" />
                    <p className="text-sm font-semibold">Visuelle Qualitätskontrolle</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    Filter, ruhige Typografie und großzügige Bildflächen sorgen für einen hochwertigen Gesamteindruck.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    activeCategory === category
                      ? "bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)] dark:bg-white dark:text-slate-900"
                      : "border border-slate-200 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <button
              type="button"
              onClick={() => openLightbox(visibleImages.findIndex((image) => image.id === featured.id))}
              className="group relative min-h-[420px] overflow-hidden rounded-[34px] border border-slate-200/80 bg-slate-100 text-left shadow-[0_25px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5"
            >
              <Image
                src={featured.src}
                alt={featured.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.18)_36%,rgba(15,23,42,0.74)_100%)]" />
              <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
                <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-white/88 backdrop-blur">
                  {categoryLabels[featured.category]}
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition group-hover:bg-white/20">
                  <ZoomIn size={18} />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="max-w-xl rounded-[28px] border border-white/10 bg-black/22 p-5 text-white backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/65">
                    {activeCategory === "all" ? "SEEL Einblicke" : categoryLabels[activeCategory]}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold md:text-3xl">{featured.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    {categoryDescriptions[activeCategory]}
                  </p>
                </div>
              </div>
            </button>

            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {sideImages.map((image, index) => {
                  const targetIndex = visibleImages.findIndex((entry) => entry.id === image.id);
                  const isWide = index === 0 || index === 3;
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => openLightbox(targetIndex)}
                      className={`group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-100 text-left shadow-[0_16px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 ${
                        isWide ? "sm:col-span-2 aspect-[1.95/1]" : "aspect-[1/1.1]"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 42vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(15,23,42,0.18)_44%,rgba(15,23,42,0.72)_100%)] opacity-95" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                          {categoryLabels[image.category]}
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6">{image.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!!railImages.length && (
                <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center justify-between gap-4 px-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Weitere Eindrücke</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        Noch mehr Bilder aus demselben Leistungsumfeld
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-white/45">
                      {visibleImages.length} Bilder im aktuellen Filter
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {railImages.map((image) => {
                      const targetIndex = visibleImages.findIndex((entry) => entry.id === image.id);
                      return (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => openLightbox(targetIndex)}
                          className="group relative aspect-[1/0.82] overflow-hidden rounded-[22px] border border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-white/5"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 50vw, 16vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.06]"
                          />
                          <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/16" />
                        </button>
                      );
                    })}
                  </div>
                </div>
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
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
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
            className="absolute left-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:flex"
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
            className="absolute right-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:flex"
            aria-label="Nächstes Bild"
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="lightbox-card relative mx-4 max-h-[88vh] max-w-6xl overflow-hidden rounded-[28px] p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={visibleImages[lightboxIndex].src}
              alt={visibleImages[lightboxIndex].alt}
              width={1600}
              height={1100}
              className="max-h-[76vh] w-auto rounded-[22px] object-contain"
              priority
            />
            <div className="px-2 pb-2 pt-4 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">
                {categoryLabels[visibleImages[lightboxIndex].category]}
              </p>
              <p className="mt-2 text-lg font-semibold">{visibleImages[lightboxIndex].title}</p>
              <p className="mt-1 text-sm text-white/62">{visibleImages[lightboxIndex].alt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
