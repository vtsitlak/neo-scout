import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButton } from 'primeng/togglebutton';
import { ThemeStore } from '@neo-scout/stores/theme';

@Component({
  selector: 'neo-theme-toggle',
  imports: [FormsModule, ToggleButton],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  private readonly themeStore = inject(ThemeStore);

  /** Checked = dark mode; shows sun (switch to light). Unchecked shows moon. */
  protected readonly isDark = computed(() => this.themeStore.mode() === 'dark');

  protected onDarkChange(checked: boolean): void {
    this.themeStore.setMode(checked ? 'dark' : 'light');
  }
}
