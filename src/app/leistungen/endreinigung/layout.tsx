import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Endreinigung Berlin - Übergabefertig und gründlich",
    description:
        "Professionelle Endreinigung und Auszugsreinigung in Berlin mit Nachbesserungsgarantie. Übergabefertig, gründlich und transparent kalkuliert.",
    path: "/leistungen/endreinigung",
});

export default function EndreinigungLayout({ children }: { children: React.ReactNode }) {
    return children;
}
