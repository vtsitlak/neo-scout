import {
  ScoutApiResponseSchema,
  ScoutCandidateSchema,
} from './scout-api.schema';

describe('ScoutApiResponseSchema', () => {
  const validCandidate = {
    objectName: '6K72D21',
    neoScore: 100,
    phaScore: 0,
    neo1kmScore: 0,
    ieoScore: 0,
    geocentricScore: 0,
    tisserandScore: 0,
    rating: 0,
    moid: '0.003',
    caDist: '6.7',
    H: '27.3',
    Vmag: '21.8',
    nObs: 21,
    arc: '24.10',
    rmsN: '0.88',
    unc: '0.47',
    uncP1: '0.58',
    ra: '01:58',
    dec: '+00',
    elong: '167',
    rate: '3.2',
    vInf: '6.5',
    lastRun: '2026-10-09 06:05',
    tEphem: '2026-10-13 18:30',
  };

  it('should parse a valid Scout envelope', () => {
    const parsed = ScoutApiResponseSchema.parse({
      data: [validCandidate],
      count: '1',
      signature: { source: 'NASA/JPL Scout API', version: '1.3' },
    });

    expect(parsed.data).toHaveLength(1);
    expect(parsed.data[0]?.objectName).toBe('6K72D21');
  });

  it('should coerce string scores to numbers', () => {
    const parsed = ScoutCandidateSchema.parse({
      ...validCandidate,
      neoScore: '85',
      nObs: '12',
    });

    expect(parsed.neoScore).toBe(85);
    expect(parsed.nObs).toBe(12);
  });

  it('should allow null caDist, vInf, and rating', () => {
    const parsed = ScoutCandidateSchema.parse({
      ...validCandidate,
      caDist: null,
      vInf: null,
      rating: null,
    });

    expect(parsed.caDist).toBeNull();
    expect(parsed.vInf).toBeNull();
    expect(parsed.rating).toBeNull();
  });

  it('should reject a candidate missing objectName', () => {
    const { objectName: _removed, ...withoutName } = validCandidate;

    expect(() => ScoutCandidateSchema.parse(withoutName)).toThrow();
  });

  it('should reject an envelope when data is not an array', () => {
    expect(() =>
      ScoutApiResponseSchema.parse({
        data: { objectName: 'x' },
        count: '1',
        signature: { source: 'test', version: '1' },
      }),
    ).toThrow();
  });
});
