import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: 'public/html/index.html',
        contentScript: resolve(__dirname, 'src/scripts/contentScript.ts'),
        injectFavButton: resolve(__dirname, 'src/scripts/injectFavButton.js'),
        viewer: 'public/html/pages/playlist_viewer.html',
        sidePanel: 'public/html/pages/sp_manager.html',
      },
      output: {
        entryFileNames: 'assets/app/[name].js',
        chunkFileNames: 'assets/app/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    outDir: 'dist',
  },
});
