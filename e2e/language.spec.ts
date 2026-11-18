import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('语言切换', () => {
  test('切换到英文', async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.evaluate(() => localStorage.clear());
    // TopBar 语言按钮：中文时显示 "EN"
    const langBtn = page.getByRole('button', { name: 'Switch to English' });
    await langBtn.click();
    const prefs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.preferences') ?? '{}')
    );
    expect(prefs.language).toBe('en-US');
  });

  test('切换回中文', async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.evaluate(() => localStorage.clear());
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.getByRole('button', { name: '切换到简体中文' }).click();
    const prefs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.preferences') ?? '{}')
    );
    expect(prefs.language).toBe('zh-CN');
  });
});
