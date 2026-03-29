"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryProps = {
  images: { src: string; alt: string }[];
  title?: string;
  subtitle?: string;
};

export default function Gallery({ images, title, subtitle }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <section className="bg-gray-50 py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <p className="text-sm text-silver-500 dark:text-silver-400">
            Galerie wird in Kürze aktualisiert.
          </p>
        </div>
      </section>
    );
  }

  function openLightbox(index: number) {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }

  function navigate(direction: "prev" | "next") {
    if (lightboxIndex === null) return;
    const total = images.length;
    setLightboxIndex(
      direction === "next"
        ? (lightboxIndex + 1) % total
        : (lightboxIndex - 1 + total) % total
    );
  }

  return (
    <>
      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {title && (
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
                {subtitle || "Galerie"}
              </p>
              <h2 className="mt-4 text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">
                {title}
              </h2>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-100 dark:border-navy-700/50"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("prev");
            }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("next");
            }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="relative mx-4 max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
              priority
            />
            <p className="mt-3 text-center text-sm text-white/70">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
