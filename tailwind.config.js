/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blackShop: "#111111",
        blueShop: "#00DBDE",
        pinkShop: "#FC00FF",
        whiteSmokeShop: "#EEEEEE",
        greenShop: "#00FF00",
      },
    },
  },
  plugins: [],
};
