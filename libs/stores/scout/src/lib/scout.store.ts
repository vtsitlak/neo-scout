import { computed, inject } from '@angular/core';
import { ScoutCandidate } from '@neo-scout/api';
import { ErrorToastService } from '@neo-scout/shared/services';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ScoutDataService } from './scout-data.service';
import {
  ScoutFilter,
  ScoutSort,
  ScoutSortDirection,
  ScoutSortField,
  ScoutState,
} from './scout.models';

const initialState: ScoutState = {
  candidates: [],
  searchQuery: '',
  filter: {},
  sort: { field: 'objectName', direction: 'asc' },
  loading: false,
  error: null,
};

function applyFilter(
  candidates: ScoutCandidate[],
  filter: ScoutFilter,
): ScoutCandidate[] {
  return candidates.filter((candidate) => {
    if (
      filter.minNeoScore !== undefined &&
      candidate.neoScore < filter.minNeoScore
    ) {
      return false;
    }
    if (
      filter.minPhaScore !== undefined &&
      candidate.phaScore < filter.minPhaScore
    ) {
      return false;
    }
    if (filter.hasCloseApproach === true && candidate.caDist == null) {
      return false;
    }
    if (filter.hasCloseApproach === false && candidate.caDist != null) {
      return false;
    }
    return true;
  });
}

function applySearch(
  candidates: ScoutCandidate[],
  query: string,
): ScoutCandidate[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return candidates;
  }
  return candidates.filter((candidate) =>
    candidate.objectName.toLowerCase().includes(normalized),
  );
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return 1;
  }
  if (b == null) {
    return -1;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function applySort(
  candidates: ScoutCandidate[],
  sort: ScoutSort,
): ScoutCandidate[] {
  const sorted = [...candidates];
  const direction = sort.direction === 'asc' ? 1 : -1;
  sorted.sort(
    (left, right) =>
      direction * compareValues(left[sort.field], right[sort.field]),
  );
  return sorted;
}

function toErrorMessage(error: unknown): string {
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  return 'Something went wrong. Please try again.';
}

export const ScoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    /** Candidates after search, filter, and sort (full list — API returns all rows). */
    const filteredCandidates = computed(() => {
      const searched = applySearch(store.candidates(), store.searchQuery());
      const filtered = applyFilter(searched, store.filter());
      return applySort(filtered, store.sort());
    });

    return {
      filteredCandidates,

      /** Total loaded candidates (before search/filter). */
      totalCandidates: computed(() => store.candidates().length),

      /** Count after search, filter, and sort. */
      totalFilteredCandidates: computed(() => filteredCandidates().length),
    };
  }),
  withMethods(
    (
      store,
      dataService = inject(ScoutDataService),
      errorToast = inject(ErrorToastService),
    ) => {
      async function fetchCandidates(): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const candidates = await dataService.load();
          patchState(store, { candidates, loading: false, error: null });
        } catch (error) {
          patchState(store, { candidates: [], loading: false, error });
          errorToast.show(toErrorMessage(error));
        }
      }

      return {
        loadAll(): void {
          void fetchCandidates();
        },

        /** Force refresh from the Scout API. */
        reload(): void {
          void fetchCandidates();
        },

        setSearch(query: string): void {
          patchState(store, { searchQuery: query });
        },

        setFilter(filter: ScoutFilter): void {
          patchState(store, { filter });
        },

        patchFilter(partial: Partial<ScoutFilter>): void {
          patchState(store, {
            filter: { ...store.filter(), ...partial },
          });
        },

        setSort(
          field: ScoutSortField,
          direction: ScoutSortDirection = 'asc',
        ): void {
          patchState(store, { sort: { field, direction } });
        },

        handleError(error: unknown): void {
          errorToast.show(toErrorMessage(error));
        },
      };
    },
  ),
);

export type ScoutStore = InstanceType<typeof ScoutStore>;
