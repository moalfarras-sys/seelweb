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
        "relative inline-flex h-11 w-[92px] items-center rounded-pill border px-1.5 transition-all duration-300",
        "border-border bg-white/90 text-text-body shadow-sm backdrop-blur-xl",
        "dark:border-border-dark dark:bg-surface-dark-card/90 dark:text-text-on-dark-muted"
      )}
      disabled={!mounted}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-1.5 h-8 w-8 rounded-full bg-brand-teal shadow-[0_0_24px_rgba(0,197,160,0.28)] transition-transform duration-300",
          isDark ? "translate-x-[45px]" : "translate-x-0"
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1 text-xs font-ui font-semibold">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full transition-colors", !isDark && "text-white")}>
          <Sun size={14} />
        </span>
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full transition-colors", isDark && "text-white")}>
          <Moon size={14} />
        </span>
      </span>
    </button>
  );
}
