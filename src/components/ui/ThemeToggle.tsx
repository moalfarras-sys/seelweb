"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      className={cn(
        "relative inline-flex h-[40px] w-[78px] items-center rounded-full border px-1 transition-all duration-300",
        "border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(244,248,255,0.68)_100%)] text-text-primary/68 shadow-[0_12px_28px_rgba(4,8,18,0.1)] backdrop-blur-[18px]",
        "dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(8,14,26,0.88)_0%,rgba(8,14,26,0.72)_100%)] dark:text-white/68"
      )}
      disabled={!mounted}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-[3px] h-[32px] w-[32px] rounded-full shadow-[0_0_24px_rgba(19,222,196,0.22)] transition-transform duration-300",
          "bg-[linear-gradient(135deg,#13dec4_0%,#17bfe1_52%,#7ea7ff_100%)]",
          isDark ? "translate-x-[40px]" : "translate-x-0"
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-[10px] font-ui font-semibold uppercase tracking-[0.18em]">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full transition-colors", !isDark && "text-white")}>
          <Sun size={13} />
        </span>
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full transition-colors", isDark && "text-white")}>
          <Moon size={13} />
        </span>
      </span>
    </button>
  );
}
