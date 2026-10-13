import { test, expect } from '@playwright/test';

test.describe('NEO Scout app shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('img', { name: 'NEO Scout' }).first(),
    ).toBeVisible({
      timeout: 60_000,
    });
  });

  test('shows the document title and brand logos', async ({ page }) => {
    await expect(page).toHaveTitle(/NEO Scout/);
    await expect(page.getByRole('img', { name: 'NEO Scout' })).toHaveCount(2);
  });

  test('toggles between light and dark themes', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /Dark mode|Light mode/i });

    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(
      page.getByRole('button', { name: /Light mode/i }),
    ).toBeVisible();
  });

  test('shows the community stack grid', async ({ page }) => {
    const grid = page.getByRole('grid');

    await expect(grid).toBeVisible();
    await expect(
      grid.getByRole('columnheader', { name: 'Name' }),
    ).toBeVisible();
    await expect(
      grid.getByRole('columnheader', { name: 'Status' }),
    ).toBeVisible();
    await expect(
      grid.getByRole('gridcell', { name: 'Workspace' }),
    ).toBeVisible();
    await expect(
      grid.getByRole('gridcell', { name: 'Initialized' }),
    ).toBeVisible();
    await expect(grid.getByRole('gridcell', { name: 'PrimeNG' })).toBeVisible();
    await expect(
      grid.getByRole('gridcell', { name: 'AG Grid Community' }),
    ).toBeVisible();
  });
});
