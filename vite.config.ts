import * as path from 'path';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';

const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/components') !== -1;
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
    svgr(),
    tailwindcss()
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 10000,
    target: 'es2020',
  },
  base: '/web'
})