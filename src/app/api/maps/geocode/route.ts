import { NextRequest, NextResponse } from "next/server";
import { ProviderRequestError, geocodeAddress } from "@/lib/maps/mapService";

const JSON_UTF8_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
};

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 3) {
    return NextResponse.json(
      { suggestions: [], searchStage: "germany" },
      { headers: JSON_UTF8_HEADERS }
    );
  }

  try {
    const result = await geocodeAddress(q);
    return NextResponse.json(
      {
        suggestions: result.suggestions,
        searchStage: result.searchStage,
      },
      {
        headers: {
          ...JSON_UTF8_HEADERS,
          "x-request-id": requestId,
        },
      }
    );
  } catch (error) {
    if (error instanceof ProviderRequestError) {
      console.error(`[maps:geocode:${requestId}] provider_error`, {
        status: error.status,
        provider: error.provider,
        code: error.code,
        query: q,
      });
      return NextResponse.json(
        {
          success: false,
          code: error.code,
          error: "Adresssuche derzeit nicht verfügbar",
          requestId,
        },
        {
          status: error.status,
          headers: JSON_UTF8_HEADERS,
        }
      );
    }

    console.error(`[maps:geocode:${requestId}] unhandled_error`, error);
    return NextResponse.json(
      {
        success: false,
        code: "GEOCODE_FAILED",
        error: "Geocoding fehlgeschlagen",
        requestId,
      },
      { status: 500, headers: JSON_UTF8_HEADERS }
    );
  }
}
