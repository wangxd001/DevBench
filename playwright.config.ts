import { defineConfig, devices } from '@playwright/test';

// 默认用 dev server（vite，端口 5173）跑 E2E，启动快。
// 注：Vite 8 + React 19 曾因预打包产生两份 React（useRef null / Invalid hook call），
// 已在 vite.config.ts 用 resolve.dedupe 修复，dev 与 preview 均可正常渲染。
//
// offline 用例走 'preview' project：vite preview（构建资源）才注册 build 版 Service Worker，
// 离线缓存行为才与生产一致；dev server 不生成/注册 build SW。
// 注意：preview project 启动前需要本地已执行过 `npm run build`（dist/ 存在）。
const DEV_PORT = 5173;
const PREVIEW_PORT = 4173;

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
      testIgnore: ['offline.spec.ts'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'preview',
      testMatch: 'offline.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', baseURL: `http://localhost:${PREVIEW_PORT}` },
      webServer: {
        command: `npx vite preview --port ${PREVIEW_PORT} --strictPort`,
        url: `http://localhost:${PREVIEW_PORT}`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
    },
  ],
  webServer: {
    command: `npx vite --port ${DEV_PORT} --strictPort`,
    url: `http://localhost:${DEV_PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
