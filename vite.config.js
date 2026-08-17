import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  build: {
    rollupOptions: {
      input: "src/main.tsx", // Ensure Vite looks for main.tsx
    },
  },
});
