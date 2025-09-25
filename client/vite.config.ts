import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "9c7e74ab-dd8b-4f97-8efa-8e6d53b32420-00-p26oxlnvdxr7.pike.replit.dev",
    ],
  },
});
