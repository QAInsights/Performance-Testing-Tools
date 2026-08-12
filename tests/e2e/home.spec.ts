import { expect, test } from '@playwright/test';
import { sitePath } from './paths';

test('directory loads at the configured site base', async ({ page }) => {
  await page.goto(sitePath());
  await expect(page).toHaveTitle(/Performance Testing Tools Compared \(\d{4}\)/);
  await expect(
    page.getByRole('heading', { name: /\d+ performance testing tools/i }),
  ).toBeVisible();
});

