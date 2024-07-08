import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/globals.css",
  ],
  theme: {
    extend: {
      ringColor: {
        "custom-green": "#4DA514", // Define your custom color
      },
      ringWidth: {
        3: "3px", // Optional: Define custom ring width if needed
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-background": "#F5FAF1",
        "custom-green": "#4DA514",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"], // Ensures the font is easily referenced
      },
      textColor: {
        DEFAULT: "#000000", // Default text color set to black
      },
    },
  },
  plugins: [],
};
export default config;
