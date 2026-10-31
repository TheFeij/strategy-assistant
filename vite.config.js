import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: './' so the built dashboard can be opened from any static host or sub-path.
// `npm run build:single` additionally inlines JS, CSS and fonts into one index.html.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  server: {
    port: 5173,
  },
}))
