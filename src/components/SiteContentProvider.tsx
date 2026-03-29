"use client";

import { createContext, useContext } from "react";
import type { PublicSiteContent } from "@/types/site-content";

const SiteContentContext = createContext<PublicSiteContent | null>(null);

export function SiteContentProvider({
  value,
  children,
}: {
  value: PublicSiteContent;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }
  return context;
}
