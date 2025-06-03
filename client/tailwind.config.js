/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 3s infinite",
      },
      colors: {
        "main-color": "#211C84",
        "secondary-color": "#4D55CC",
        "secondary-text": "#767676",
        "complement-color": "#FFBC1F",
      },
      fontSize: {
        vs: ["0.8rem  ", "0.25rem"],
      },
    },
  },
  plugins: [import("tailwind-scrollbar-hide")],
};
