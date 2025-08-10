// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 4567,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Let Vite handle chunking
      },
    },
  },
});
