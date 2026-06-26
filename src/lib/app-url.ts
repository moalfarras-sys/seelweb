/**
 * Single source of truth for the public base URL used in e-mail links, PDFs, etc.
 *
 * In production we MUST NOT emit localhost links. If the configured value is
 * missing or points at localhost, we fail safe to the canonical domain instead
 * of sending a broken link to a customer.
 */
const CANONICAL_PRODUCTION_URL = "https://seeltransport.de";

export function getAppBaseUrl(): string {
  const configured = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "").trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (!configured || configured.includes("localhost") || configured.startsWith("http://")) {
      // Fail safe: never send a localhost / insecure link to a customer in prod.
      return CANONICAL_PRODUCTION_URL;
    }
    return configured.replace(/\/+$/, "");
  }

  return (configured || "http://localhost:3000").replace(/\/+$/, "");
}
