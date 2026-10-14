import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { SCOUT_API_URL } from '@neo-scout/api';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { appRoutes } from './app.routes';
import { NeoScoutPreset } from './theme/neo-scout.preset';

/** AG Grid Community only — do not register Enterprise modules. */
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Dev: proxy `/api/scout` → JPL (avoids CORS).
 * Production / GitHub Pages: same-origin snapshot `scout.api.json`
 * (fetched at Pages build time — browsers cannot call JPL Scout directly).
 */
function scoutApiUrl(): string {
  if (isDevMode()) {
    return '/api/scout';
  }
  const baseHref =
    document.querySelector('base')?.getAttribute('href') ?? '/';
  const normalized = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
  return `${normalized}scout.api.json`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    MessageService,
    {
      provide: SCOUT_API_URL,
      useFactory: scoutApiUrl,
    },
    providePrimeNG({
      theme: {
        preset: NeoScoutPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, utilities',
          },
        },
      },
    }),
  ],
};
