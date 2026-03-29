import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Kontakt - Schnell und klar strukturiert",
    description:
        "Kontaktieren Sie SEEL Transport & Reinigung für Umzug, Reinigung, Entrümpelung oder Ihre Festpreisanfrage in Berlin und Brandenburg.",
    path: "/kontakt",
});

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
    return children;
}
