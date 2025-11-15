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
        index: 'src/pages/popup/popup.html',
        viewer: 'public/html/pages/playlist_viewer.html',
        sidePanel: 'src/pages/side_panel/side-panel.html',
        contentScript: resolve(__dirname, 'src/scripts/content/contentScript.ts'),
        contentFavButton: resolve(__dirname, 'src/scripts/content/contentFavButton.ts'),
        background: resolve(__dirname, 'src/scripts/background/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          const basePath = 'assets/app/scripts';

          // Background folder
          if (name === 'background') {
            return `${basePath}/background/${name}.js`;
          }

          // Content scripts folder
          if (name === 'contentScript' || name === 'contentFavButton') {
            return `${basePath}/content/${name}.js`;
          }

          return `assets/app/other/${name}.js`;
        },
        chunkFileNames: 'assets/app/bundler/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    outDir: 'dist',
  },
});
