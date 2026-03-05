import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://seeltransport.de";
  const now = new Date();

  const routes = [
    "",
    "/buchen",
    "/kontakt",
    "/leistungen",
    "/unternehmen",
    "/angebot",
    "/track",
    "/impressum",
    "/datenschutz",
    "/agb",
    "/vertrag",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/buchen" ? 0.9 : 0.7,
  }));
}