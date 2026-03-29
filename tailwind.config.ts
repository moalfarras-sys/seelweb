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
          50: "#e0f7f7",
          100: "#b3e8e9",
          200: "#80d9db",
          300: "#4dcacd",
          400: "#26bfc2",
          500: "#0d9ea0",
          600: "#0b8587",
          700: "#096c6e",
          800: "#075355",
          900: "#043a3c",
        },
        gold: {
          50: "#fff8e1",
          100: "#ffecb3",
          200: "#ffe082",
          300: "#ffd54f",
          400: "#ffca28",
          500: "#ffc107",
          600: "#ffb300",
          700: "#ffa000",
          800: "#ff8f00",
          900: "#ff6f00",
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
        sans: ["NotoSans", "system-ui", "sans-serif"],
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
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
