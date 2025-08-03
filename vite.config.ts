import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    // Removed third-party development plugins for cleaner setup
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./client/src', import.meta.url)),
      "@shared": fileURLToPath(new URL('./shared', import.meta.url)),
      "@assets": fileURLToPath(new URL('./attached_assets', import.meta.url)),
    },
  },
  root: fileURLToPath(new URL('./client', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('./dist/public', import.meta.url)),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
