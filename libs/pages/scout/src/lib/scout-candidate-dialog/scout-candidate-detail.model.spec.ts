import {
  formatScoutDetailValue,
  hazardInterest,
  SCOUT_DETAIL_SECTIONS,
} from './scout-candidate-detail.model';

describe('scout-candidate-detail.model', () => {
  it('should cover every ScoutCandidate key except objectName', () => {
    const keys = SCOUT_DETAIL_SECTIONS.flatMap((section) =>
      section.fields.map((field) => field.key),
    );

    expect(keys).not.toContain('objectName');
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.length).toBe(23);
  });

  it('should include a short description on every detail field', () => {
    for (const section of SCOUT_DETAIL_SECTIONS) {
      for (const field of section.fields) {
        expect(field.label.length).toBeGreaterThan(0);
        expect(field.description.length).toBeGreaterThan(10);
      }
    }
  });

  it('should format nullish values as an em dash', () => {
    expect(formatScoutDetailValue(null)).toBe('—');
    expect(formatScoutDetailValue(undefined)).toBe('—');
    expect(formatScoutDetailValue('')).toBe('—');
    expect(formatScoutDetailValue(12)).toBe('12');
  });

  it('should average NEO and PHA scores into hazard interest', () => {
    expect(hazardInterest({ neoScore: 100, phaScore: 0 })).toBe(50);
    expect(hazardInterest({ neoScore: 80, phaScore: 40 })).toBe(60);
    expect(hazardInterest({ neoScore: 51, phaScore: 50 })).toBe(51);
  });
});
