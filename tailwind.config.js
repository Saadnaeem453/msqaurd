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
        "analytics-neutral": "#52555f",
        "analytics-scatter": "#a20e20",
        "analytics-yellow": "#e9c400",
        "analytics-heat-low": "#443c42",
        "analytics-heat-mid": "#755b5e",
        "analytics-heat-high": "#aa8080",
        "finance-revenue": "#cecad8",
        "finance-revenue-muted": "#624c57",
        "finance-gmv": "#492029",
        "backlog-panel": "#1d1e26",
        "backlog-head": "#191c23",
        "backlog-resolution": "#aa5c69",
        "backlog-reports": "#a81020",
        "backlog-cap": "#23252e",
        "report-panel": "#192028",
        "report-head": "#151c24",
        "report-control": "#303741",
        "report-alert": "#ffa99b",
        "report-amber": "#ef8a35",
        "report-blue": "#49a5ff",

        primary: "#e50a15",
        secondary: "#e9bcb6",
        border_color:"#232424",
        bgray:"#dce3f0" ,
        cgreen: "22c55e" ,
        grayblue:"#0d141d",
        lightgrayblue:"#192029",
        green:"#22c55e",
      },
    },
  },
  plugins: [],
};
