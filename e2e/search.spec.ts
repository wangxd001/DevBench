import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('全局搜索', () => {
  test('输入关键词展示结果', async ({ page }) => {
    await gotoAndWait(page, '/search?query=json');
    const results = page.locator('ul li a');
    await expect(results.first()).toBeVisible();
    await expect(results.first()).toContainText(/JSON 格式化/);
  });

  test('无结果时展示目录入口', async ({ page }) => {
    await gotoAndWait(page, '/search?query=zzzzzz');
    await expect(page.getByText('未找到相关工具')).toBeVisible();
    await expect(page.getByRole('link', { name: '浏览完整工具目录' })).toBeVisible();
  });

  test('Ctrl+K 跳转到搜索页', async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.keyboard.press('Control+k');
    await expect(page).toHaveURL('/search');
  });
});
