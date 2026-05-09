import type { MetadataRoute } from "next";

const BASE_URL = "https://seeltransport.de";

const ROUTES = [
  "/",
  "/buchen",
  "/galerie",
  "/unternehmen",
  "/kontakt",
  "/agb",
  "/datenschutz",
  "/impressum",
  "/leistungen",
  "/leistungen/expressumzug",
  "/leistungen/firmenumzug",
  "/leistungen/gewerbe",
  "/leistungen/bueroreinigung",
  "/leistungen/gewerbereinigung",
  "/leistungen/schulreinigung",
  "/leistungen/kitareinigung",
  "/leistungen/praxisreinigung",
  "/leistungen/wohnungsreinigung",
  "/leistungen/gastronomiereinigung",
  "/leistungen/umzug-berlin",
  "/leistungen/umzug-brandenburg",
  "/leistungen/deutschlandweite-umzuege",
  "/leistungen/transport",
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
