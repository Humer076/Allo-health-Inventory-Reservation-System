import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201c",
        paper: "#fbfaf7",
        accent: "#0f766e"
      }
    }
  },
  plugins: []
};

export default config;
