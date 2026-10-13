import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  HeaderNavigation,
  InfoFooter,
  ThemeToggle,
  type MenuItem,
} from '@neo-scout/shared/ui';
import { ThemeStore } from '@neo-scout/stores/theme';
import { Button } from 'primeng/button';
import { APP_INFO } from './app-info.const';

@Component({
  imports: [
    RouterModule,
    NgOptimizedImage,
    Button,
    HeaderNavigation,
    ThemeToggle,
    InfoFooter,
  ],
  selector: 'neo-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly themeStore = inject(ThemeStore);
  protected readonly appInfo = APP_INFO;

  /** Filled when app shell routes are wired. */
  protected readonly navItems: readonly MenuItem[] = [];

  /** Compact nav lockup — ThemeStore switch (not OS prefers-color-scheme). */
  readonly logoSrc = computed(() =>
    this.themeStore.mode() === 'dark'
      ? 'brand/logo-dark.svg'
      : 'brand/logo.svg',
  );
}
