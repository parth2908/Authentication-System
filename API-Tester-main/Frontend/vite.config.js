import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Add proxy to route /api calls to backend
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
