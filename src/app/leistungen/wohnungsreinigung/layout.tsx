import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Wohnungsreinigung Berlin - Gründlich und zuverlässig",
    description:
        "Professionelle Wohnungsreinigung in Berlin. Regelmäßig oder einmalig, mit umweltfreundlichen Mitteln und dokumentierter Qualität.",
    path: "/leistungen/wohnungsreinigung",
});

export default function WohnungsreinigungLayout({ children }: { children: React.ReactNode }) {
    return children;
}
