import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve, fileURLToPath } from 'node:url';

// Vite 8 configLoader native：用 fileURLToPath(import.meta.url) 取配置目录
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    pool: 'vmThreads',
  },
});
