import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages':      resolve(__dirname, 'src/pages'),
      '@context':    resolve(__dirname, 'src/context'),
      '@hooks':      resolve(__dirname, 'src/hooks'),
      '@services':   resolve(__dirname, 'src/services'),
      '@assets':     resolve(__dirname, 'src/assets'),
      '@utils':      resolve(__dirname, 'src/utils'),
      '@i18n':       resolve(__dirname, 'src/i18n'),
    },
  },
  server: {
    port: 5173,
  },
});
