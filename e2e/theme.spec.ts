import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('主题切换', () => {
  test('切换主题并持久化', async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.evaluate(() => localStorage.clear());

    // TopBar 主题按钮：浅色时显示 "🌙 深色"，aria-label 为 i18n key
    const themeBtn = page.getByRole('button').filter({ hasText: /深色|dark/i }).first();
    await themeBtn.click();
    const prefs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.preferences') ?? '{}')
    );
    expect(prefs.theme).toBe('dark');

    await page.reload();
    await page.locator('aside').waitFor();
    const htmlAttr = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(htmlAttr).toBe('dark');
  });

  test('切换回浅色', async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.evaluate(() => localStorage.clear());
    await page.getByRole('button').filter({ hasText: /深色|dark/i }).first().click();
    await page.getByRole('button').filter({ hasText: /浅色|light/i }).first().click();
    const prefs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.preferences') ?? '{}')
    );
    expect(prefs.theme).toBe('light');
  });
});
