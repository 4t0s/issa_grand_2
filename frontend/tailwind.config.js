/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#040714",
        panel: "rgba(10, 16, 36, 0.72)",
        line: "rgba(134, 156, 255, 0.18)",
        glow: {
          cyan: "#3dd9ff",
          violet: "#7466ff",
          pink: "#d56bff",
        },
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.45)",
      },
      keyframes: {
        gridShift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(12px, -18px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        grid: "gridShift 16s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

