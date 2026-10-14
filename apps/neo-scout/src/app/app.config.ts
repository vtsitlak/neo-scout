import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { DEFAULT_SCOUT_API_URL, SCOUT_API_URL } from '@neo-scout/api';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { appRoutes } from './app.routes';
import { NeoScoutPreset } from './theme/neo-scout.preset';

/** AG Grid Community only — do not register Enterprise modules. */
ModuleRegistry.registerModules([AllCommunityModule]);

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
      // Dev serve proxies /api/scout → JPL (no CORS). Production still hits JPL directly.
      useFactory: () => (isDevMode() ? '/api/scout' : DEFAULT_SCOUT_API_URL),
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
