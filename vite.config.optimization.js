// Enhanced Vite configuration for better performance
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Enable tree shaking for date-fns
    rollupOptions: {
      external: [], // Keep all dependencies bundled for simplicity
      output: {
        manualChunks: {
          // Split vendor code
          vendor: ['date-fns'],
          // Split UI components
          ui: ['./UIManager.js', './ThemeManager.js']
        }
      }
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Enable source maps for debugging
    sourcemap: false, // Disable in production for smaller bundle
    // Minification
    minify: 'esbuild',
    target: 'es2018' // Support older browsers while keeping modern features
  },
  // Enable aggressive CSS optimization
  css: {
    devSourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['date-fns/intervalToDuration', 'date-fns/differenceInDays']
  }
});
