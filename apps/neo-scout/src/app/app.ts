import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { ThemeToggle } from '@neo-scout/shared/ui';
import { ThemeStore } from '@neo-scout/stores/theme';
import { AppStore } from './app.store';
import { gridThemeFor } from './theme/grid-theme';

type ScoutRow = {
  name: string;
  status: string;
};

@Component({
  imports: [RouterModule, AgGridAngular, NgOptimizedImage, ThemeToggle],
  selector: 'neo-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(AppStore);
  protected readonly themeStore = inject(ThemeStore);

  protected readonly gridTheme = computed(() =>
    gridThemeFor(this.themeStore.mode()),
  );

  /** Compact nav lockup — ThemeStore switch (not OS prefers-color-scheme). */
  readonly logoSrc = computed(() =>
    this.themeStore.mode() === 'dark'
      ? 'brand/logo-dark.svg'
      : 'brand/logo.svg',
  );

  /** Hero lockup. */
  readonly logoLgSrc = computed(() =>
    this.themeStore.mode() === 'dark'
      ? 'brand/logo-lg-dark.svg'
      : 'brand/logo-lg.svg',
  );

  protected readonly columnDefs: ColDef<ScoutRow>[] = [
    { field: 'name', flex: 1 },
    { field: 'status', flex: 1 },
  ];

  protected readonly rowData: ScoutRow[] = [
    { name: 'Workspace', status: 'Initialized' },
    { name: 'PrimeNG', status: 'Ready' },
    { name: 'AG Grid Community', status: 'Ready' },
  ];
}
