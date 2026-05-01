/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#06B6D4",
        accent: "#F472B6",
        dark: "#0F172A",
        card: "#1E293B"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

