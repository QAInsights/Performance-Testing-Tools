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
  const palette = page.getByRole('dialog', { name: 'COMMAND PALETTE' });
  const backdrop = page.locator('.palette-backdrop');
  await expect(palette).toBeVisible();
  await expect(backdrop).toHaveCSS('position', 'fixed');
  await expect
    .poll(() =>
      backdrop.evaluate((element) => ({
        zIndex: getComputedStyle(element).zIndex,
      })),
    )
    .toMatchObject({ zIndex: '20' });
  await expect
    .poll(() =>
      palette.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.top >= 0 && box.bottom <= window.innerHeight;
      }),
    )
    .toBe(true);
  const toolLabels = await page
    .locator('.palette-item')
    .evaluateAll((items) =>
      items
        .map((item) => item.textContent)
        .filter((label): label is string => Boolean(label)),
    );
  expect(new Set(toolLabels).size).toBe(toolLabels.length);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.palette-item:focus')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.palette-item:focus')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();
});

test('released-date sorting puts undated tools last', async ({ page }) => {
  await page.goto('/Performance-Testing-Tools/');
  await page.getByLabel('Sort tools').selectOption('released');
  await expect(page.locator('[data-tool-list] tr').first()).toHaveAttribute(
    'data-tool',
    'loadrunner-professional',
  );
  await expect(page.locator('[data-tool-list] tr').last()).toHaveAttribute(
    'data-released',
    '',
  );
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
  await page.goto('/Performance-Testing-Tools/tools/grafana-k6/');
  await expect(page.locator('.badge').first()).toHaveClass(/badge/);
  await expect(page.locator('.profile-line')).toHaveCSS('fill', 'none');
  await page.goto(
    '/Performance-Testing-Tools/compare?tools=apache-jmeter,grafana-k6',
  );
  await expect(page.locator('.matrix-table')).toBeVisible();
  await expect(page.locator('.matrix-table thead th')).toHaveCount(3);
  await expect(page.locator('.matrix-table td').first()).toHaveCSS(
    'padding-top',
    '15px',
  );
  await expect(page.locator('.matrix-profile-line')).toHaveCount(2);
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
  await page.locator('[data-compare="locust"]').first().check();
  await page
    .locator('[data-compare="loadrunner-professional"]')
    .first()
    .click();
  await expect(page.locator('[data-compare-feedback]')).toHaveText(
    'Maximum 3 tools',
  );
  await page.goto('/Performance-Testing-Tools/about/');
  await page.goto('/Performance-Testing-Tools/');
  await expect(page.locator('[data-compare-tray]')).toBeVisible();
  await expect(page.locator('[data-compare-chips]')).toContainText(
    'Grafana k6',
  );
});
