import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('工具页', () => {
  test('直接访问工具路由可打开', async ({ page }) => {
    await gotoAndWait(page, '/tools/uuid-generator');
    await expect(page.locator('h1')).toContainText(/UUID/);
  });

  test('浏览器前进后退', async ({ page }) => {
    await gotoAndWait(page, '/tools/json-formatter');
    await page.goto('/tools/uuid-generator');
    await expect(page).toHaveURL('/tools/uuid-generator');

    await page.goBack();
    await expect(page).toHaveURL('/tools/json-formatter');

    await page.goForward();
    await expect(page).toHaveURL('/tools/uuid-generator');
  });

  test('页面刷新后保留路由', async ({ page }) => {
    await gotoAndWait(page, '/tools/regex-tester');
    await page.reload();
    await page.locator('aside').waitFor();
    await expect(page).toHaveURL('/tools/regex-tester');
  });
});
