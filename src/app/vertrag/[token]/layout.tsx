import type { Metadata } from "next";

// Private, token-gated contract page — must never be indexed.
export const metadata: Metadata = {
  title: "Vertrag",
  robots: { index: false, follow: false },
};

export default function VertragLayout({ children }: { children: React.ReactNode }) {
  return children;
}
