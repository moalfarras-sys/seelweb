"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin, X } from "lucide-react";
import type { AddressResult } from "./AddressAutocomplete";

const MapPickerInner = dynamic(() => import("./AddressMapPickerInner"), {
  ssr: false,
});

type LatLng = { lat: number; lon: number };

interface Props {
  open: boolean;
  title: string;
  initialAddress: AddressResult | null;
  onClose: () => void;
  onSelect: (address: AddressResult) => void;
};

const DEFAULT_GERMANY_CENTER: LatLng = { lat: 51.1657, lon: 10.4515 };
const hasValidCoords = (value: AddressResult | null) =>
  Boolean(value && Math.abs(value.lat) > 0.0001 && Math.abs(value.lon) > 0.0001);

export default function AddressMapPickerModal({
  open,
  title,
  initialAddress,
  onClose,
  onSelect,
}: Props) {
  const [position, setPosition] = useState<LatLng>(DEFAULT_GERMANY_CENTER);
  const [resolved, setResolved] = useState<AddressResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const start = hasValidCoords(initialAddress)
      ? { lat: initialAddress!.lat, lon: initialAddress!.lon }
      : DEFAULT_GERMANY_CENTER;
    setPosition(start);
    setResolved(initialAddress);
    setError(null);
  }, [initialAddress, open]);

  useEffect(() => {
    if (!open) return;

    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/maps/reverse?lat=${position.lat}&lon=${position.lon}`
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setResolved(null);
          setError(data.error || "Adresse konnte nicht aufgelöst werden.");
          return;
        };

const data: AddressResult = await res.json();
        setResolved(data);
      } catch {
        setResolved(null);
        setError("Adresse konnte nicht aufgelöst werden.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [open, position.lat, position.lon]);

  const addressText = useMemo(() => {
    if (!resolved) return "";
    const short = [resolved.street, resolved.houseNumber, resolved.zip, resolved.city]
      .filter(Boolean)
      .join(", ");
    return short || resolved.displayName;
  }, [resolved]);

  const handlePositionChange = useCallback((next: LatLng) => {
    setPosition(next);
  }, []);

  const handleSelect = () => {
    if (!resolved) return;
    onSelect({
      ...resolved,
      lat: position.lat,
      lon: position.lon,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-navy-800">{title}</h3>
            <p className="text-xs text-silver-500">Pin verschieben oder auf die Karte klicken</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-silver-500 hover:text-navy-700 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <MapPickerInner position={position} onPositionChange={handlePositionChange} />

        <div className="px-5 py-4 border-t border-gray-200 space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={15} className="text-teal-600 mt-0.5" />
            <div className="min-h-[20px]">
              {loading && (
                <span className="inline-flex items-center gap-1 text-silver-500">
                  <Loader2 size={14} className="animate-spin" /> Adresse wird ermittelt...
                </span>
              )}
              {!loading && resolved && <span className="text-navy-700">{addressText}</span>}
              {!loading && !resolved && (
                <span className="text-amber-700">{error || "Keine Adresse gefunden"}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-navy-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleSelect}
              disabled={!resolved || loading}
              className="px-4 py-2 rounded-lg text-sm bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40"
            >
              Adresse übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
