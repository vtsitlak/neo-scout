import {
  colorSchemeDarkBlue,
  colorSchemeLightCold,
  themeQuartz,
} from 'ag-grid-community';
import type { ThemeMode } from '@neo-scout/stores/theme';

const sharedParams = {
  fontFamily: 'var(--font-sans)',
  accentColor: 'var(--ns-primary)',
  borderColor: 'var(--ns-border)',
  spacing: 10,
};

const light = themeQuartz.withPart(colorSchemeLightCold).withParams({
  ...sharedParams,
  backgroundColor: 'var(--ns-bg-elevated)',
  foregroundColor: 'var(--ns-fg)',
  headerBackgroundColor: 'var(--ns-grid-header)',
  headerTextColor: 'var(--ns-fg-muted)',
  rowHoverColor: 'var(--ns-grid-row-hover)',
});

const dark = themeQuartz.withPart(colorSchemeDarkBlue).withParams({
  ...sharedParams,
  backgroundColor: 'var(--ns-bg-elevated)',
  foregroundColor: 'var(--ns-fg)',
  headerBackgroundColor: 'var(--ns-grid-header)',
  headerTextColor: 'var(--ns-fg-muted)',
  rowHoverColor: 'var(--ns-grid-row-hover)',
});

export function scoutGridThemeFor(mode: ThemeMode) {
  return mode === 'dark' ? dark : light;
}
