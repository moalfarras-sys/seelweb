const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const ORS_BASE = "https://api.openrouteservice.org/v2";
const USER_AGENT = "SeelTransport/1.0 (info@seeltransport.de)";

export interface GeocodeSuggestion {
  displayName: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  lat: number;
  lon: number;
  searchStage: "germany";
}

export interface GeocodeResult {
  suggestions: GeocodeSuggestion[];
  searchStage: "germany";
}

export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  geometry: [number, number][];
}

export class ProviderRequestError extends Error {
  status: number;
  provider: string;
  code: string;

  constructor(provider: string, status: number, code: string, message: string) {
    super(message);
    this.provider = provider;
    this.status = status;
    this.code = code;
  }
}

const UMLAUT_MAP: [RegExp, string, string][] = [
  [/ae/gi, "\u00C4", "\u00E4"],
  [/oe/gi, "\u00D6", "\u00F6"],
  [/ue/gi, "\u00DC", "\u00FC"],
];

export function toUmlautVariant(input: string): string {
  let result = input;
  for (const [pattern, upper, lower] of UMLAUT_MAP) {
    result = result.replace(pattern, (m) =>
      m.charAt(0) === m.charAt(0).toUpperCase() ? upper : lower
    );
  }
  return result;
}

interface NominatimItem {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
  };
}

function mapNominatimItem(
  item: NominatimItem,
  stage: "germany"
): GeocodeSuggestion {
  const lat = parseFloat(item.lat);
  const lon = parseFloat(item.lon);
  return {
    displayName: item.display_name,
    street: item.address.road || "",
    houseNumber: item.address.house_number || "",
    zip: item.address.postcode || "",
    city:
      item.address.city ||
      item.address.town ||
      item.address.village ||
      "",
    lat,
    lon,
    searchStage: stage,
  };
}

// ── Nominatim geocoding (Germany-wide) ──

async function nominatimSearch(
  q: string,
  opts?: { viewbox?: string; bounded?: boolean }
): Promise<NominatimItem[]> {
  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "de",
    limit: "8",
    "accept-language": "de",
  });
  if (opts?.viewbox) params.set("viewbox", opts.viewbox);
  if (opts?.bounded) params.set("bounded", "1");

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    let code = "PROVIDER_ERROR";
    if (res.status === 401) code = "PROVIDER_UNAUTHORIZED";
    if (res.status === 403) code = "PROVIDER_FORBIDDEN";
    if (res.status === 429) code = "PROVIDER_RATE_LIMITED";
    throw new ProviderRequestError(
      "nominatim",
      res.status,
      code,
      `Nominatim geocoding failed with status ${res.status}`
    );
  }

  return res.json();
}

export async function geocodeAddress(
  query: string
): Promise<GeocodeResult> {
  if (!query || query.length < 3) return { suggestions: [], searchStage: "germany" };

  const trimmed = query.trim();
  const germanyData = await nominatimSearch(trimmed);
  let mapped = germanyData.map((item) => mapNominatimItem(item, "germany"));

  // Try umlaut variant if no results
  if (mapped.length === 0) {
    const umlautQuery = toUmlautVariant(trimmed);
    if (umlautQuery !== trimmed) {
      const umlautData = await nominatimSearch(umlautQuery);
      mapped = umlautData.map((item) => mapNominatimItem(item, "germany"));
    }
  }

  return { suggestions: mapped, searchStage: "germany" };
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<GeocodeSuggestion | null> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: "jsonv2",
    addressdetails: "1",
    "accept-language": "de",
  });

  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    let code = "PROVIDER_ERROR";
    if (res.status === 401) code = "PROVIDER_UNAUTHORIZED";
    if (res.status === 403) code = "PROVIDER_FORBIDDEN";
    if (res.status === 429) code = "PROVIDER_RATE_LIMITED";
    throw new ProviderRequestError(
      "nominatim",
      res.status,
      code,
      `Nominatim reverse geocoding failed with status ${res.status}`
    );
  }

  const item = await res.json();
  if (!item || item.error) return null;

  const parsedLat = parseFloat(item.lat);
  const parsedLon = parseFloat(item.lon);

  return {
    displayName: item.display_name,
    street: item.address?.road || "",
    houseNumber: item.address?.house_number || "",
    zip: item.address?.postcode || "",
    city:
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      "",
    lat: parsedLat,
    lon: parsedLon,
    searchStage: "germany",
  };
}

// ── OpenRouteService routing ──

export async function calculateRoute(
  fromLon: number,
  fromLat: number,
  toLon: number,
  toLat: number
): Promise<RouteResult | null> {
  const rawKey = process.env.ORS_API_KEY;
  if (!rawKey) {
    console.error("ORS_API_KEY is not set");
    return fallbackRoute(fromLat, fromLon, toLat, toLon);
  }

  let apiKey = rawKey;
  if (rawKey.startsWith("http")) {
    const match = rawKey.match(/api_key=([^&]+)/);
    apiKey = match ? match[1] : rawKey;
  }

  try {
    const url = `${ORS_BASE}/directions/driving-car?api_key=${apiKey}&start=${fromLon},${fromLat}&end=${toLon},${toLat}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json, application/geo+json" },
    });

    if (!res.ok) {
      console.error(`ORS error: ${res.status} ${await res.text()}`);
      return fallbackRoute(fromLat, fromLon, toLat, toLon);
    }

    const data = await res.json();
    const segment = data.features?.[0]?.properties?.segments?.[0];
    const coords = data.features?.[0]?.geometry?.coordinates;

    if (!segment) {
      return fallbackRoute(fromLat, fromLon, toLat, toLon);
    }

    return {
      distanceKm: Math.round((segment.distance / 1000) * 10) / 10,
      durationMin: Math.round(segment.duration / 60),
      geometry: coords
        ? coords.map(([lon, lat]: [number, number]) => [lat, lon] as [number, number])
        : [],
    };
  } catch (err) {
    console.error("ORS fetch error:", err);
    return fallbackRoute(fromLat, fromLon, toLat, toLon);
  }
}

// Haversine-based straight-line fallback with 1.3x city factor
function fallbackRoute(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): RouteResult {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  const cityFactor = 1.3;
  const distanceKm = Math.round(straightKm * cityFactor * 10) / 10;
  const durationMin = Math.round(distanceKm * 2.5);

  return { distanceKm, durationMin, geometry: [] };
}

// Generate a stable cache key for a route pair
export function routeCacheKey(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): string {
  const roundTo4 = (n: number) => Math.round(n * 10000) / 10000;
  return `${roundTo4(fromLat)},${roundTo4(fromLon)}->${roundTo4(toLat)},${roundTo4(toLon)}`;
}
