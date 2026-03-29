import { NextResponse } from "next/server";
import { getPrices } from "@/lib/getPrices";

export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await getPrices();
  return NextResponse.json(prices);
}
