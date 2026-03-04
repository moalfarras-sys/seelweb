"use client";

import { useState, useRef, useCallback, useEffect, useId, useMemo } from "react";
import { MapPin, Loader2, X, Map, AlertTriangle, Wand2 } from "lucide-react";

export interface AddressResult {
  displayName: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  lat: number;
  lon: number;
  searchStage: "germany";
}

interface Props {
  label: string;
  placeholder: string;
  value: AddressResult | null;
  onChange: (addr: AddressResult | null) => void;
  onOpenMapPicker: () => void;
  mapButtonLabel?: string;
}

const RECENT_ADDRESSES_KEY = "seel_recent_addresses_v1";
const MAX_RECENTS = 6;

function normalizeText(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

function parseManualGermanAddress(input: string): AddressResult | null {
  const raw = normalizeText(input);
  if (!raw || raw.length < 6) return null;

  const zipMatch = raw.match(/\b(\d{5})\b/);
  if (!zipMatch) return null;
  const zip = zipMatch[1];

  const beforeZip = raw.slice(0, zipMatch.index ?? 0).replace(/[,;]+$/, "").trim();
  const afterZip = raw.slice((zipMatch.index ?? 0) + zip.length).replace(/^[,;\s]+/, "").trim();
  if (!beforeZip) return null;

  const houseMatch = beforeZip.match(/^(.*?)[,\s]+(\d+[a-zA-Z0-9/-]*)$/);
  const street = normalizeText(houseMatch?.[1] || beforeZip);
  const houseNumber = normalizeText(houseMatch?.[2] || "");
  const city = normalizeText(afterZip.split(",")[0] || "");

  if (!street) return null;

  return {
    displayName: city ? `${street} ${houseNumber}, ${zip} ${city}`.replace(/\s+/g, " ").trim() : `${street} ${houseNumber}, ${zip}`.replace(/\s+/g, " ").trim(),
    street,
    houseNumber,
    zip,
    city,
    // 0/0 means manual entry without geocoded coordinates.
    lat: 0,
    lon: 0,
    searchStage: "germany",
  };
}

export default function AddressAutocomplete({
  label,
  placeholder = "Straße, Hausnummer, PLZ...",
  value,
  onChange,
  onOpenMapPicker,
  mapButtonLabel = "Auf Karte auswählen",
}: Props) {
  const [query, setQuery] = useState(value?.displayName ?? "");
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<AddressResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (value) {
      const short = [value.street, value.houseNumber, value.zip, value.city]
        .filter(Boolean)
        .join(", ");
      setQuery(short || value.displayName);
    } else {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_ADDRESSES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as AddressResult[];
      if (!Array.isArray(parsed)) return;
      setRecent(parsed.slice(0, MAX_RECENTS));
    } catch {
      setRecent([]);
    }
  }, []);

  const manualCandidate = useMemo(() => parseManualGermanAddress(query), [query]);

  const filteredRecent = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recent;
    return recent.filter((item) => item.displayName.toLowerCase().includes(q));
  }, [query, recent]);

  const persistRecent = useCallback((addr: AddressResult) => {
    try {
      const next = [addr, ...recent.filter((r) => r.displayName !== addr.displayName)].slice(0, MAX_RECENTS);
      setRecent(next);
      localStorage.setItem(RECENT_ADDRESSES_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  }, [recent]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 3) {
      setSuggestions(filteredRecent);
      setOpen(filteredRecent.length > 0);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/maps/geocode?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();
        const items: AddressResult[] = data.suggestions ?? data;
        setSuggestions(items);
        setOpen(items.length > 0);
        setActiveIndex(-1);

        if (items.length === 0) {
          setError("Keine passenden Adressen gefunden.");
        }
        return;
      }

      const data = await res.json().catch(() => null);
      const code = data.code as string | undefined;
      if (code === "PROVIDER_RATE_LIMITED") {
        setError("Zu viele Anfragen. Bitte kurz warten und erneut versuchen.");
      } else if (code === "PROVIDER_UNAUTHORIZED" || code === "PROVIDER_FORBIDDEN") {
        setError("Adressdienst ist nicht korrekt konfiguriert (401/403).");
      } else {
        setError(data.error || "Adresssuche fehlgeschlagen. Bitte Adresse manuell übernehmen.");
      }
      setSuggestions(filteredRecent);
      setOpen(filteredRecent.length > 0);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setSuggestions(filteredRecent);
      setOpen(filteredRecent.length > 0);
      setError("Adresssuche fehlgeschlagen. Bitte Adresse manuell übernehmen.");
    } finally {
      setLoading(false);
    }
  }, [filteredRecent]);

  const handleChange = (val: string) => {
    setQuery(val);
    onChange(null);
    setError(null);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (addr: AddressResult) => {
    onChange(addr);
    persistRecent(addr);
    setOpen(false);
    setSuggestions([]);
    setError(null);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    onChange(null);
    setSuggestions([]);
    setOpen(false);
    setError(null);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
          return;
        }
        if (manualCandidate) {
          handleSelect(manualCandidate);
        }
        break;
      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const suggestionKey = (s: AddressResult, idx: number) =>
    `${s.lat}-${s.lon}-${s.displayName}-${idx}`;

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-navy-800 dark:text-white mb-1.5">
        {label}
      </label>
      <div className="relative">
        <MapPin
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          role="combobox"
          aria-controls={listId}
          aria-expanded={open} aria-autocomplete="list" aria-activedescendant={activeIndex >= 0 ? `address-option-${activeIndex}` : undefined}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
            else if (filteredRecent.length > 0) {
              setSuggestions(filteredRecent);
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:bg-navy-800 dark:text-white dark:placeholder:text-silver-500 ${value
            ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-navy-700 focus:border-teal-500"
            }`}
        />
        {loading && (
          <Loader2
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
          />
        )}
        {!loading && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-silver-500 dark:text-silver-400">
          Adresssuche in Deutschland
        </p>
        {onOpenMapPicker && (
          <button
            type="button"
            onClick={onOpenMapPicker}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
          >
            <Map size={14} />
            {mapButtonLabel}
          </button>
        )}
      </div>

      {manualCandidate && (
        <button
          type="button"
          onClick={() => handleSelect(manualCandidate)}
          className="mt-2 w-full rounded-lg border border-teal-200 bg-teal-50/70 px-3 py-2 text-left text-xs text-teal-800 hover:bg-teal-100 transition-colors flex items-start gap-2"
        >
          <Wand2 size={14} className="mt-0.5 shrink-0" />
          <span>
            <strong>Intelligenter Vorschlag:</strong> Adresse manuell übernehmen
            <span className="block opacity-80">{manualCandidate.displayName}</span>
          </span>
        </button>
      )}

      {error && (
        <p className="mt-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
          <AlertTriangle size={12} className="shrink-0" />
          {error}
        </p>
      )}

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((s, i) => {
            const parts = s.displayName.split(",");
            const primary = parts.slice(0, 2).join(",");
            const secondary = parts.slice(2).join(",").trim();
            const isActive = i === activeIndex;
            return (
              <li key={suggestionKey(s, i)} id={`address-option-${i}`} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(s)}
                  className={`w-full px-4 py-2.5 text-left transition-colors flex items-start gap-3 border-b border-gray-50 dark:border-navy-700/50 last:border-0 ${isActive ? "bg-teal-50 dark:bg-teal-900/20" : "hover:bg-teal-50 dark:hover:bg-teal-900/10"
                    }`}
                >
                  <MapPin size={14} className="shrink-0 mt-0.5 text-teal-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-navy-800 dark:text-white font-medium truncate">{primary}</p>
                    {secondary && (
                      <p className="text-xs text-silver-500 dark:text-silver-400 truncate">{secondary}</p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
