import { test, expect, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

async function gotoAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.locator('aside').waitFor();
}

const pages = [
  { path: '/', name: '首页' },
  { path: '/tools', name: '工具目录' },
  { path: '/search?query=json', name: '搜索' },
  { path: '/favorites', name: '收藏' },
  { path: '/recent', name: '最近使用' },
  { path: '/privacy', name: '隐私' },
  { path: '/nonexistent', name: '404' },
];

test.describe('无障碍（axe-core）', () => {
  for (const { path, name } of pages) {
    test(`${name}页无 critical 级违规`, async ({ page }) => {
      await gotoAndWait(page, path);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const violations = result.violations ?? [];
      const critical = violations.filter((v) => v.impact === 'critical');
      expect(critical, JSON.stringify(critical, null, 2)).toHaveLength(0);
    });
  }
});
