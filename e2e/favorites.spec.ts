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
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
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
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();

    const favBtn = page.locator('section ul li').first().getByRole('button');
    await favBtn.click();
    await favBtn.click();

    const favs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.favorites') ?? '{}')
    );
    expect(favs.favorites).toHaveLength(0);
  });

  test('点击收藏卡片任意空白位置进入工具页', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();
    await page.locator('section ul li').first().getByRole('button').click();

    await page.getByRole('link', { name: '收藏' }).click();
    const card = page.locator('main ul li').first();
    await expect(card).toBeVisible();

    await card.click({ position: { x: 10, y: 12 } });
    await expect(page).toHaveURL('/tools/json-formatter');
  });

  test('收藏卡片悬浮显示边框，操作按钮不触发跳转', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();
    await page.locator('section ul li').first().getByRole('button').click();

    await page.getByRole('link', { name: '收藏' }).click();
    const card = page.locator('main ul li').first();
    await expect(card).toBeVisible();

    const borderBefore = await card.evaluate((el) => getComputedStyle(el).borderTopColor);
    await card.hover();
    const borderAfter = await card.evaluate((el) => getComputedStyle(el).borderTopColor);
    expect(borderAfter).not.toBe(borderBefore);

    await card.getByRole('button', { name: '置顶' }).click();
    await expect(page).toHaveURL('/favorites');
    await card.getByRole('button', { name: '移除收藏' }).click();
    await expect(page).toHaveURL('/favorites');
    await expect(page.getByText('还没有收藏任何工具')).toBeVisible();
  });
});
