import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "main-content-blue": "#3f83f1",
        "banner-red": "#d84033",
        "left-aside-green": "#0c9c54",
        "header-yellow": "#edaf00",
        "main-color": "#1c1a1a",
        "border-color": "#2e2c2c",
      },
      screens: {
        max1600: { max: "1599px" },
        max1440: { max: "1440px" },
        max1200: { max: "1200px" },
        max1050: { max: "1050px" },
        max860: { max: "860px" },
        max769: { max: "769px" },
        max576: { max: "576px" },
        max360: { max: "360px" },
      },
    },
  },
  plugins: [],
};
export default config;
