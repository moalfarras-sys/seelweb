"use client";

import { useEffect, useState, useRef } from "react";
import { Navigation, Clock, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

interface RouteInfo {
  distanceKm: number;
  durationMin: number;
  geometry: [number, number][];
}

interface Props {
  fromLat: number | null;
  fromLon: number | null;
  toLat: number | null;
  toLon: number | null;
  onRouteCalculated: (distance: number, duration: number) => void;
};

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

export default function RouteMap({
  fromLat,
  fromLon,
  toLat,
  toLon,
  onRouteCalculated,
}: Props) {
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const prevKey = useRef("");

  useEffect(() => {
    if (!fromLat || !fromLon || !toLat || !toLon) {
      setRoute(null);
      return;
    }

    const key = `${fromLat},${fromLon}->${toLat},${toLon}`;
    if (key === prevKey.current) return;
    prevKey.current = key;

    setLoading(true);
    setError("");

    fetch("/api/maps/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromLat, fromLon, toLat, toLon }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Route failed");
        return res.json();
      }).then((data: RouteInfo) => {
        setRoute(data);
        onRouteCalculated(data.distanceKm, data.durationMin);
      })
      .catch(() => {
        setError("Route konnte nicht berechnet werden");
        setRoute(null);
      })
      .finally(() => setLoading(false));
  }, [fromLat, fromLon, toLat, toLon, onRouteCalculated]);

  const hasFrom = fromLat != null && fromLon != null;
  const hasTo = toLat != null && toLon != null;
  const showMap = hasFrom || hasTo;

  if (!showMap) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
      <div className="h-[220px] md:h-[280px] relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-teal-600">
              <Navigation size={16} className="animate-pulse" />
              Route wird berechnet...
            </div>
          </div>
        )}
        <MapInner
          fromLat={fromLat}
          fromLon={fromLon}
          toLat={toLat}
          toLon={toLon}
          routeGeometry={route?.geometry ?? null}
        />
      </div>

      {error && (
        <div className="px-4 py-2 text-xs text-amber-700 bg-amber-50 border-t border-amber-100">
          {error}
        </div>
      )}

      {route && (
        <div className="flex items-center gap-6 px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-teal-500" />
            <span className="font-semibold text-navy-800">
              {route.distanceKm} km
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-teal-500" />
            <span className="text-navy-700">
              ca. {route.durationMin} Min.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
