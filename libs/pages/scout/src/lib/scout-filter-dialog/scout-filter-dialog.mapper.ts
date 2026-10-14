import { ScoutFilter } from '@neo-scout/stores/scout';

/** Dialog form model — null scores mean “not set” in the inputs. */
export interface ScoutFilterDraft {
  minNeoScore: number | null;
  minPhaScore: number | null;
  hasCloseApproach: boolean;
}

export function emptyScoutFilterDraft(): ScoutFilterDraft {
  return {
    minNeoScore: null,
    minPhaScore: null,
    hasCloseApproach: false,
  };
}

export function scoutFilterToDraft(filter: ScoutFilter): ScoutFilterDraft {
  return {
    minNeoScore: filter.minNeoScore ?? null,
    minPhaScore: filter.minPhaScore ?? null,
    hasCloseApproach: filter.hasCloseApproach === true,
  };
}

function clampScore(value: number | null): number | undefined {
  if (value == null || Number.isNaN(value)) {
    return undefined;
  }
  return Math.min(100, Math.max(0, value));
}

export function draftToScoutFilter(draft: ScoutFilterDraft): ScoutFilter {
  const next: ScoutFilter = {};
  const minNeoScore = clampScore(draft.minNeoScore);
  const minPhaScore = clampScore(draft.minPhaScore);

  if (minNeoScore != null) {
    next.minNeoScore = minNeoScore;
  }
  if (minPhaScore != null) {
    next.minPhaScore = minPhaScore;
  }
  if (draft.hasCloseApproach) {
    next.hasCloseApproach = true;
  }

  return next;
}
