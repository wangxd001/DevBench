import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('工具目录', () => {
  test('展示 6 个分类', async ({ page }) => {
    await gotoAndWait(page, '/tools');
    await expect(page.locator('section')).toHaveCount(6);
  });

  test('展示 20 个工具卡片', async ({ page }) => {
    await gotoAndWait(page, '/tools');
    await expect(page.locator('section ul li')).toHaveCount(20);
  });

  test('点击工具卡片进入工具页', async ({ page }) => {
    await gotoAndWait(page, '/tools');
    await page.getByRole('link', { name: /JSON 格式化/ }).first().click();
    await expect(page).toHaveURL('/tools/json-formatter');
  });
});
