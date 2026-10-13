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

  test('shows the document title, header, logo, and footer', async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/NEO Scout/);
    await expect(page.locator('neo-header-navigation')).toBeVisible();
    await expect(page.getByRole('img', { name: 'NEO Scout' })).toHaveCount(1);
    await expect(page.locator('neo-info-footer')).toBeVisible();
  });

  test('toggles between light and dark themes', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Toggle color theme' });

    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('navigates between lazy-loaded pages from the header', async ({
    page,
  }) => {
    const nav = page.getByRole('navigation', { name: 'Primary' });

    // Empty stub hosts have no box; assert attachment + URL instead of visibility.
    await expect(page.locator('neo-home')).toBeAttached();

    await nav.getByRole('button', { name: 'Scout' }).click();
    await expect(page).toHaveURL(/\/scout$/);
    await expect(page.locator('neo-scout')).toBeAttached();

    await nav.getByRole('button', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('neo-contact')).toBeAttached();

    await page.getByRole('button', { name: 'NEO Scout home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('neo-home')).toBeAttached();
  });
});
