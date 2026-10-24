import {
  colorSchemeDarkBlue,
  colorSchemeLightCold,
  themeQuartz,
} from 'ag-grid-community';
import type { ThemeMode } from '@neo-scout/stores/theme';

/**
 * App-level Quartz themes (scheme parts only).
 * Scout page colors are set in `scout.css` via `--ag-*` → `--color-ns-*`.
 */
export const neoScoutGridThemeLight = themeQuartz
  .withPart(colorSchemeLightCold)
  .withParams({ spacing: 10 });

export const neoScoutGridThemeDark = themeQuartz
  .withPart(colorSchemeDarkBlue)
  .withParams({ spacing: 10 });

export function gridThemeFor(mode: ThemeMode) {
  return mode === 'dark' ? neoScoutGridThemeDark : neoScoutGridThemeLight;
}
