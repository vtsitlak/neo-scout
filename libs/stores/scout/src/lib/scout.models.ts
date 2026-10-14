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

export interface ScoutState {
  candidates: ScoutCandidate[];
  searchQuery: string;
  filter: ScoutFilter;
  sort: ScoutSort;
  loading: boolean;
  error: unknown | null;
}
