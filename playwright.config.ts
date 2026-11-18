import { defineConfig, devices } from '@playwright/test';

// 使用 dev server（vite）运行 E2E，启动快。
// 注：Vite 8 + React 19 曾因预打包产生两份 React（useRef null / Invalid hook call），
// 已在 vite.config.ts 用 resolve.dedupe 修复，dev 与 preview 均可正常渲染。
//
// 注意：如果本地已有其他 vite 实例占用 5173，Playwright 会复用（reuseExistingServer）。
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
