// Optimized Vite configuration for production
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 4567,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production for smaller bundle
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          'date-fns': ['date-fns'],
          'ui-components': ['./UIManager.js', './ThemeManager.js'],
          'utils': ['./ValidationHelper.js', './AccessibilityHelper.js', './ErrorHandler.js']
        },
        // Optimize chunk names for caching
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Optimize for modern browsers
    target: 'es2020',
    // Reduce bundle size
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['date-fns'],
    exclude: []
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: false,
    modules: {
      scopeBehaviour: 'local'
    }
  },
  // Production optimizations
  esbuild: {
    drop: ['console', 'debugger'],
  },
  // Enable gzip compression
  plugins: []
});
