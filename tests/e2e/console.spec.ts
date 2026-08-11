import { expect, test } from '@playwright/test';

test('search state is reflected in the URL and command palette opens', async ({
  page,
}) => {
  await page.goto('/Performance-Testing-Tools/');
  await page.getByLabel('Search tools').fill('jmeter');
  await expect(page).toHaveURL(/q=jmeter/);
  await expect(page.locator('tr[data-tool="apache-jmeter"]')).toBeVisible();
  await expect(page.locator('tr[data-tool="grafana-k6"]')).toBeHidden();
  await page
    .getByRole('button', { name: 'Open command palette' })
    .press('Enter');
  await expect(
    page.getByRole('dialog', { name: 'COMMAND PALETTE' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('dialog', { name: 'COMMAND PALETTE' }),
  ).toBeHidden();
});

test('empty state and desktop grid view are usable', async ({ page }) => {
  await page.goto('/Performance-Testing-Tools/');
  await page.getByLabel('Search tools').fill('no-such-performance-tool');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await expect(page.locator('[data-tool-list] tr:visible')).toHaveCount(0);
  await page.getByLabel('Search tools').fill('');
  await page.getByRole('button', { name: 'Grid view' }).click();
  await expect(page.getByRole('button', { name: 'Grid view' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('[data-card-list]')).toBeVisible();
});

test('mobile users can open the shared filter controls', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/Performance-Testing-Tools/');
  await expect(page.locator('.filter-disclosure')).toBeVisible();
  await expect(page.locator('[data-filter="license"]').first()).toBeVisible();
});

test('compare renders a real matrix for two and three tools', async ({
  page,
}) => {
  await page.goto(
    '/Performance-Testing-Tools/compare?tools=apache-jmeter,grafana-k6',
  );
  await expect(page.locator('.matrix-table')).toBeVisible();
  await expect(page.locator('.matrix-table thead th')).toHaveCount(3);
  await page.goto(
    '/Performance-Testing-Tools/compare?tools=apache-jmeter,grafana-k6,locust',
  );
  await expect(page.locator('.matrix-table thead th')).toHaveCount(4);
});

test('compare tray names tools and survives navigation', async ({ page }) => {
  await page.goto('/Performance-Testing-Tools/');
  await page.locator('[data-compare="apache-jmeter"]').first().check();
  await page.locator('[data-compare="grafana-k6"]').first().check();
  await expect(page.locator('[data-compare-tray]')).toBeVisible();
  await expect(page.locator('[data-compare-chips]')).toContainText(
    'Apache JMeter',
  );
  await page.goto('/Performance-Testing-Tools/about/');
  await page.goto('/Performance-Testing-Tools/');
  await expect(page.locator('[data-compare-tray]')).toBeVisible();
  await expect(page.locator('[data-compare-chips]')).toContainText(
    'Grafana k6',
  );
});
