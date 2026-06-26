"use client";

import { usePathname } from "next/navigation";
import { ChatbotWidget } from "./ChatbotWidget";

export function ChatbotProvider() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <ChatbotWidget />;
}