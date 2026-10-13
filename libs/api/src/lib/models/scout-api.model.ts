/**
 * Typed shapes for NASA/JPL Scout list responses
 * (`https://ssd-api.jpl.nasa.gov/scout.api`, signature version 1.3).
 *
 * Numeric values often arrive as strings; nullable fields use `| null`.
 */

export interface ScoutApiSignature {
  source: string;
  version: string;
}

export interface ScoutCandidate {
  objectName: string;
  neoScore: number;
  phaScore: number;
  neo1kmScore: number;
  ieoScore: number;
  geocentricScore: number;
  tisserandScore: number;
  rating: number | null;
  moid: string;
  caDist: string | null;
  H: string;
  Vmag: string;
  nObs: number;
  arc: string;
  rmsN: string;
  unc: string;
  uncP1: string;
  ra: string;
  dec: string;
  elong: string;
  rate: string;
  vInf: string | null;
  lastRun: string;
  tEphem: string;
}

export interface ScoutApiResponse {
  data: ScoutCandidate[];
  /** API returns count as a string (e.g. `"100"`). */
  count: string;
  signature: ScoutApiSignature;
}
