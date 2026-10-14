import { ScoutCandidate } from '@neo-scout/api';
import {
  SCOUT_FIELD_META,
  SCOUT_HAZARD_INTEREST_META,
  SCOUT_ROW_NUMBER_META,
} from './scout-field-meta';

describe('scout-field-meta', () => {
  it('should define label and description for every ScoutCandidate key', () => {
    const keys = Object.keys(SCOUT_FIELD_META) as (keyof ScoutCandidate)[];
    expect(keys.length).toBe(24);

    for (const key of keys) {
      const meta = SCOUT_FIELD_META[key];
      expect(meta.label.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(10);
    }
  });

  it('should define meta for row number and hazard interest', () => {
    expect(SCOUT_ROW_NUMBER_META.label).toBe('#');
    expect(SCOUT_ROW_NUMBER_META.description.length).toBeGreaterThan(10);
    expect(SCOUT_HAZARD_INTEREST_META.label).toBe('Hazard interest');
    expect(SCOUT_HAZARD_INTEREST_META.description.length).toBeGreaterThan(10);
  });
});
