import { ScoutCandidate } from '@neo-scout/api';
import { SCOUT_FIELD_META } from '../scout/scout-field-meta';

export interface ScoutDetailField {
  key: keyof ScoutCandidate;
  label: string;
  description: string;
}

export interface ScoutDetailSection {
  title: string;
  fields: ScoutDetailField[];
}

const field = (key: keyof ScoutCandidate): ScoutDetailField => ({
  key,
  label: SCOUT_FIELD_META[key].label,
  description: SCOUT_FIELD_META[key].description,
});

/** Grouped fields for the candidate detail dialog (full ScoutCandidate). */
export const SCOUT_DETAIL_SECTIONS: ScoutDetailSection[] = [
  {
    title: 'Scores',
    fields: [
      field('neoScore'),
      field('phaScore'),
      field('neo1kmScore'),
      field('ieoScore'),
      field('geocentricScore'),
      field('tisserandScore'),
      field('rating'),
    ],
  },
  {
    title: 'Orbit & approach',
    fields: [
      field('moid'),
      field('caDist'),
      field('H'),
      field('Vmag'),
      field('vInf'),
    ],
  },
  {
    title: 'Observations',
    fields: [
      field('nObs'),
      field('arc'),
      field('rmsN'),
      field('unc'),
      field('uncP1'),
    ],
  },
  {
    title: 'Sky position',
    fields: [
      field('ra'),
      field('dec'),
      field('elong'),
      field('rate'),
    ],
  },
  {
    title: 'Timing',
    fields: [field('lastRun'), field('tEphem')],
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
