/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0091FF", // Unified Blue Accent
        "secondary": "#f2b90d", // Gold Accent (for Luxe option)
        "background-dark": "#050505",
        "panel-dark": "#0D0D0D",
        "surface-dark": "#171717",
        "background-light": "#f6f7f8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        "none": "0",
        "sm": "2px",
        "DEFAULT": "4px",
        "lg": "8px",
        "xl": "12px",
      },
    },
  },
  plugins: [],
}
