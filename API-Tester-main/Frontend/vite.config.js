import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Add proxy to route /api calls to backend
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://authentication-system-5-1shs.onrender.com', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
