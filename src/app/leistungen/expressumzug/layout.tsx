import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Expressumzug Berlin – ab 99 €/Std. kurzfristig planbar",
  description:
    "Expressumzug in Berlin ab 99 €/Std. inklusive 2 Mitarbeiter und Fahrzeug. Kurzfristige Termine mit priorisierter Einsatzplanung und transparenter Bestätigung.",
  path: "/leistungen/expressumzug",
});

export default function ExpressumzugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
