import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Preise & Buchen – Umzug, Express und Entrümpelung anfragen",
  description:
    "Buchen Sie Ihren Umzug ab 79 €/Std., Expressumzug ab 99 €/Std. oder Entrümpelung ab 60 €/m³ online. Klare Preisorientierung und schnelle Angebotserstellung von SEEL Transport Berlin.",
  path: "/buchen",
});

export default function BuchenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
