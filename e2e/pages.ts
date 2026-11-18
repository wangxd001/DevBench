import { type Page, type BrowserContext } from '@playwright/test';

export async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  // 等待 React 水合完成：sidebar 出现即代表 AppShell 已渲染
  await page.locator('aside').waitFor();
}

export async function clearLocalStorage(context: BrowserContext): Promise<void> {
  for (const p of context.pages()) {
    await p.evaluate(() => localStorage.clear());
  }
}
