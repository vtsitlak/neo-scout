import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { SCOUT_API_URL } from '@neo-scout/api';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { appRoutes } from './app.routes';
import { scoutApiUrl } from './config/scout-api.url';
import { NeoScoutPreset } from './theme/neo-scout.preset';

/** AG Grid Community only — do not register Enterprise modules. */
ModuleRegistry.registerModules([AllCommunityModule]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(appRoutes),
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
