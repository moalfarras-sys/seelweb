import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Unternehmen - Über SEEL Transport & Reinigung",
    description:
        "SEEL Transport & Reinigung - Ihr Partner für Umzüge, Reinigung und Entrümpelung in Berlin und Brandenburg. Erfahren Sie mehr über unser Unternehmen.",
    path: "/unternehmen",
});

export default function UnternehmenLayout({ children }: { children: React.ReactNode }) {
    return children;
}
