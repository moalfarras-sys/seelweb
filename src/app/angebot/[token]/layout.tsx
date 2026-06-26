import type { Metadata } from "next";

// Private, token-gated offer page — must never be indexed.
export const metadata: Metadata = {
  title: "Angebot",
  robots: { index: false, follow: false },
};

export default function AngebotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
