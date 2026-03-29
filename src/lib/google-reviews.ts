const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || "";
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export type GoogleReview = {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  time: number;
};

export type GoogleReviewsData = {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
  fetchedAt: string;
} | null;

let cachedReviews: GoogleReviewsData = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function fetchGoogleReviews(): Promise<GoogleReviewsData> {
  if (!GOOGLE_PLACE_ID || !GOOGLE_API_KEY) {
    return null;
  }

  const now = Date.now();
  if (cachedReviews && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedReviews;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=rating,user_ratings_total,reviews&language=de&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 21600 } });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== "OK" || !data.result) return null;

    const result = data.result;

    cachedReviews = {
      rating: result.rating ?? 0,
      totalReviews: result.user_ratings_total ?? 0,
      reviews: (result.reviews ?? []).map((r: Record<string, unknown>) => ({
        authorName: r.author_name as string,
        rating: r.rating as number,
        text: r.text as string,
        relativeTimeDescription: r.relative_time_description as string,
        time: r.time as number,
      })),
      fetchedAt: new Date().toISOString(),
    };

    lastFetchTime = now;
    return cachedReviews;
  } catch {
    return null;
  }
}

export function invalidateReviewsCache() {
  cachedReviews = null;
  lastFetchTime = 0;
}
