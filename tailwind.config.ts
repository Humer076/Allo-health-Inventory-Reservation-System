import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        paper: "#f6f8fb",
        accent: "#0f766e",
        brand: "#2563eb"
      }
    }
  },
  plugins: []
};

export default config;
