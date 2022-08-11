import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

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
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      svelte(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Tpearl Shop',
          short_name: 'Tpearl',
          description: 'Tpearl shop application',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          lang: 'th',
          start_url: '/',
          scope: '/',
          orientation: 'landscape',
          icons: [
            {
              src: 'logo-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'logo-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
  };
});
