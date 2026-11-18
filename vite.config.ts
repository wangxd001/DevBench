import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Vite 8 configLoader native：用 fileURLToPath(import.meta.url) 取配置目录
// （Windows 下 new URL().pathname 带前导斜杠，resolve 会失效）
const __dirname = fileURLToPath(new URL('.', import.meta.url));

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
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
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
    alias: { '@': resolve(__dirname, 'src') },
    // 确保 react / react-dom 只存在一个实例（避免 Invalid hook call）
    dedupe: ['react', 'react-dom'],
  },
});
