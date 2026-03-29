import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Entrümpelung Berlin - Schnell, sauber, fachgerecht",
    description:
        "Professionelle Entrümpelung und Entsorgung in Berlin. Komplett-Räumung von Wohnungen, Kellern und Gewerbe mit umweltgerechter Entsorgung und Entsorgungsnachweis.",
    path: "/leistungen/entruempelung",
});

export default function EntruempelungLayout({ children }: { children: React.ReactNode }) {
    return children;
}
