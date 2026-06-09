/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172126",
        saffron: "#d97706",
        teal: "#0f766e",
      },
      boxShadow: {
        panel: "0 14px 30px rgba(23, 33, 38, 0.08)",
      },
    },
  },
  plugins: [],
};
