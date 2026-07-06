import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/lsd-app/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@asset': new URL('src/asset', import.meta.url).pathname,
    },
  },
})
