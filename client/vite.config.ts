import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["57ffecf5-17a5-4a30-9575-d4ae4c76b894-00-z1u30w2qzt9b.pike.replit.dev"]
  }
})
