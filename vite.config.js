import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permet l'accès depuis le réseau local
    port: 5173, // (optionnel) tu peux changer le port si besoin
  },
})
