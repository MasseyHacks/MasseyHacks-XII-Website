import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/MasseyHacks-XII-Website/', // <--- use your repo name
  plugins: [react()],
})
