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
  "/leistungen/umzug-berlin",
  "/leistungen/privatumzug",
  "/leistungen/firmenumzug",
  "/leistungen/gewerbe",
  "/leistungen/expressumzug",
  "/leistungen/umzug-brandenburg",
  "/leistungen/deutschlandweite-umzuege",
  "/leistungen/schulumzug",
  "/leistungen/transport",
  "/leistungen/entruempelung",
  "/leistungen/entsorgung",
  "/leistungen/reinigung",
  "/leistungen/endreinigung",
  "/leistungen/wohnungsreinigung",
  "/leistungen/bueroreinigung",
  "/leistungen/gewerbereinigung",
  "/leistungen/schulreinigung",
  "/leistungen/kitareinigung",
  "/leistungen/praxisreinigung",
  "/leistungen/gastronomiereinigung",
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
