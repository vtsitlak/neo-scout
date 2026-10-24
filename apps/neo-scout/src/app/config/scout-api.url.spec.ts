import { isDevMode } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scoutApiUrl } from './scout-api.url';

vi.mock('@angular/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/core')>();
  return {
    ...actual,
    isDevMode: vi.fn(),
  };
});

describe('scoutApiUrl', () => {
  beforeEach(() => {
    vi.mocked(isDevMode).mockReset();
  });

  afterEach(() => {
    document.head.querySelectorAll('base').forEach((el) => el.remove());
  });

  it('should return the dev proxy path in development', () => {
    vi.mocked(isDevMode).mockReturnValue(true);

    expect(scoutApiUrl()).toBe('/api/scout');
  });

  it('should return scout.api.json under the document base href in production', () => {
    vi.mocked(isDevMode).mockReturnValue(false);
    const base = document.createElement('base');
    base.setAttribute('href', '/neo-scout/');
    document.head.appendChild(base);

    expect(scoutApiUrl()).toBe('/neo-scout/scout.api.json');
  });

  it('should normalize a base href without a trailing slash', () => {
    vi.mocked(isDevMode).mockReturnValue(false);
    const base = document.createElement('base');
    base.setAttribute('href', '/neo-scout');
    document.head.appendChild(base);

    expect(scoutApiUrl()).toBe('/neo-scout/scout.api.json');
  });
});
