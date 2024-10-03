import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
  base: './', // This tells Vite to generate relative paths for assets
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the build output is in the correct folder
  },
};
