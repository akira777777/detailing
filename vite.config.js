import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({
    filename: 'dist/stats.html',
    open: true,
    gzipSize: true
  })],
  build: {
    target: ['es2020'],
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks more aggressively
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('howler')) {
              return 'audio-vendor';
            }
            if (id.includes('zustand')) {
              return 'state-vendor';
            }
            // Group other dependencies
            return 'vendor-other';
          }
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
    sourcemap: process.env.NODE_ENV === 'development',
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
    pure: ['console.log', 'console.info', 'console.debug'],
    legalComments: 'none'
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
  },
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',  // Exclude Playwright E2E tests
      '**/*.spec.js',
    ]
  }
})
