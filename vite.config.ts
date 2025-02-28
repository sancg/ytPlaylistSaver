import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: '/index.html',
        contentScript: '/contentScript.ts',
      },
      output: {
        entryFileNames: 'assets/app/[name].js',
        chunkFileNames: 'assets/app/[name]-[hash].js',
      },
    },
  },
});
