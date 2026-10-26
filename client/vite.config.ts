import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5125', // Match your ASP.NET Core port
        changeOrigin: true,
        secure: false
      }
    }
  }
})