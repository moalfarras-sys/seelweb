import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Entsorgungsservice Berlin - Umweltgerecht und zuverlässig",
    description:
        "Fachgerechte Entsorgung von Sperrmüll, Elektrogeräten und Bauschutt in Berlin. Umweltbewusst, mit Recycling und Entsorgungsnachweis.",
    path: "/leistungen/entsorgung",
});

export default function EntsorgungLayout({ children }: { children: React.ReactNode }) {
    return children;
}
