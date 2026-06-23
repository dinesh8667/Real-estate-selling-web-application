/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ddb8ff",
        "primary-container": "#892cdc",
        "surface-container-lowest": "#0e0e0e",
        "on-surface-variant": "#cfc2d7",
      },
      spacing: {
        gutter: "1.5rem",
        "container-max": "1280px",
      },
    },
  },
  plugins: [],
};