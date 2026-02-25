import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00B140",
          dark: "#009C38",
          light: "#E6F7EE",
        },
      },
    },
  },
  plugins: [],
}

export default config