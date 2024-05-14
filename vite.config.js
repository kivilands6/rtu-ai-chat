import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
  server: {
    port:3000,
  },
  assets: {
    // Ensure that SVG files are handled
    fileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  }
})
