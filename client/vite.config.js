/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

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
