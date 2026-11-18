import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('404 页面', () => {
  test('未知路由展示 404', async ({ page }) => {
    await gotoAndWait(page, '/nonexistent-page');
    await expect(page.locator('h1')).toHaveText('页面未找到');
  });

  test('返回首页链接', async ({ page }) => {
    await gotoAndWait(page, '/unknown');
    await page.getByRole('link', { name: '返回首页' }).click();
    await expect(page).toHaveURL('/');
  });
});
