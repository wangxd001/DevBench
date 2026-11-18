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

// 手动指定备用端口（残留 server 占 4173/5173 时可切到 4175/5175 等）
const DEV_PORT_OVERRIDE = process.env.DEV_PORT ? Number(process.env.DEV_PORT) : undefined;
const PREVIEW_PORT_OVERRIDE = process.env.PREVIEW_PORT ? Number(process.env.PREVIEW_PORT) : undefined;

const devPort = DEV_PORT_OVERRIDE ?? DEV_PORT;
const previewPort = PREVIEW_PORT_OVERRIDE ?? PREVIEW_PORT;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${devPort}`,
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
      use: { ...devices['Desktop Chrome'], channel: 'chrome', baseURL: `http://localhost:${previewPort}` },
      webServer: {
        command: `npx vite preview --port ${previewPort} --strictPort`,
        url: `http://localhost:${previewPort}`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
    },
  ],
  webServer: {
    command: `npx vite --port ${devPort} --strictPort`,
    url: `http://localhost:${devPort}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
