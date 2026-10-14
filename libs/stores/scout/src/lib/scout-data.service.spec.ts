import { TestBed } from '@angular/core/testing';
import {
  ScoutApiResponse,
  ScoutApiService,
  ScoutCandidate,
} from '@neo-scout/api';
import { of, throwError } from 'rxjs';
import { ScoutDataService } from './scout-data.service';

describe('ScoutDataService', () => {
  let service: ScoutDataService;
  let getCandidates: ReturnType<typeof vi.fn>;

  const sampleCandidate: ScoutCandidate = {
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

  const sampleResponse: ScoutApiResponse = {
    data: [sampleCandidate],
    count: '1',
    signature: { source: 'NASA/JPL Scout API', version: '1.3' },
  };

  beforeEach(() => {
    getCandidates = vi.fn(() => of(sampleResponse));

    TestBed.configureTestingModule({
      providers: [
        ScoutDataService,
        { provide: ScoutApiService, useValue: { getCandidates } },
      ],
    });

    service = TestBed.inject(ScoutDataService);
  });

  it('should load candidates from the API', async () => {
    const candidates = await service.load();

    expect(getCandidates).toHaveBeenCalledTimes(1);
    expect(candidates).toEqual([sampleCandidate]);
  });

  it('should reject when the API fails', async () => {
    getCandidates.mockReturnValueOnce(throwError(() => new Error('boom')));

    await expect(service.load()).rejects.toThrow('boom');
  });
});
