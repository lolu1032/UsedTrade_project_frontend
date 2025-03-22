import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/ws-stomp': {
        target: 'http://localhost:8080',  // Spring 백엔드 서버 주소
        ws: true,  // WebSocket 프록시 활성화
        changeOrigin: true
      },
      '/boards': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api': {  // 추가
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
