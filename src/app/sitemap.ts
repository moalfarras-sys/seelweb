import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://seeltransport.de";
  const now = new Date();

  const routes = [
    "",
    "/buchen",
    "/kontakt",
    "/leistungen",
    "/leistungen/umzug",
    "/leistungen/privatumzug",
    "/leistungen/firmenumzug",
    "/leistungen/entruempelung",
    "/leistungen/entsorgung",
    "/leistungen/transport",
    "/leistungen/reinigung",
    "/leistungen/wohnungsreinigung",
    "/leistungen/endreinigung",
    "/leistungen/expressumzug",
    "/leistungen/umzug-berlin",
    "/leistungen/deutschlandweite-umzuege",
    "/unternehmen",
    "/track",
    "/impressum",
    "/datenschutz",
    "/agb",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/buchen" ? 0.9 : 0.75,
  }));
}
