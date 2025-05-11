import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can change the development server port here
    // proxy: { // Optional: If you want to proxy API requests to your backend to avoid CORS issues during development
    //   '/api': {
    //     target: 'http://localhost:8080', // Your backend address
    //     changeOrigin: true,
    //     // rewrite: (path) => path.replace(/^\/api/, '') // if your backend doesn't have /api prefix
    //   }
    // }
  }
})