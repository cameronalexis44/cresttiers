import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0B0A0C",
        panel: "#151215",
        crimson: {
          DEFAULT: "#C81E3A",
          bright: "#FF3652",
          deep: "#7A0F22",
        },
        bone: "#EDE8E4",
        ash: "#8A8078",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
