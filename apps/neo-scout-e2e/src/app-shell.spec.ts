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

  test('shows the document title, header, logos, and footer', async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/NEO Scout/);
    await expect(page.locator('neo-header-navigation')).toBeVisible();
    await expect(page.getByRole('img', { name: 'NEO Scout' })).toHaveCount(2);
    await expect(page.locator('neo-info-footer')).toBeVisible();
  });

  test('shows home intro and CTAs to Scout and Contact', async ({ page }) => {
    await expect(page.locator('neo-home')).toBeVisible();
    await expect(
      page.getByText(/near-Earth asteroid candidates/i),
    ).toBeVisible();

    await page.getByRole('main').getByRole('button', { name: 'Scout' }).click();
    await expect(page).toHaveURL(/\/scout$/);

    await page.getByRole('button', { name: 'NEO Scout home' }).click();
    await expect(page).toHaveURL(/\/$/);

    await page
      .getByRole('main')
      .getByRole('button', { name: 'Contact' })
      .click();
    await expect(page).toHaveURL(/\/contact$/);
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

    await expect(page.locator('neo-home')).toBeVisible();

    await nav.getByRole('button', { name: 'Scout' }).click();
    await expect(page).toHaveURL(/\/scout$/);
    await expect(page.locator('neo-scout')).toBeVisible();
    await expect(page.locator('ag-grid-angular')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText(/^Showing \d+–\d+ of \d+$/)).toBeVisible();

    await nav.getByRole('button', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('neo-contact')).toBeAttached();

    await page.getByRole('button', { name: 'NEO Scout home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('neo-home')).toBeVisible();
  });
});
