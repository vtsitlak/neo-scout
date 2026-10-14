import { ScoutCandidate } from '@neo-scout/api';

export interface ScoutDetailField {
  key: keyof ScoutCandidate;
  label: string;
}

export interface ScoutDetailSection {
  title: string;
  fields: ScoutDetailField[];
}

/** Grouped fields for the candidate detail dialog (full ScoutCandidate). */
export const SCOUT_DETAIL_SECTIONS: ScoutDetailSection[] = [
  {
    title: 'Scores',
    fields: [
      { key: 'neoScore', label: 'NEO score' },
      { key: 'phaScore', label: 'PHA score' },
      { key: 'neo1kmScore', label: 'NEO 1 km score' },
      { key: 'ieoScore', label: 'IEO score' },
      { key: 'geocentricScore', label: 'Geocentric score' },
      { key: 'tisserandScore', label: 'Tisserand score' },
      { key: 'rating', label: 'Rating' },
    ],
  },
  {
    title: 'Orbit & approach',
    fields: [
      { key: 'moid', label: 'MOID' },
      { key: 'caDist', label: 'Close approach' },
      { key: 'H', label: 'Abs. magnitude (H)' },
      { key: 'Vmag', label: 'Apparent mag.' },
      { key: 'vInf', label: 'v∞' },
    ],
  },
  {
    title: 'Observations',
    fields: [
      { key: 'nObs', label: 'Observations' },
      { key: 'arc', label: 'Arc (days)' },
      { key: 'rmsN', label: 'RMS' },
      { key: 'unc', label: 'Uncertainty' },
      { key: 'uncP1', label: 'Uncertainty (+1 day)' },
    ],
  },
  {
    title: 'Sky position',
    fields: [
      { key: 'ra', label: 'RA' },
      { key: 'dec', label: 'Dec' },
      { key: 'elong', label: 'Elongation' },
      { key: 'rate', label: 'Rate' },
    ],
  },
  {
    title: 'Timing',
    fields: [
      { key: 'lastRun', label: 'Last run' },
      { key: 'tEphem', label: 'Ephemeris time' },
    ],
  },
];

export function formatScoutDetailValue(value: unknown): string {
  if (value == null || value === '') {
    return '—';
  }
  return String(value);
}

/**
 * Equal-weight blend of NEO + PHA interest scores (0–100).
 * Scout scores flag interesting objects; they are not rigorous probabilities.
 */
export function hazardInterest(
  candidate: Pick<ScoutCandidate, 'neoScore' | 'phaScore'>,
): number {
  return Math.round((candidate.neoScore + candidate.phaScore) / 2);
}
