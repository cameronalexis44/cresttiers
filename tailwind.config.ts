import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#07091A",
        panel: "#101427",
        crimson: {
          DEFAULT: "#E11D48",
          bright: "#FF3B5C",
          deep: "#7A0F22",
        },
        azure: {
          DEFAULT: "#2563EB",
          bright: "#60A5FA",
          deep: "#0B1E5C",
        },
        bone: "#EDE8E4",
        ash: "#8A8FA8",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        "glow-red": "0 0 24px -4px rgba(255,59,92,0.55)",
        "glow-blue": "0 0 24px -4px rgba(96,165,250,0.55)",
      },
      backgroundImage: {
        "gradient-duotone":
          "linear-gradient(135deg, #2563EB 0%, #6D28D9 50%, #E11D48 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
