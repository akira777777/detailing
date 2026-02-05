import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'audio-vendor': ['howler'],
        }
      },
      // Externalize optional polyfills that are dynamically imported
      external: [
        'intersection-observer',
        'resize-observer-polyfill',
        'smoothscroll-polyfill'
      ],
      onwarn(warning, warn) {
        // Ignore warnings about externalized polyfills
        if (warning.message?.includes('intersection-observer') ||
            warning.message?.includes('resize-observer-polyfill') ||
            warning.message?.includes('smoothscroll-polyfill')) {
          return;
        }
        warn(warning);
      }
    },
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    cssMinify: true,
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=3600'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true,
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    // Exclude optional polyfills from optimization
    exclude: [
      'intersection-observer',
      'resize-observer-polyfill',
      'smoothscroll-polyfill'
    ]
  }
})
