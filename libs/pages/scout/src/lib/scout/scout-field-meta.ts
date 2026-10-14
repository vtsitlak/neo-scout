import { ScoutCandidate } from '@neo-scout/api';

export interface ScoutFieldMeta {
  label: string;
  description: string;
}

/** Shared labels + short hover descriptions for Scout grid headers and detail fields. */
export const SCOUT_FIELD_META: Record<keyof ScoutCandidate, ScoutFieldMeta> = {
  objectName: {
    label: 'Object',
    description: 'Temporary designation of this near-Earth object.',
  },
  neoScore: {
    label: 'NEO score',
    description:
      'Scout interest score (0–100) that the object is a near-Earth object.',
  },
  phaScore: {
    label: 'PHA score',
    description:
      'Scout interest score (0–100) that the object is a potentially hazardous asteroid.',
  },
  neo1kmScore: {
    label: 'NEO 1 km score',
    description:
      'Scout interest score (0–100) that the object is a NEO about 1 km or larger.',
  },
  ieoScore: {
    label: 'IEO score',
    description:
      'Scout interest score (0–100) that the object is an interior-Earth object.',
  },
  geocentricScore: {
    label: 'Geocentric score',
    description:
      'Scout interest score (0–100) that the object is on a geocentric (Earth-orbiting) path.',
  },
  tisserandScore: {
    label: 'Tisserand score',
    description:
      'Scout interest score based on the Tisserand parameter relative to Jupiter.',
  },
  rating: {
    label: 'Rating',
    description: 'Overall Scout interest rating for this candidate.',
  },
  moid: {
    label: 'MOID',
    description: 'Minimum orbit intersection distance with Earth (AU).',
  },
  caDist: {
    label: 'Close approach',
    description: 'Expected close-approach distance when available.',
  },
  H: {
    label: 'Abs. magnitude (H)',
    description:
      'Absolute magnitude H — a brightness proxy related to object size.',
  },
  Vmag: {
    label: 'Apparent mag.',
    description:
      'Apparent visual magnitude (brighter objects have lower values).',
  },
  nObs: {
    label: 'Observations',
    description: 'Number of observations used in the Scout solution.',
  },
  arc: {
    label: 'Arc (days)',
    description: 'Length of the observed arc in days.',
  },
  rmsN: {
    label: 'RMS',
    description: 'Root-mean-square of the orbit fit residuals.',
  },
  unc: {
    label: 'Uncertainty',
    description: 'Current on-sky positional uncertainty.',
  },
  uncP1: {
    label: 'Uncertainty (+1 day)',
    description: 'Projected on-sky positional uncertainty one day later.',
  },
  ra: {
    label: 'RA',
    description: 'Right ascension of the predicted sky position.',
  },
  dec: {
    label: 'Dec',
    description: 'Declination of the predicted sky position.',
  },
  elong: {
    label: 'Elongation',
    description: 'Solar elongation — angular distance from the Sun.',
  },
  rate: {
    label: 'Rate',
    description: 'On-sky motion rate of the object.',
  },
  vInf: {
    label: 'v∞',
    description: 'Infinite velocity / encounter speed when available.',
  },
  lastRun: {
    label: 'Last run',
    description: 'When Scout last processed this object.',
  },
  tEphem: {
    label: 'Ephemeris time',
    description: 'Epoch of the ephemeris / predicted position.',
  },
};

export const SCOUT_ROW_NUMBER_META: ScoutFieldMeta = {
  label: '#',
  description: 'Row number in the current filtered Scout list.',
};

export const SCOUT_HAZARD_INTEREST_META: ScoutFieldMeta = {
  label: 'Hazard interest',
  description:
    'Equal-weight blend of NEO and PHA interest scores (0–100). Not a rigorous probability.',
};
