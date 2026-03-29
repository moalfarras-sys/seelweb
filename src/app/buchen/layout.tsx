import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Preise & Buchen - Online Angebot anfragen",
    description:
        "Buchen Sie Ihren Umzug, Reinigung oder Entrümpelung online. Transparente Preisberechnung und schnelle Angebotserstellung von SEEL Transport Berlin.",
    path: "/buchen",
});

export default function BuchenLayout({ children }: { children: React.ReactNode }) {
    return children;
}
