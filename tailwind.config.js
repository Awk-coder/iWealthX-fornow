/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0e1a",
        surface: "#1a1f2e",
        gold: "#D4AF37",
        "text-primary": "#FFFFFF",
        "text-secondary": "#9CA3AF",
        accent: {
          blue: "#3B82F6",
          green: "#10B981",
          red: "#EF4444",
          purple: "#8B5CF6",
          amber: "#F59E0B",
        },
        gray: {
          850: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
