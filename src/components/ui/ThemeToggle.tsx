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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/60 bg-white/72 text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/75 dark:hover:bg-white/[0.08]"
      aria-label={isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      disabled={!mounted}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
