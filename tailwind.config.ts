import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          950: "#0B0D10", // near-black ink, our base canvas
          900: "#12151A",
          800: "#1A1E25",
          700: "#262B34",
          600: "#3A4150",
          500: "#5C6577",
          400: "#8B93A3",
          300: "#B7BECB",
          200: "#DDE1E8",
          100: "#F3F5F8",
          50: "#FAFBFC",
        },
        ember: {
          950: "#3A1A05",
          900: "#5C2A08",
          800: "#8A3F0C",
          700: "#B8530F",
          600: "#DB6812",
          500: "#F2A93B", // primary signature accent — molten gold, not terracotta
          400: "#F5BE64",
          300: "#F8D28C",
          200: "#FBE4B3",
          100: "#FDF1DB",
        },
        arc: {
          600: "#2E5BFF", // secondary "electric" accent for AI/data moments
          500: "#4A73FF",
          400: "#7593FF",
        },
        success: "#3FB27F",
        warning: "#E2A63A",
        danger: "#E25C5C",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "ember-glow": "radial-gradient(60% 60% at 50% 0%, rgba(242,169,59,0.16) 0%, rgba(11,13,16,0) 70%)",
        "forge-grid": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "spark-rise": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.9" },
          "100%": { transform: "translateY(-120px) scale(0.3)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "spark-rise": "spark-rise 1.4s ease-out forwards",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
