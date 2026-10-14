import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { OverlayBadge } from 'primeng/overlaybadge';

@Component({
  selector: 'neo-scout-toolbar',
  imports: [Button, IconField, InputIcon, InputText, OverlayBadge],
  templateUrl: './scout-toolbar.html',
  styleUrl: './scout-toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class ScoutToolbar {
  readonly searchQuery = input<string>('');
  /** Number of applied filter criteria; badge shows when > 0. */
  readonly activeFilterCount = input(0);

  readonly searchQueryChange = output<string>();
  readonly openFilters = output<void>();
  readonly refresh = output<void>();

  protected readonly filterBadgeDisabled = computed(
    () => this.activeFilterCount() <= 0,
  );

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQueryChange.emit(value);
  }

  protected onFilterClick(): void {
    this.openFilters.emit();
  }

  protected onRefreshClick(): void {
    this.refresh.emit();
  }
}
