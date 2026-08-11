import { expect, test } from '@playwright/test';

test('directory loads under the project base path', async ({ page }) => {
  await page.goto('/Performance-Testing-Tools/');
  await expect(page).toHaveTitle('Performance Testing Tools');
  await expect(
    page.getByRole('heading', { name: 'Performance testing tools' }),
  ).toBeVisible();
});
