import { NextRequest, NextResponse } from "next/server";
import {
  calculateRoute,
  routeCacheKey,
} from "@/lib/maps/mapService";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { fromLat, fromLon, toLat, toLon } = await req.json();

    if (!fromLat || !fromLon || !toLat || !toLon) {
      return NextResponse.json(
        { error: "fromLat, fromLon, toLat, toLon sind Pflichtfelder" },
        { status: 400 }
      );
    }

    const key = routeCacheKey(fromLat, fromLon, toLat, toLon);

    // Check cache first
    try {
      const cached = await prisma.routeCache.findUnique({
        where: { cacheKey: key },
      });

      if (cached) {
        return NextResponse.json({
          distanceKm: cached.distanceKm,
          durationMin: cached.durationMin,
          geometry: cached.geometryJson ?? [],
          cached: true,
        });
      }
    } catch {
      // DB unavailable — proceed without cache
    }

    const result = await calculateRoute(fromLon, fromLat, toLon, toLat);
    if (!result) {
      return NextResponse.json(
        { error: "Routenberechnung fehlgeschlagen" },
        { status: 502 }
      );
    }

    // Save to cache (fire-and-forget)
    prisma.routeCache
      .create({
        data: {
          cacheKey: key,
          fromLat,
          fromLon,
          toLat,
          toLon,
          distanceKm: result.distanceKm,
          durationMin: result.durationMin,
          geometryJson: JSON.parse(JSON.stringify(result.geometry)),
        },
      })
      .catch(() => {});

    return NextResponse.json({
      distanceKm: result.distanceKm,
      durationMin: result.durationMin,
      geometry: result.geometry,
      cached: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Interner Fehler bei der Routenberechnung" },
      { status: 500 }
    );
  }
}
