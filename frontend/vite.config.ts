import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy-image': {
        target: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-image/, ''),
      },
    },
    },
  },
)
