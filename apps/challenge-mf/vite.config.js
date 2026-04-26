import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 4000,
    cors: true,
  },
  define: {
    'process.env': {},
  },
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/entry-client.tsx'),
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'lib/entry-client.mjs',
      },
    },
  },
});
