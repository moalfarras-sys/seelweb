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
    <section className="bg-white py-20 dark:bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
            Google Bewertungen
          </p>
          <h2 className="mt-4 text-3xl font-bold text-navy-800 dark:text-white md:text-4xl">
            Das sagen unsere Kunden
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(data.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 dark:text-navy-600"
                  }
                />
              ))}
            </div>
            <p className="text-lg font-bold text-navy-800 dark:text-white">
              {data.rating.toFixed(1)}
            </p>
            <p className="text-sm text-silver-500 dark:text-silver-400">
              ({data.totalReviews} Bewertungen)
            </p>
          </div>
        </div>

        {data.reviews.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.reviews.slice(0, 6).map((review, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-6 dark:border-navy-700/50 dark:bg-navy-800/60"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-600 text-sm font-bold text-white">
                    {review.authorName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800 dark:text-white">
                      {review.authorName}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 text-xs text-silver-500">
                        {review.relativeTimeDescription}
                      </span>
                    </div>
                  </div>
                </div>
                {review.text && (
                  <p className="mt-4 text-sm leading-7 text-silver-600 dark:text-silver-300">
                    {review.text.length > 200
                      ? `${review.text.slice(0, 200)}…`
                      : review.text}
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
