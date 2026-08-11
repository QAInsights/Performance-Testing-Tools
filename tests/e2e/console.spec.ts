import { expect, test } from '@playwright/test';

test('search state is reflected in the URL and command palette opens', async ({ page }) => {
  await page.goto('/Performance-Testing-Tools/');
  await page.getByLabel('Search tools').fill('jmeter');
  await expect(page).toHaveURL(/q=jmeter/);
  await expect(page.locator('tr[data-tool="apache-jmeter"]')).toBeVisible();
  await expect(page.locator('tr[data-tool="grafana-k6"]')).toBeHidden();
  await page.getByRole('button', { name: 'Open command palette' }).press('Enter');
  await expect(page.getByRole('dialog', { name: 'COMMAND PALETTE' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'COMMAND PALETTE' })).toBeHidden();
});
