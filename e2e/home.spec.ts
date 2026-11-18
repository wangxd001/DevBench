import { test, expect } from '@playwright/test';

async function gotoAndWait(page: import('@playwright/test').Page, path: string): Promise<void> {
  await page.goto(path);
  // 等待 React 水合完成：sidebar 出现即代表 AppShell 已渲染
  await page.locator('aside').waitFor();
}

test.describe('首页', () => {
  test('展示标题和副标题', async ({ page }) => {
    await gotoAndWait(page, '/');
    await expect(page.locator('h1')).toHaveText('DevBench');
    await expect(page.locator('main').getByText('开发者与测试人员工具箱')).toBeVisible();
  });

  test('导航到工具目录', async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
    await expect(page).toHaveURL('/tools');
    await page.locator('section').first().waitFor();
  });
});
