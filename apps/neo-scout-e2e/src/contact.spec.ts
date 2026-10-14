import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('neo-contact')).toBeVisible({ timeout: 60_000 });
  });

  test('shows company details and the inquiry form', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Contact NEO Scout' }),
    ).toBeVisible();
    await expect(
      page.getByRole('complementary', { name: 'Company contact details' }),
    ).toBeVisible();
    await expect(
      page.getByRole('form', { name: 'Contact inquiry form' }),
    ).toBeVisible();
  });

  test('submits a valid inquiry and allows sending another', async ({
    page,
  }) => {
    await page.getByLabel('Name', { exact: true }).fill('Ada Lovelace');
    await page.getByLabel('Work email').fill('ada@example.com');
    await page
      .getByRole('textbox', { name: 'Company' })
      .fill('Analytical Engines');
    await page.getByLabel('Employee count').selectOption({ value: '11-50' });
    await page
      .getByLabel('Message', { exact: true })
      .fill('I would like to learn more about NEO Scout.');

    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByLabel('Message sent successfully')).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByText(/Thanks — your message was sent/i),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Send another message' }).click();
    await expect(
      page.getByRole('form', { name: 'Contact inquiry form' }),
    ).toBeVisible();
  });
});
