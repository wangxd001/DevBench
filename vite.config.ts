import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import { dirname } from 'path';

// Vite 8: configLoader 'native' 下 __dirname 不可用，用 import.meta.dirname
const configDir = dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'DevBench - Developer & Tester Toolbox',
        short_name: 'DevBench',
        description: '面向开发人员和测试人员的在线工具箱',
        theme_color: '#426A91',
        background_color: '#F6F8FA',
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'devbench-static',
              expiration: { maxEntries: 100 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': resolve(configDir, './src') },
  },
});
