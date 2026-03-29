import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Expressumzug Berlin - Kurzfristig und zuverlässig",
    description:
        "Expressumzug in Berlin innerhalb von 24–48 Stunden. Kurzfristiger Umzug mit priorisierter Disposition, vollem Leistungsumfang und versichertem Transport.",
    path: "/leistungen/expressumzug",
});

export default function ExpressumzugLayout({ children }: { children: React.ReactNode }) {
    return children;
}
