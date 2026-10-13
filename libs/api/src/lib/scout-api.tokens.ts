import { InjectionToken } from '@angular/core';

/** Default NASA/JPL Scout list endpoint. Override in tests or environments. */
export const DEFAULT_SCOUT_API_URL = 'https://ssd-api.jpl.nasa.gov/scout.api';

export const SCOUT_API_URL = new InjectionToken<string>('SCOUT_API_URL', {
  providedIn: 'root',
  factory: () => DEFAULT_SCOUT_API_URL,
});
