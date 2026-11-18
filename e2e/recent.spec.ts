import { test, expect, type Page } from '@playwright/test';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

test.describe('最近使用', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page, '/');
    await page.evaluate(() => localStorage.clear());
  });

  test('进入工具页后记录最近使用', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();
    await page.getByRole('link', { name: /UUID/ }).first().click();
    await expect(page).toHaveURL('/tools/uuid-generator');

    const recent = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.recent') ?? '[]')
    );
    expect(recent).toHaveLength(1);
    expect(recent[0].toolId).toBe('uuid-generator');
  });

  test('最多保留 10 个', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();

    const toolIds = [
      'json-formatter', 'uuid-generator', 'timestamp-converter',
      'base64-converter', 'url-encoder', 'jwt-decoder',
      'http-header-parser', 'json-diff', 'regex-tester', 'datetime-formatter',
    ];
    for (const id of toolIds) {
      await page.goto(`/tools/${id}`);
      await page.locator('aside').waitFor();
    }

    const recent = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.recent') ?? '[]')
    );
    expect(recent).toHaveLength(10);
    expect(recent[0].toolId).toBe('datetime-formatter');
  });

  test('清空最近使用', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: '工具目录' }).click();
    await page.locator('section').first().waitFor();
    await page.getByRole('link', { name: /UUID/ }).first().click();

    await page.getByRole('link', { name: '最近使用' }).click();
    await page.locator('aside').waitFor();
    await page.getByRole('button', { name: '清空' }).click();

    const recent = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('devbench.recent') ?? '[]')
    );
    expect(recent).toHaveLength(0);
  });
});
