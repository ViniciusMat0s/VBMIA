/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        saira: ["Saira", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#050b10",
          900: "#071017",
          850: "#09141b",
          800: "#0c1a22",
          700: "#122533",
        },
        sand: "#f4efe7",
        mist: "rgba(244, 239, 231, 0.72)",
        ember: "#4fd1c5",
        sun: "#5fa8ff",
        mint: "#78f0e3",
      },
      boxShadow: {
        glow: "0 24px 70px rgba(0, 0, 0, 0.35)",
        card: "0 28px 80px rgba(0, 0, 0, 0.34)",
      },
      backgroundImage: {
        halo:
          "radial-gradient(circle at top left, rgba(79, 209, 197, 0.18), transparent 34%), radial-gradient(circle at top right, rgba(95, 168, 255, 0.14), transparent 26%), linear-gradient(180deg, #071017 0%, #09141b 48%, #050b10 100%)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -16px, 0) scale(1.03)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        floaty: "floaty 10s ease-in-out infinite",
        shimmer: "shimmer 2.8s ease-in-out infinite",
      },
      borderRadius: {
        xl: "1.75rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
