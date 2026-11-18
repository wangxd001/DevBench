import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('离线访问（preview 构建资源）', () => {
  test('PWA 缓存后可离线打开工具页', async ({ context, page }) => {
    // 正常访问：注册 build SW（sw.js）并完成预缓存
    await gotoAndWait(page, '/');
    await page.goto('/tools/json-formatter');
    await page.locator('aside').waitFor();
    // 等 build SW 激活 + 预缓存完成（registerType: 'prompt' 仍自动注册 SW，
    // 更新提示走 virtual:pwa-register 的 prompt API，不影响本次缓存）
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForTimeout(3000);

    // 切到离线
    await context.setOffline(true);

    // 重新打开工具路由：SW navigateFallback 命中缓存的 index.html，
    // 再走 React Router 渲染工具页
    const resp = await page.goto('/tools/uuid-generator', {
      waitUntil: 'domcontentloaded',
    });
    expect(resp?.ok() ?? false).toBe(true);
    await page.locator('aside').waitFor();
    await expect(page.locator('h1')).toContainText(/UUID/);
  });
});
