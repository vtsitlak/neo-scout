import { test, expect } from '@playwright/test';

test.describe('NEO Scout app shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { level: 1, name: 'NEO Scout' }),
    ).toBeVisible({ timeout: 60_000 });
  });

  test('shows the document and page titles', async ({ page }) => {
    await expect(page).toHaveTitle(/NEO Scout/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'NEO Scout' }),
    ).toBeVisible();
  });

  test('shows the stack-ready action', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /Stack ready/i }),
    ).toBeDisabled();
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
