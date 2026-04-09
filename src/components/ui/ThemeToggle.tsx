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
        "relative inline-flex h-12 w-[98px] items-center rounded-full border px-1.5 transition-all duration-300",
        "border-border/80 bg-white/70 text-text-body shadow-[0_16px_38px_rgba(15,23,42,0.08)] backdrop-blur-2xl",
        "dark:border-border-dark dark:bg-surface-dark-card/72 dark:text-text-on-dark-muted dark:shadow-[0_18px_42px_rgba(0,0,0,0.28)]"
      )}
      disabled={!mounted}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-1.5 h-9 w-9 rounded-full bg-[linear-gradient(135deg,#00c5a0_0%,#00e5ba_100%)] shadow-[0_0_28px_rgba(0,197,160,0.22)] transition-transform duration-300",
          isDark ? "translate-x-[48px]" : "translate-x-0"
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-[11px] font-ui font-semibold uppercase tracking-[0.24em]">
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
