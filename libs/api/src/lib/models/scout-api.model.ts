/**
 * Typed shapes for NASA/JPL Scout list responses
 * (`https://ssd-api.jpl.nasa.gov/scout.api`, signature version 1.3).
 *
 * Runtime source of truth is Zod in `scout-api.schema.ts`.
 */

export type {
  ScoutApiResponse,
  ScoutApiSignature,
  ScoutCandidate,
} from './scout-api.schema';
