import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    rott: '.',
    server: {
      host: true,
      port: 5173,
      open: true,
      hmr: true,
      watch: {},
    },
    build: {},
    plugins: [svelte()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
  };
});
