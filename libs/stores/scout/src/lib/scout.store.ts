import { computed, effect, inject } from '@angular/core';
import { ScoutCandidate } from '@neo-scout/api';
import { ErrorToastService } from '@neo-scout/shared/services';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ScoutDataService } from './scout-data.service';
import {
  DEFAULT_SCOUT_PAGE_SIZE,
  ScoutFilter,
  ScoutSort,
  ScoutSortDirection,
  ScoutSortField,
  ScoutState,
} from './scout.models';

const initialState: ScoutState = {
  candidates: [],
  selectedId: null,
  searchQuery: '',
  filter: {},
  sort: { field: 'objectName', direction: 'asc' },
  pageSize: DEFAULT_SCOUT_PAGE_SIZE,
  visibleCount: DEFAULT_SCOUT_PAGE_SIZE,
  isLoadingAll: false,
  isLoadingById: false,
  isLoadingMore: false,
  error: null,
  pendingSelectedId: null,
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
    const filteredCandidates = computed(() => {
      const searched = applySearch(store.candidates(), store.searchQuery());
      const filtered = applyFilter(searched, store.filter());
      return applySort(filtered, store.sort());
    });

    const visibleCandidates = computed(() =>
      filteredCandidates().slice(0, store.visibleCount()),
    );

    const hasMore = computed(
      () => filteredCandidates().length > store.visibleCount(),
    );

    const selectedCandidate = computed(() => {
      const id = store.selectedId();
      if (!id) {
        return null;
      }
      return store.candidates().find((c) => c.objectName === id) ?? null;
    });

    const totalFiltered = computed(() => filteredCandidates().length);

    return {
      filteredCandidates,
      visibleCandidates,
      hasMore,
      selectedCandidate,
      totalFiltered,
    };
  }),
  withMethods(
    (
      store,
      dataService = inject(ScoutDataService),
      errorToast = inject(ErrorToastService),
    ) => ({
      loadAll(): void {
        patchState(store, {
          isLoadingAll: true,
          isLoadingMore: false,
          error: null,
        });
        dataService.load();
      },

      /** Force refresh from the Scout API (same source as loadAll). */
      reload(): void {
        patchState(store, {
          isLoadingAll: true,
          isLoadingMore: false,
          error: null,
        });
        dataService.reload();
      },

      getById(objectName: string): void {
        patchState(store, {
          isLoadingById: true,
          selectedId: objectName,
          error: null,
        });

        const existing = store
          .candidates()
          .find((candidate) => candidate.objectName === objectName);

        if (existing) {
          patchState(store, { isLoadingById: false, pendingSelectedId: null });
          return;
        }

        if (store.candidates().length === 0) {
          patchState(store, { pendingSelectedId: objectName });
          dataService.load();
          return;
        }

        patchState(store, {
          isLoadingById: false,
          selectedId: null,
          pendingSelectedId: null,
        });
      },

      setSearch(query: string): void {
        patchState(store, {
          searchQuery: query,
          visibleCount: store.pageSize(),
          isLoadingMore: false,
        });
      },

      setFilter(filter: ScoutFilter): void {
        patchState(store, {
          filter,
          visibleCount: store.pageSize(),
          isLoadingMore: false,
        });
      },

      patchFilter(partial: Partial<ScoutFilter>): void {
        patchState(store, {
          filter: { ...store.filter(), ...partial },
          visibleCount: store.pageSize(),
          isLoadingMore: false,
        });
      },

      setSort(
        field: ScoutSortField,
        direction: ScoutSortDirection = 'asc',
      ): void {
        patchState(store, {
          sort: { field, direction },
          visibleCount: store.pageSize(),
          isLoadingMore: false,
        });
      },

      loadMore(): void {
        if (!store.hasMore() || store.isLoadingMore()) {
          return;
        }
        patchState(store, { isLoadingMore: true });
        patchState(store, {
          visibleCount: store.visibleCount() + store.pageSize(),
        });
        queueMicrotask(() => {
          patchState(store, { isLoadingMore: false });
        });
      },

      resetVisible(): void {
        patchState(store, {
          visibleCount: store.pageSize(),
          isLoadingMore: false,
        });
      },

      clearSelection(): void {
        patchState(store, {
          selectedId: null,
          pendingSelectedId: null,
          isLoadingById: false,
        });
      },

      handleError(error: unknown): void {
        errorToast.show(toErrorMessage(error));
      },
    }),
  ),
  withHooks({
    onInit(store, dataService = inject(ScoutDataService)) {
      effect(() => {
        const status = dataService.status();
        const loading = dataService.isLoading();

        patchState(store, { isLoadingAll: loading });

        if (status === 'error') {
          const error = dataService.error();
          patchState(store, {
            error,
            isLoadingById: false,
            pendingSelectedId: null,
          });
          store.handleError(error);
          return;
        }

        if (
          status === 'resolved' ||
          status === 'local' ||
          status === 'reloading'
        ) {
          const candidates = dataService.data();
          const pendingId = store.pendingSelectedId();
          patchState(store, {
            candidates,
            error: null,
            isLoadingAll: loading,
          });

          if (pendingId && status !== 'reloading') {
            const found = candidates.some((c) => c.objectName === pendingId);
            patchState(store, {
              selectedId: found ? pendingId : null,
              pendingSelectedId: null,
              isLoadingById: false,
            });
          }
        }
      });
    },
  }),
);

export type ScoutStore = InstanceType<typeof ScoutStore>;
