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
        "primary": {
          DEFAULT: "#FF6B35", // Premium orange accent (automotive inspired)
          hover: "#E55A2B",
          active: "#CC4B1F",
          glow: "rgba(255, 107, 53, 0.5)",
        },
        "secondary": {
          DEFAULT: "#00D4FF", // Cyan accent for modern contrast
          hover: "#00B8E6",
        },
        "background": {
          light: "#F6F7F8",
          dark: "#0A0A0A", // Premium dark background
        },
        "surface": {
          light: "#FFFFFF",
          dark: "#1A1A1A", // Card/surface background
          darker: "#0F0F0F", // Deeper surface
        },
        "panel": {
          light: "#FFFFFF",
          dark: "#252525", // Panel background
        },
        "text": {
          primary: "#FFFFFF",
          secondary: "#B0B0B0",
          muted: "#6B7280",
        },
        "border": {
          DEFAULT: "#333333",
          light: "#E5E7EB",
        },
        // Legacy mappings to keep existing code working while we refactor
        "background-dark": "#0A0A0A",
        "panel-dark": "#1A1A1A",
        "surface-dark": "#252525",
        "background-light": "#F6f7F8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"],
        heading: ["Montserrat", "sans-serif"], // Premium heading font
      },
      borderRadius: {
        "none": "0",
        "sm": "2px",
        "DEFAULT": "4px",
        "lg": "8px",
        "xl": "12px",
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'rotate-in': 'rotateIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 145, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 145, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-100px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(100px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        rotateIn: {
          'from': { opacity: '0', transform: 'rotate(-10deg)' },
          'to': { opacity: '1', transform: 'rotate(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        borderGlow: {
          '0%, 100%': {
            borderColor: 'rgba(255, 107, 53, 0.2)',
            boxShadow: '0 0 10px rgba(255, 107, 53, 0.1)',
          },
          '50%': {
            borderColor: 'rgba(255, 107, 53, 0.8)',
            boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      textStroke: {
        '-2px': '-2px',
      },
    },
  },
  plugins: [],
}
