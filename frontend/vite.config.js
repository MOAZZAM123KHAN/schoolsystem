import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Forward /api calls to the Express backend (used once the backend is connected)
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
  },
});
