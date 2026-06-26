import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Entsorgung Berlin – ab 60 €/m³ transparent kalkuliert",
  description:
    "Entsorgung in Berlin ab 60 €/m³. Transparente Kalkulation nach Volumen, Etage, Zugang und Entsorgungsart.",
  path: "/leistungen/entsorgung",
});

export default function EntsorgungLayout({ children }: { children: React.ReactNode }) {
  return children;
}
