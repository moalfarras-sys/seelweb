import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://seeltransport.de";
  const now = new Date();

  const routes = [
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
    "/unternehmen",
    "/kontakt",
    "/impressum",
    "/datenschutz",
    "/agb",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/buchen" ? 0.9 : 0.8,
  }));
}
