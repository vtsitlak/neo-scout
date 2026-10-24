import {
  colorSchemeDarkBlue,
  colorSchemeLightCold,
  themeQuartz,
} from 'ag-grid-community';
import type { ThemeMode } from '@neo-scout/stores/theme';

/** Quartz + light/dark scheme parts. Colors come from scout.css (--ag-*). */
const light = themeQuartz.withPart(colorSchemeLightCold).withParams({
  spacing: 10,
});

const dark = themeQuartz.withPart(colorSchemeDarkBlue).withParams({
  spacing: 10,
});

export function scoutGridThemeFor(mode: ThemeMode) {
  return mode === 'dark' ? dark : light;
}
