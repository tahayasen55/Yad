import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',  // Ensure root is set to current directory if needed
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'  // Make sure this path is correct
    }
  }
});
