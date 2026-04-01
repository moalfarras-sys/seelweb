import { Star } from "lucide-react";
import type { GoogleReviewsData } from "@/lib/google-reviews";

type GoogleReviewsProps = {
  data: GoogleReviewsData;
};

export default function GoogleReviews({ data }: GoogleReviewsProps) {
  if (!data || data.totalReviews === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="scroll-reveal">
            <div className="accent-line" />
            <p className="section-eyebrow">Google Bewertungen</p>
            <h2 className="font-display mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">
              Das sagen unsere Kunden
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 dark:text-white/55">
              Sichtbares Vertrauen entsteht durch wiederkehrend gute Rückmeldungen, nicht durch beliebige Siegel.
            </p>
          </div>

          <div className="premium-panel rounded-[30px] p-6 scroll-reveal">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(data.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-white/15"}
                  />
                ))}
              </div>
              <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">{data.rating.toFixed(1)}</p>
              <p className="text-sm text-slate-500 dark:text-white/45">({data.totalReviews} Bewertungen)</p>
            </div>
          </div>
        </div>

        {data.reviews.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.reviews.slice(0, 6).map((review, index) => (
              <div
                key={`${review.authorName}-${index}`}
                className="premium-panel card-interactive rounded-[30px] p-6 scroll-reveal"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)]" style={{ background: "var(--accent-gradient)" }}>
                    {review.authorName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{review.authorName}</p>
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-white/15"}
                        />
                      ))}
                      <span className="ml-2 text-xs text-slate-500 dark:text-white/35">{review.relativeTimeDescription}</span>
                    </div>
                  </div>
                </div>
                {review.text && (
                  <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-white/55">
                    {review.text.length > 220 ? `${review.text.slice(0, 220)}…` : review.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
