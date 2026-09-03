import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/trust-flow/',
  server: {
    port: 5173,
    open: true,
  },
})
