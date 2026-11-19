import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vite = o "motor" que a aula descreve (Babel + Browserify automáticos):
// transpila o JSX e empacota tudo a cada vez que um arquivo é salvo.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
})
