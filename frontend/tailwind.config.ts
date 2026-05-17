import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        body: ["Oxanium", "system-ui", "sans-serif"],
      },
      colors: {
        radar: {
          black: "#030504",
          panel: "rgba(8, 17, 14, 0.78)",
          green: "#42ff9e",
          lime: "#b7ff4a",
          amber: "#ffbf47",
          red: "#ff4f5e",
          cyan: "#4de6ff",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(66, 255, 158, 0.28)",
        danger: "0 0 28px rgba(255, 79, 94, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;

