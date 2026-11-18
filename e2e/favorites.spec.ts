import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('收藏与置顶', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.evaluate(() => localStorage.clear());
  });

  test('收藏工具并持久化', async ({ page }) => {
    await page.getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();

    const favBtn = page.locator('section ul li').first().getByRole('button');
    await favBtn.click();

    const favs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.favorites') ?? '{}')
    );
    expect(favs.favorites).toHaveLength(1);

    await page.reload();
    await page.locator('aside').waitFor();
    await expect(page.locator('section ul li').first().getByRole('button'))
      .toHaveAttribute('aria-pressed', 'true');
  });

  test('取消收藏', async ({ page }) => {
    await page.getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();

    const favBtn = page.locator('section ul li').first().getByRole('button');
    await favBtn.click();
    await favBtn.click();

    const favs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.favorites') ?? '{}')
    );
    expect(favs.favorites).toHaveLength(0);
  });
});
