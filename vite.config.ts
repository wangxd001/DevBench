import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'DevBench - Developer & Tester Toolbox',
        short_name: 'DevBench',
        theme_color: '#426A91',
        background_color: '#F6F8FA',
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
    alias: { '@': resolve(__dirname, './src') },
  },
});
