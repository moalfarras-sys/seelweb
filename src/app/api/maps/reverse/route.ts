import { NextRequest, NextResponse } from "next/server";
import { ProviderRequestError, reverseGeocode } from "@/lib/maps/mapService";

const JSON_UTF8_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
};

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();
  const latRaw = req.nextUrl.searchParams.get("lat");
  const lonRaw = req.nextUrl.searchParams.get("lon");

  const lat = Number(latRaw);
  const lon = Number(lonRaw);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Ungültige Koordinaten",
        requestId,
      },
      { status: 400, headers: JSON_UTF8_HEADERS }
    );
  }

  try {
    const result = await reverseGeocode(lat, lon);
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          code: "NO_RESULT",
          error: "Keine Adresse gefunden",
          requestId,
        },
        { status: 404, headers: JSON_UTF8_HEADERS }
      );
    }

    return NextResponse.json(result, {
      headers: {
        ...JSON_UTF8_HEADERS,
        "x-request-id": requestId,
      },
    });
  } catch (error) {
    if (error instanceof ProviderRequestError) {
      console.error(`[maps:reverse:${requestId}] provider_error`, {
        status: error.status,
        provider: error.provider,
        code: error.code,
      });
      return NextResponse.json(
        {
          success: false,
          code: error.code,
          error: "Adressauflösung derzeit nicht verfügbar",
          requestId,
        },
        { status: error.status, headers: JSON_UTF8_HEADERS }
      );
    }

    console.error(`[maps:reverse:${requestId}] unhandled_error`, error);
    return NextResponse.json(
      {
        success: false,
        code: "REVERSE_GEOCODE_FAILED",
        error: "Reverse Geocoding fehlgeschlagen",
        requestId,
      },
      { status: 500, headers: JSON_UTF8_HEADERS }
    );
  }
}

