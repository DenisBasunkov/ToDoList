import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ToDoList/",
  server: {
    proxy: {
      '/api': 'https://todolistserver-9yzt.onrender.com'
    }
  },
})
