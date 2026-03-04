"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  fromLat: number | null;
  fromLon: number | null;
  toLat: number | null;
  toLon: number | null;
  routeGeometry: [number, number][] | null;
}

const TEAL = "#0d9ea0";
const NAVY = "#1a2e50";

function createIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color};transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff;
    "><span style="transform:rotate(45deg);color:#fff;font-size:11px;font-weight:700">${label}</span></div>`,
  });
}

export default function MapInner({
  fromLat,
  fromLon,
  toLat,
  toLon,
  routeGeometry,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([52.52, 13.405], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    L.control.attribution({ position: "bottomright", prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>')
      .addTo(map);

    const layers = L.layerGroup().addTo(map);
    layersRef.current = layers;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.clearLayers();
    const bounds: L.LatLngExpression[] = [];

    if (fromLat != null && fromLon != null) {
      L.marker([fromLat, fromLon], { icon: createIcon(TEAL, "A") })
        .bindPopup("Startadresse")
        .addTo(layers);
      bounds.push([fromLat, fromLon]);
    }

    if (toLat != null && toLon != null) {
      L.marker([toLat, toLon], { icon: createIcon(NAVY, "B") })
        .bindPopup("Zieladresse")
        .addTo(layers);
      bounds.push([toLat, toLon]);
    }

    if (routeGeometry && routeGeometry.length > 1) {
      L.polyline(routeGeometry, {
        color: TEAL,
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
      }).addTo(layers);
    }

    if (bounds.length === 2) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 14 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0] as L.LatLngExpression, 14);
    }
  }, [fromLat, fromLon, toLat, toLon, routeGeometry]);

  return <div ref={containerRef} className="w-full h-full" />;
}
