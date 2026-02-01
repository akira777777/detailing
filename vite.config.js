import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'audio-vendor': ['howler'],
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    // Use esbuild (default) for faster minification
    minify: 'esbuild',
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  }
})
