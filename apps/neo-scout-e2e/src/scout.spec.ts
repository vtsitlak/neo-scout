import { test, expect, type Page } from '@playwright/test';

const SCOUT_FIXTURE = {
  data: [
    {
      objectName: 'ALPHA01',
      neoScore: 90,
      phaScore: 10,
      neo1kmScore: 1,
      ieoScore: 2,
      geocentricScore: 3,
      tisserandScore: 4,
      rating: 5,
      moid: '0.01',
      caDist: '1.2',
      H: '22.0',
      Vmag: '20.5',
      nObs: 12,
      arc: '3.0',
      rmsN: '0.4',
      unc: '0.5',
      uncP1: '0.6',
      ra: '01:00',
      dec: '+10',
      elong: '120',
      rate: '2.0',
      vInf: '5.0',
      lastRun: '2026-10-01 00:00',
      tEphem: '2026-10-13 18:30',
    },
    {
      objectName: 'BETA02',
      neoScore: 20,
      phaScore: 5,
      neo1kmScore: 0,
      ieoScore: 0,
      geocentricScore: 0,
      tisserandScore: 0,
      rating: 1,
      moid: '0.2',
      caDist: null,
      H: '25.0',
      Vmag: '21.0',
      nObs: 4,
      arc: '1.0',
      rmsN: '0.8',
      unc: '1.0',
      uncP1: '1.2',
      ra: '02:00',
      dec: '-05',
      elong: '90',
      rate: '1.0',
      vInf: null,
      lastRun: '2026-10-02 00:00',
      tEphem: '2026-10-13 18:30',
    },
    {
      objectName: 'GAMMA03',
      neoScore: 70,
      phaScore: 80,
      neo1kmScore: 2,
      ieoScore: 1,
      geocentricScore: 1,
      tisserandScore: 1,
      rating: 8,
      moid: '0.05',
      caDist: '0.8',
      H: '21.0',
      Vmag: '19.5',
      nObs: 30,
      arc: '10.0',
      rmsN: '0.3',
      unc: '0.2',
      uncP1: '0.3',
      ra: '03:00',
      dec: '+20',
      elong: '140',
      rate: '4.0',
      vInf: '7.0',
      lastRun: '2026-10-03 00:00',
      tEphem: '2026-10-13 18:30',
    },
  ],
  count: '3',
  signature: { source: 'NASA/JPL Scout API', version: '1.3' },
};

async function mockScoutApi(page: Page): Promise<void> {
  // Dev serve proxies NASA Scout via `/api/scout`; production uses scout.api.
  await page.route(/\/(api\/scout|scout\.api)(\?|$)/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(SCOUT_FIXTURE),
    });
  });
}

async function openScout(page: Page): Promise<void> {
  await mockScoutApi(page);
  await page.goto('/scout', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('neo-scout')).toBeVisible({ timeout: 60_000 });
  await expect(page.locator('ag-grid-angular')).toBeVisible({
    timeout: 60_000,
  });
  await expect(page.getByText('Showing 3 of 3 candidates')).toBeVisible();
}

test.describe('Scout page', () => {
  test.beforeEach(async ({ page }) => {
    await openScout(page);
  });

  test('shows the board, toolbar, and fixture rows', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Scout board' }),
    ).toBeVisible();
    await expect(
      page.getByRole('toolbar', { name: 'Scout search and filters' }),
    ).toBeVisible();
    await expect(page.getByText('ALPHA01')).toBeVisible();
    await expect(page.getByText('BETA02')).toBeVisible();
    await expect(page.getByText('GAMMA03')).toBeVisible();
  });

  test('filters the grid by object name search', async ({ page }) => {
    await page.getByLabel('Search by object name').fill('ALPHA');

    await expect(page.getByText('Showing 1 of 3 candidates')).toBeVisible();
    await expect(page.getByText('ALPHA01')).toBeVisible();
    await expect(page.getByText('BETA02')).toHaveCount(0);
    await expect(page.getByText('GAMMA03')).toHaveCount(0);

    await page.getByLabel('Search by object name').fill('');
    await expect(page.getByText('Showing 3 of 3 candidates')).toBeVisible();
  });

  test('applies and clears score filters from the filter dialog', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Filter' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Filter candidates' }),
    ).toBeVisible();

    await page.getByLabel('Minimum NEO score').fill('50');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText('Showing 2 of 3 candidates')).toBeVisible();
    await expect(page.getByText('ALPHA01')).toBeVisible();
    await expect(page.getByText('GAMMA03')).toBeVisible();
    await expect(page.getByText('BETA02')).toHaveCount(0);

    await page.getByRole('button', { name: 'Filter' }).click();
    await page.getByRole('button', { name: 'Clear' }).click();

    await expect(page.getByText('Showing 3 of 3 candidates')).toBeVisible();
    await expect(page.getByText('BETA02')).toBeVisible();
  });

  test('opens candidate detail from a grid row and closes it', async ({
    page,
  }) => {
    await page.locator('.ag-row').filter({ hasText: 'ALPHA01' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('ALPHA01').first()).toBeVisible();
    await expect(dialog.getByText(/Hazard interest:\s*50/)).toBeVisible();
    await expect(
      dialog.getByRole('region', { name: 'Scores' }),
    ).toBeVisible();
    await expect(dialog.getByText('NEO score')).toBeVisible();
    await expect(dialog.getByText('90').first()).toBeVisible();

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toHaveCount(0);
  });
});
