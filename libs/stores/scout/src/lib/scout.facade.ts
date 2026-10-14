import { inject, Injectable } from '@angular/core';
import {
  ScoutFilter,
  ScoutSortDirection,
  ScoutSortField,
} from './scout.models';
import { ScoutStore } from './scout.store';

/**
 * Public entry point for Scout list state.
 * Components and features should inject this facade — not the store or data service.
 */
@Injectable({ providedIn: 'root' })
export class ScoutFacade {
  readonly #store = inject(ScoutStore);

  /** Full in-memory list from the last successful load/reload. */
  readonly candidates = this.#store.candidates;

  /** Candidates after search, filter, and sort. */
  readonly filteredCandidates = this.#store.filteredCandidates;

  /** Total loaded candidates (before search/filter). */
  readonly totalCandidates = this.#store.totalCandidates;

  /** Count after search, filter, and sort. */
  readonly totalFilteredCandidates = this.#store.totalFilteredCandidates;

  readonly searchQuery = this.#store.searchQuery;
  readonly filter = this.#store.filter;
  readonly sort = this.#store.sort;
  readonly loading = this.#store.loading;
  readonly error = this.#store.error;

  loadAll(): void {
    this.#store.loadAll();
  }

  /** Force a fresh fetch from the Scout API. */
  reload(): void {
    this.#store.reload();
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

  handleError(error: unknown): void {
    this.#store.handleError(error);
  }
}
