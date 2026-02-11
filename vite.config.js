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
          'state-vendor': ['zustand'],
          'validation-vendor': ['zod'],
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
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
    sourcemap: process.env.NODE_ENV !== 'production',
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false,
      },
    },
    reportCompressedSize: true,
    cssCodeSplit: true,
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
    legalComments: 'none',
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
    ],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
    ],
  }
})
