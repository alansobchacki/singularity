import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ["OvercameDemoRegular", "sans-serif"],
      },
      animation: {
        floatUp: "floatUp 6s ease-in-out infinite",
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(60px) translateX(60px)" },
          "10%": { opacity: "0", transform: "translateY(60px) translateX(60px)" },
          "50%": { opacity: "1", transform: "translateY(10px) translateX(60px)" },
          "100%": { opacity: "0", transform: "translateY(-10px) translateX(60px)" },
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
