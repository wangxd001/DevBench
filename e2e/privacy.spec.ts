import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('隐私页', () => {
  test('展示标题和 6 条说明', async ({ page }) => {
    await gotoAndWait(page, '/privacy');
    await expect(page.locator('h1')).toHaveText('隐私与安全');
    await expect(page.locator('li')).toHaveCount(6);
  });
});
