"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = { lat: number; lon: number };

interface Props {
  position: LatLng;
  onPositionChange: (next: LatLng) => void;
}

function createPickerIcon() {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="width:28px;height:28px;border-radius:999px;background:#0d9ea0;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25)"></div>`,
  });
}

export default function AddressMapPickerInner({ position, onPositionChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const callbackRef = useRef(onPositionChange);
  const initialPosition = useRef(position);

  useEffect(() => {
    callbackRef.current = onPositionChange;
  }, [onPositionChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([initialPosition.current.lat, initialPosition.current.lon], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    L.control.attribution({ position: "bottomright", prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>')
      .addTo(map);

    const marker = L.marker([initialPosition.current.lat, initialPosition.current.lon], {
      draggable: true,
      icon: createPickerIcon(),
    }).addTo(map);

    marker.on("dragend", () => {
      const latLng = marker.getLatLng();
      callbackRef.current({ lat: latLng.lat, lon: latLng.lng });
    });

    map.on("click", (event) => {
      marker.setLatLng(event.latlng);
      callbackRef.current({ lat: event.latlng.lat, lon: event.latlng.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []); // Run on mount only to prevent re-creation loops

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const target = L.latLng(position.lat, position.lon);

    // Don't pan if we are already very close (e.g. dragging)
    const current = markerRef.current.getLatLng();
    if (Math.abs(current.lat - target.lat) < 0.0001 && Math.abs(current.lng - target.lng) < 0.0001) {
      return;
    }

    markerRef.current.setLatLng(target);
    mapRef.current.panTo(target, { animate: true });
  }, [position.lat, position.lon]);

  return <div ref={containerRef} className="h-[320px] w-full" />;
}
