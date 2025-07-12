/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // brand‑specific purple scale
        grape: {
          50:  "#f8f5ff",
          100: "#ede4ff",
          200: "#d7c2ff",
          300: "#b392ff",
          400: "#8b5dff",
          500: "#6a35ff",   // primary accent
          600: "#541df2",
          700: "#4310c7",
          800: "#36119d",
          900: "#2b127d",
        },
        // convenient aliases
        bgDark:  "#0b0b0d",   // near‑black background
        surface: "#18181b",   // cards / panels
      },
    },
  },
  plugins: [],
};
