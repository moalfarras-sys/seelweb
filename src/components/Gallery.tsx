"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

type GalleryProps = {
  images: { src: string; alt: string }[];
  title?: string;
  subtitle?: string;
};

export default function Gallery({ images, title, subtitle }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      setLightboxIndex((prev) => {
        if (prev === null) return null;
        const total = images.length;
        return direction === "next" ? (prev + 1) % total : (prev - 1 + total) % total;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate("next");
      if (e.key === "ArrowLeft") navigate("prev");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, navigate]);

  if (images.length === 0) return null;

  function openLightbox(index: number) {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }

  return (
    <>
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {title && (
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                {subtitle || "Galerie"}
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                {title}
              </h2>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
                  <ZoomIn size={28} className="text-white opacity-0 transition duration-300 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate("next"); }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>

          <div className="lightbox-card relative mx-4 max-h-[85vh] max-w-5xl overflow-hidden p-2" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto rounded-xl object-contain"
              priority
            />
            <p className="mt-2 pb-1 text-center text-sm text-white/50">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
