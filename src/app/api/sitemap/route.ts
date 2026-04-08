import { NextResponse } from "next/server";

const BASE_URL = "https://seeltransport.de";

const ROUTES = [
  "/",
  "/leistungen",
  "/leistungen/umzug-berlin",
  "/leistungen/privatumzug",
  "/leistungen/firmenumzug",
  "/leistungen/schulumzug",
  "/leistungen/reinigung",
  "/leistungen/entruempelung",
  "/leistungen/expressumzug",
  "/buchen",
  "/unternehmen",
  "/galerie",
  "/kontakt",
  "/impressum",
  "/datenschutz",
  "/agb",
];

export async function GET() {
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((route) => `  <url>
    <loc>${new URL(route, BASE_URL).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
