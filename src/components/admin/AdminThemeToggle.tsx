"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-xl border border-sky-200/70 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-sky-50 dark:border-white/10 dark:bg-navy-900/70 dark:text-slate-200 dark:hover:bg-navy-800"
      aria-label="Design umschalten"
      title="Design umschalten"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

