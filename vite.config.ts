/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom/client")) {
              return "react-dom-client";
            }
            if (id.includes("react-dom")) {
              return "react-dom";
            }
            if (id.includes("react-router-dom")) {
              return "react-router-dom";
            }
            if (id.includes("react")) {
              return "react";
            }
            if (id.includes("tailwindcss")) {
              return "tailwindcss";
            }
            if (id.includes("golfslag")) {
              return "golfslag";
            }
            return "vendor";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
