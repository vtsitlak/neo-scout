import { ScoutCandidate } from '@neo-scout/api';

/** Sortable Scout candidate fields. */
export type ScoutSortField = keyof ScoutCandidate;

export type ScoutSortDirection = 'asc' | 'desc';

export interface ScoutSort {
  field: ScoutSortField;
  direction: ScoutSortDirection;
}

/**
 * Client-side filter criteria.
 * Omit / leave undefined to skip a criterion.
 */
export interface ScoutFilter {
  /** Minimum NEO score (inclusive). */
  minNeoScore?: number;
  /** Minimum PHA score (inclusive). */
  minPhaScore?: number;
  /** When true, only candidates with a non-null close-approach distance. */
  hasCloseApproach?: boolean;
}

export const DEFAULT_SCOUT_PAGE_SIZE = 20;

export interface ScoutState {
  candidates: ScoutCandidate[];
  selectedId: string | null;
  searchQuery: string;
  filter: ScoutFilter;
  sort: ScoutSort;
  pageSize: number;
  /** How many filtered rows are currently visible (load-more window). */
  visibleCount: number;
  isLoadingAll: boolean;
  isLoadingById: boolean;
  /** True while a load-more window expansion is in progress. */
  isLoadingMore: boolean;
  error: unknown | null;
  /** Pending get-by-id after a list load finishes. */
  pendingSelectedId: string | null;
}
