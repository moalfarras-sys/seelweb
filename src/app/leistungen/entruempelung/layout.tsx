import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Entrümpelung Berlin – ab 60 €/m³ transparent kalkuliert",
  description:
    "Entrümpelung und Entsorgung in Berlin ab 60 €/m³. Transparente Kalkulation nach Volumen, Etage, Zugang und Entsorgungsart.",
  path: "/leistungen/entruempelung",
});

export default function EntruempelungLayout({ children }: { children: React.ReactNode }) {
  return children;
}
