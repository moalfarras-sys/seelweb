import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  fetchGoogleReviews,
  invalidateReviewsCache,
} from "@/lib/google-reviews";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const data = await fetchGoogleReviews();
  return NextResponse.json(data);
}

export async function POST() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  invalidateReviewsCache();
  const data = await fetchGoogleReviews();
  return NextResponse.json(data);
}
