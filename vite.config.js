// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Let Vite handle chunking
      },
    },
  },
  server: {
    open: true,
  },
});
