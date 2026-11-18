import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('离线访问', () => {
  test('PWA 缓存后可离线打开工具页', async ({ context, page }) => {
    // 正常访问触发 PWA 首次缓存
    await gotoAndWait(page, '/');
    await page.goto('/tools/json-formatter');
    await page.locator('aside').waitFor();
    await page.waitForTimeout(2000);

    // 切到离线
    await context.setOffline(true);

    // 重访工具路由（通过缓存 fallback）
    const resp = await page.goto('/tools/uuid-generator', { waitUntil: 'domcontentloaded' });
    expect(resp?.ok() ?? false).toBe(true);
    await page.locator('aside').waitFor();
    await expect(page.locator('h1')).toContainText(/UUID/);
  });
});
