import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@domains': path.resolve(__dirname, 'src/domains'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@infra': path.resolve(__dirname, 'src/infra'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
});
