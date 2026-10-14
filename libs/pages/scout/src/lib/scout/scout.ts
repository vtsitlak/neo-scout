import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ScoutCandidate } from '@neo-scout/api';
import { ScoutFacade } from '@neo-scout/stores/scout';
import { ThemeStore } from '@neo-scout/stores/theme';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GetRowIdParams } from 'ag-grid-community';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { SCOUT_COLUMN_DEFS } from './scout-columns';
import { scoutGridThemeFor } from './scout-grid.theme';

@Component({
  selector: 'neo-scout',
  imports: [AgGridAngular, Button, Skeleton],
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
  };

  readonly rowData = this.scoutFacade.filteredCandidates;
  readonly loading = this.scoutFacade.loading;
  readonly error = this.scoutFacade.error;
  readonly totalCandidates = this.scoutFacade.totalCandidates;
  readonly totalFilteredCandidates = this.scoutFacade.totalFilteredCandidates;

  readonly rowSummary = computed(() => {
    const filtered = this.totalFilteredCandidates();
    const total = this.totalCandidates();
    if (filtered === 0) {
      return `Showing 0 of ${total}`;
    }
    return `Showing 1–${filtered} of ${total}`;
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

  protected refresh(): void {
    this.scoutFacade.reload();
  }

  protected getRowId = (params: GetRowIdParams<ScoutCandidate>): string =>
    params.data.objectName;
}
