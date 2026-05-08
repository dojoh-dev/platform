import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  base: '/',
  plugins: [devtools(), solidPlugin()],
  server: {
    port: 3000,
    host: true,

    allowedHosts: ['127.0.0.1', '.a.run.app', 'dojoh.dev'],
  },
  preview: {
    port: 3000,
    host: true,

    allowedHosts: ['.a.run.app', 'dojoh.dev'],
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
