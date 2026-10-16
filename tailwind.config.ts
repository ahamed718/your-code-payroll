import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { brand: { DEFAULT: "#4338ca", dark: "#312e81", light: "#eef2ff" } } } },
  plugins: [],
};
export default config;
