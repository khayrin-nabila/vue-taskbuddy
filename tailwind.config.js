export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      nunito: ["Nunito"],
    },
    extend: {
      colors: {
        alt: "#FFFFFF",
        primary: "#67568c",
        secondary: "#ff6e6c",
        tertiary: "#fbdd74",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
