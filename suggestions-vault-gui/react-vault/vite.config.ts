import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5188,
    proxy: {
      "/api": { target: "http://127.0.0.1:3847", changeOrigin: true },
    },
  },
});
