import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Opção B para evitar CORS sem mexer no backend:
// defina VITE_API_URL=/api no arquivo .env e o Vite encaminha /api para o Spring Boot.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
