import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://seeltransport.de";

const ROUTES = [
  "/",
  "/leistungen",
  "/leistungen/privatumzug",
  "/leistungen/firmenumzug",
  "/leistungen/schulumzug",
  "/leistungen/expressumzug",
  "/leistungen/endreinigung",
  "/leistungen/entruempelung",
  "/leistungen/entsorgung",
  "/leistungen/reinigung",
  "/leistungen/wohnungsreinigung",
  "/leistungen/gewerbe",
  "/leistungen/umzug-berlin",
  "/leistungen/umzug-brandenburg",
  "/leistungen/deutschlandweite-umzuege",
  "/leistungen/transport",
  "/leistungen/praxisreinigung",
  "/leistungen/bueroreinigung",
  "/leistungen/kitareinigung",
  "/leistungen/schulreinigung",
  "/leistungen/gewerbereinigung",
  "/leistungen/gastronomiereinigung",
  "/buchen",
  "/galerie",
  "/unternehmen",
  "/kontakt",
  "/impressum",
  "/datenschutz",
  "/agb",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((path) => ({
    url: new URL(path, BASE_URL).toString(),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/buchen" || path === "/leistungen/umzug-berlin" ? 0.9 : 0.8,
  }));
}
