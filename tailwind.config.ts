import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#16233A",
          deep: "#10192B",
          mid: "#1C3052",
        },
        mint: {
          DEFAULT: "#00C389",
          dark: "#00966A",
          soft: "#E7F8F2",
        },
        teal: {
          DEFAULT: "#07B4AE",
          soft: "#E5F6F6",
        },
        plum: {
          DEFAULT: "#2E1A47",
          mid: "#5C3D86",
          soft: "#F3EEF8",
        },
        ink: "#1C2434",
        muted: "#5C6B80",
        line: "#E3E8F0",
        paper: "#F4F6F9",
        amber: {
          DEFAULT: "#B7791F",
          soft: "#FBF4E4",
        },
        danger: {
          DEFAULT: "#B42318",
          soft: "#FDECEC",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,35,58,0.04), 0 16px 40px -24px rgba(22,35,58,0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
