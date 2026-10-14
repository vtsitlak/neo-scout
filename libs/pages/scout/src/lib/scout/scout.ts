import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ScoutCandidate } from '@neo-scout/api';
import { ScoutFacade, ScoutFilter } from '@neo-scout/stores/scout';
import { ThemeStore } from '@neo-scout/stores/theme';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GetRowIdParams } from 'ag-grid-community';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { ScoutFilterDialog } from '../scout-filter-dialog/scout-filter-dialog';
import { ScoutToolbar } from '../scout-toolbar/scout-toolbar';
import { SCOUT_COLUMN_DEFS } from './scout-columns';
import { scoutGridThemeFor } from './scout-grid.theme';

@Component({
  selector: 'neo-scout',
  imports: [AgGridAngular, Button, Skeleton, ScoutFilterDialog, ScoutToolbar],
  templateUrl: './scout.html',
  styleUrl: './scout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class Scout {
  private readonly scoutFacade = inject(ScoutFacade);
  private readonly themeStore = inject(ThemeStore);

  readonly columnDefs: ColDef<ScoutCandidate>[] = SCOUT_COLUMN_DEFS;

  readonly defaultColDef: ColDef<ScoutCandidate> = {
    sortable: true,
    resizable: true,
    filter: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  readonly rowData = this.scoutFacade.filteredCandidates;
  readonly loading = this.scoutFacade.loading;
  readonly error = this.scoutFacade.error;
  readonly totalCandidates = this.scoutFacade.totalCandidates;
  readonly totalFilteredCandidates = this.scoutFacade.totalFilteredCandidates;
  readonly searchQuery = this.scoutFacade.searchQuery;
  readonly filter = this.scoutFacade.filter;

  readonly activeFilterCount = computed(() => {
    const current = this.filter();
    let count = 0;
    if (current.minNeoScore != null) {
      count += 1;
    }
    if (current.minPhaScore != null) {
      count += 1;
    }
    if (current.hasCloseApproach === true) {
      count += 1;
    }
    return count;
  });

  readonly filterDialogOpen = signal(false);

  readonly rowSummary = computed(() => {
    const filtered = this.totalFilteredCandidates();
    const total = this.totalCandidates();
    if (filtered === 0) {
      return `Showing 0 of ${total}`;
    }
    return `Showing ${filtered} of ${total} candidates`;
  });

  readonly showInitialSkeleton = computed(
    () => this.loading() && this.totalCandidates() === 0,
  );

  /** Empty API result — not loading and not a failed request. */
  readonly showEmptyState = computed(
    () =>
      this.totalCandidates() === 0 && !this.loading() && this.error() == null,
  );

  readonly gridTheme = computed(() =>
    scoutGridThemeFor(this.themeStore.mode()),
  );

  constructor() {
    this.scoutFacade.loadAll();
  }

  protected onSearchQueryChange(query: string): void {
    this.scoutFacade.setSearch(query);
  }

  protected onOpenFilters(): void {
    this.filterDialogOpen.set(true);
  }

  protected onFilterDialogVisibleChange(open: boolean): void {
    this.filterDialogOpen.set(open);
  }

  protected onFilterChange(filter: ScoutFilter): void {
    this.scoutFacade.setFilter(filter);
  }

  protected refresh(): void {
    this.scoutFacade.reload();
  }

  protected getRowId = (params: GetRowIdParams<ScoutCandidate>): string =>
    params.data.objectName;
}
