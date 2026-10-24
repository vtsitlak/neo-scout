import { z } from 'zod';

/** JPL often sends scores as numbers; coerce covers string forms too. */
const scoutNumber = z.coerce.number();
const scoutNullableNumber = z.union([z.null(), z.coerce.number()]);
const scoutNullableString = z.union([z.null(), z.string()]);

export const ScoutApiSignatureSchema = z.object({
  source: z.string(),
  version: z.string(),
});

export const ScoutCandidateSchema = z.object({
  objectName: z.string(),
  neoScore: scoutNumber,
  phaScore: scoutNumber,
  neo1kmScore: scoutNumber,
  ieoScore: scoutNumber,
  geocentricScore: scoutNumber,
  tisserandScore: scoutNumber,
  rating: scoutNullableNumber,
  moid: z.string(),
  caDist: scoutNullableString,
  H: z.string(),
  Vmag: z.string(),
  nObs: scoutNumber,
  arc: z.string(),
  rmsN: z.string(),
  unc: z.string(),
  uncP1: z.string(),
  ra: z.string(),
  dec: z.string(),
  elong: z.string(),
  rate: z.string(),
  vInf: scoutNullableString,
  lastRun: z.string(),
  tEphem: z.string(),
});

export const ScoutApiResponseSchema = z.object({
  data: z.array(ScoutCandidateSchema),
  count: z.string(),
  signature: ScoutApiSignatureSchema,
});

export type ScoutApiSignature = z.infer<typeof ScoutApiSignatureSchema>;
export type ScoutCandidate = z.infer<typeof ScoutCandidateSchema>;
export type ScoutApiResponse = z.infer<typeof ScoutApiResponseSchema>;
