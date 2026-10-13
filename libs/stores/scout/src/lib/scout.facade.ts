import { inject, Injectable } from '@angular/core';
import {
  ScoutFilter,
  ScoutSortDirection,
  ScoutSortField,
} from './scout.models';
import { ScoutStore } from './scout.store';

/**
 * Public entry point for Scout list/detail state.
 * Components and features should inject this facade — not the store or data service.
 */
@Injectable({ providedIn: 'root' })
export class ScoutFacade {
  readonly #store = inject(ScoutStore);

  /** Full in-memory list from the last successful load/reload. */
  readonly candidates = this.#store.candidates;

  /** Filtered + searched + sorted list (before load-more window). */
  readonly filteredCandidates = this.#store.filteredCandidates;

  /** Visible slice for the current load-more window. */
  readonly visibleCandidates = this.#store.visibleCandidates;

  readonly selectedCandidate = this.#store.selectedCandidate;
  readonly selectedId = this.#store.selectedId;

  readonly searchQuery = this.#store.searchQuery;
  readonly filter = this.#store.filter;
  readonly sort = this.#store.sort;

  readonly pageSize = this.#store.pageSize;
  readonly visibleCount = this.#store.visibleCount;
  readonly hasMore = this.#store.hasMore;
  readonly totalFiltered = this.#store.totalFiltered;

  readonly isLoadingAll = this.#store.isLoadingAll;
  readonly isLoadingById = this.#store.isLoadingById;
  readonly isLoadingMore = this.#store.isLoadingMore;
  readonly error = this.#store.error;

  loadAll(): void {
    this.#store.loadAll();
  }

  /** Force a fresh fetch from the Scout API. */
  reload(): void {
    this.#store.reload();
  }

  getById(objectName: string): void {
    this.#store.getById(objectName);
  }

  clearSelection(): void {
    this.#store.clearSelection();
  }

  setSearch(query: string): void {
    this.#store.setSearch(query);
  }

  setFilter(filter: ScoutFilter): void {
    this.#store.setFilter(filter);
  }

  patchFilter(partial: Partial<ScoutFilter>): void {
    this.#store.patchFilter(partial);
  }

  setSort(field: ScoutSortField, direction?: ScoutSortDirection): void {
    this.#store.setSort(field, direction);
  }

  loadMore(): void {
    this.#store.loadMore();
  }

  resetVisible(): void {
    this.#store.resetVisible();
  }

  handleError(error: unknown): void {
    this.#store.handleError(error);
  }
}
