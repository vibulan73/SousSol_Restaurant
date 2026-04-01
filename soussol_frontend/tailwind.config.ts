import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS variables — values swap when [data-theme="light"] is set on <html>
        // Supports opacity modifiers: bg-ss-black/50, text-ss-cream/70, etc.
        "ss-black":      "rgb(var(--ss-black) / <alpha-value>)",
        "ss-dark":       "rgb(var(--ss-dark) / <alpha-value>)",
        "ss-surface":    "rgb(var(--ss-surface) / <alpha-value>)",
        "ss-gold":       "rgb(var(--ss-gold) / <alpha-value>)",
        "ss-gold-light": "rgb(var(--ss-gold-light) / <alpha-value>)",
        "ss-cream":      "rgb(var(--ss-cream) / <alpha-value>)",
        "ss-muted":      "rgb(var(--ss-muted) / <alpha-value>)",
        "ss-border":     "rgb(var(--ss-border) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.9s ease forwards",
        "fade-in": "fadeIn 1.2s ease forwards",
        "slide-down": "slideDown 0.3s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
