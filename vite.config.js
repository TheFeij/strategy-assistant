import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' so the built dashboard can be opened from any static host or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
  },
})
