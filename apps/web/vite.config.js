import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/challenge-mf': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/challenge-mf/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['/challenge-mf/lib/entry-client.mjs'],
    },
  },
  resolve: {
    alias: {
      '@domains': path.resolve(__dirname, 'src/domains'),
      '@app': path.resolve(__dirname, 'app'),
    },
  },
});
