import { defineConfig, devices } from '@playwright/test';

// 使用 dev server（vite）而非 prod build（vite preview）：
// Vite 8 + React 19 的 prod build 有 useRef null bug（Rolldown 打包问题），
// dev 模式正常渲染。待 Vite 上游修复后改回 preview。
//
// 注意：如果本地已有其他 vite 实例占用 5173-5175，Playwright 会复用。
// 建议跑 E2E 前关闭多余的 vite 实例，避免 stale 缓存导致 "Invalid hook call"。
const DEV_PORT = 5173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${DEV_PORT}`,
    channel: 'chrome',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: `npx vite --port ${DEV_PORT} --strictPort`,
    url: `http://localhost:${DEV_PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
