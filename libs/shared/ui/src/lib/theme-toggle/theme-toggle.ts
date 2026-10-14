import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ThemeStore } from '@neo-scout/stores/theme';
import { Button } from 'primeng/button';

@Component({
  selector: 'neo-theme-toggle',
  imports: [Button],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  private readonly themeStore = inject(ThemeStore);

  /** Dark mode shows sun (switch to light); light mode shows moon. */
  protected readonly isDark = computed(() => this.themeStore.mode() === 'dark');

  protected toggle(): void {
    this.themeStore.setMode(this.isDark() ? 'light' : 'dark');
  }
}
