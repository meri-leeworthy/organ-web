import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ["WorkSans", "sans-serif"],
      body: ["Fluxisch", "sans-serif"],
    },
    extend: {
      dropShadow: {
        hard: "3px 3px 0 rgba(0, 0, 0, 1)",
      },
      colors: {
        primary: "#ddd2ff",
        primarydark: "#916fff",
        greylight: "#1D170C11",
        grey: "#1D170C22",
        green: {
          "50": "#e5ffe4",
          "100": "#c5ffc4",
          "200": "#91ff90",
          "300": "#50ff55",
          "400": "#00ff11",
          "500": "#00e615",
          "600": "#00b816",
          "700": "#008b11",
          "800": "#076d14",
          "900": "#0b5c17",
          "950": "#00340a",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
