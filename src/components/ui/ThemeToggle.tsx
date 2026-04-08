"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      onClick={() => {
        if (!mounted) return;
        setTheme(isDark ? "light" : "dark");
      }}
      className="relative inline-flex h-8 w-[60px] items-center rounded-pill border border-border bg-surface p-0.5 transition-colors duration-300 dark:border-border-dark dark:bg-surface-dark-card"
      aria-label={isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      disabled={!mounted}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal text-white shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-[30px]" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={13} /> : <Sun size={13} />}
      </span>
    </button>
  );
}
