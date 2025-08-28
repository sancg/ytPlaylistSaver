import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: '/index.html',
        contentScript: '/contentScript.ts',
        viewer: '/playlist_viewer.html',
      },
      output: {
        entryFileNames: 'assets/app/[name].js',
        chunkFileNames: 'assets/app/[name]-[hash].js',
      },
    },
  },
});
