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

  function settle(): void {
    TestBed.flushEffects();
    TestBed.tick();
    TestBed.flushEffects();
  }

  it('should stay idle until load is called', () => {
    expect(service.status()).toBe('idle');
    expect(getCandidates).not.toHaveBeenCalled();
  });

  it('should load candidates via rxResource and expose data signal', () => {
    service.load();
    settle();

    expect(getCandidates).toHaveBeenCalledTimes(1);
    expect(service.status()).toBe('resolved');
    expect(service.data().length).toBe(1);
    expect(service.data()[0]?.objectName).toBe('6K72D21');
    expect(service.error()).toBeUndefined();
  });

  it('should reload and fetch again', () => {
    service.load();
    settle();

    getCandidates.mockReturnValueOnce(
      of({
        ...sampleResponse,
        data: [sampleCandidate, { ...sampleCandidate, objectName: 'RELOAD1' }],
        count: '2',
      }),
    );

    service.reload();
    settle();

    expect(getCandidates).toHaveBeenCalledTimes(2);
    expect(service.data().length).toBe(2);
  });

  it('should surface errors on the error signal', () => {
    getCandidates.mockReturnValueOnce(throwError(() => new Error('boom')));

    service.load();
    settle();

    expect(service.status()).toBe('error');
    expect(service.error()).toBeTruthy();
    expect(service.data()).toEqual([]);
  });
});
