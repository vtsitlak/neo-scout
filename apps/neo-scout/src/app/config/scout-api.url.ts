import { isDevMode } from '@angular/core';

/**
 * Resolves the Scout HTTP URL for the running app.
 *
 * - Dev: `/api/scout` (dev-server proxy → JPL; avoids browser CORS).
 * - Production / GitHub Pages: same-origin `scout.api.json`
 *   (fetched at Pages build time — browsers cannot call JPL Scout directly).
 */
export function scoutApiUrl(): string {
  if (isDevMode()) {
    return '/api/scout';
  }
  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  const normalized = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
  return `${normalized}scout.api.json`;
}
