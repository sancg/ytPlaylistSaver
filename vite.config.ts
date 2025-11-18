import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { join, resolve } from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const PYODIDE_EXCLUDE = ['!**/*.{md,html}', '!**/*.d.ts', '!**/*.whl', '!**/node_modules'];

export function viteStaticCopyPyodide() {
  const pyodideDir = resolve(__dirname, 'node_modules/pyodide');
  return viteStaticCopy({
    targets: [
      {
        src: [join(pyodideDir, '*')].concat(PYODIDE_EXCLUDE),
        dest: 'assets/pyodide',
      },
      {
        src: 'src/scripts/background/py_worker/py-worker.js',
        dest: 'assets/app/scripts/background/py_worker',
      },
    ],
  });
}

export default defineConfig({
  optimizeDeps: { exclude: ['pyodide'] },
  plugins: [react(), tailwindcss(), viteStaticCopyPyodide()],

  build: {
    outDir: 'dist',

    rollupOptions: {
      input: {
        popup: 'src/pages/popup/popup.html',
        // viewer: 'public/html/pages/playlist_viewer.html',
        sidePanel: 'src/pages/side_panel/side-panel.html',

        // scripts
        contentScript: resolve(__dirname, 'src/scripts/content/contentScript.ts'),
        contentFavButton: resolve(__dirname, 'src/scripts/content/contentFavButton.ts'),
        background: resolve(__dirname, 'src/scripts/background/background.ts'),
      },

      output: {
        // put UI bundles in app/ui/
        entryFileNames(chunk) {
          if (chunk.name === 'background') return 'assets/app/scripts/background/[name].js';

          if (chunk.name === 'contentScript' || chunk.name === 'contentFavButton')
            return 'assets/app/scripts/content/[name].js';

          return 'assets/app/ui/[name].js';
        },

        chunkFileNames(chunkInfo) {
          // Never create shared chunks for content scripts
          if (chunkInfo.facadeModuleId?.includes('content/')) {
            return 'assets/app/scripts/content/[name].js';
          }

          // background cannot use shared chunks either
          if (chunkInfo.facadeModuleId?.includes('background/')) {
            return 'assets/app/scripts/background/[name].js';
          }

          // UI can share chunks
          return 'assets/app/bundler/[name]-[hash].js';
        },

        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
