/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        384: "96rem", // 1536px — desktop app shell (max-w-384)
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        // New primary colors
        primary: "#e50a15",      // New main color
        secondary: "#e9bcb6",  
        border_color:"#232424",  // New secondary color (for headings and paragraphs)
        
      },
    },
  },
  plugins: [],
};