/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // Emerald-500
        "gray-text": "#6B7280", // Gray-500
      },
      fontFamily: {
        heading: ["Your-Heading-Font", "sans-serif"], // Replace with your font
      },
    },
  },
  plugins: [],
};