import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1628",
          teal: "#22C55E",
          gold: "#A855F7",
          "teal-light": "#4ADE80",
          "navy-light": "#24123A",
        },
        surface: {
          DEFAULT: "#F5F7FA",
          card: "#FFFFFF",
          dark: "#0B1628",
          "dark-card": "#152238",
          "dark-elevated": "#1E3050",
        },
        text: {
          primary: "#0B1628",
          body: "#475569",
          muted: "#94A3B8",
          "on-dark": "#F1F5F9",
          "on-dark-muted": "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          dark: "#1E3A5F",
        },
        status: {
          success: "#22C55E",
          warning: "#A855F7",
          error: "#EF4444",
          info: "#8B5CF6",
        },
        navy: {
          50: "#e8eaf6",
          100: "#c5cbe9",
          200: "#a0abc5",
          300: "#7b8ba1",
          400: "#5d6d8a",
          500: "#405072",
          600: "#2a375a",
          700: "#1a2545",
          800: "#0e152e",
          900: "#050a1c",
          950: "#02050f",
        },
        teal: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        gold: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        silver: {
          50: "#f5f6f8",
          100: "#e5e8ec",
          200: "#d5d9e0",
          300: "#b0b8c1",
          400: "#8b95a2",
          500: "#6b7787",
          600: "#525d6b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        ui: ["var(--font-ui)", "system-ui", "sans-serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
        button: "12px",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
