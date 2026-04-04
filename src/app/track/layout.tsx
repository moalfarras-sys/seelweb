import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Auftrag verfolgen",
    description:
      "Verfolgen Sie den Status Ihres Auftrags, Ihrer Dokumente und des Zeitverlaufs mit Ihrer Trackingnummer.",
    path: "/track",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
