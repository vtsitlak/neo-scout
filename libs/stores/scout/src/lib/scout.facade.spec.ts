import { TestBed } from '@angular/core/testing';
import {
  ScoutApiResponse,
  ScoutApiService,
  ScoutCandidate,
} from '@neo-scout/api';
import { ErrorToastService } from '@neo-scout/shared/services';
import { of, throwError } from 'rxjs';
import { ScoutFacade } from './scout.facade';

function candidate(
  overrides: Partial<ScoutCandidate> & Pick<ScoutCandidate, 'objectName'>,
): ScoutCandidate {
  return {
    neoScore: 50,
    phaScore: 0,
    neo1kmScore: 0,
    ieoScore: 0,
    geocentricScore: 0,
    tisserandScore: 0,
    rating: 0,
    moid: '0.1',
    caDist: '1.0',
    H: '20.0',
    Vmag: '20.0',
    nObs: 5,
    arc: '1.0',
    rmsN: '0.5',
    unc: '1.0',
    uncP1: '1.0',
    ra: '00:00',
    dec: '+00',
    elong: '100',
    rate: '1.0',
    vInf: null,
    lastRun: '2026-10-01 00:00',
    tEphem: '2026-10-13 18:30',
    ...overrides,
  };
}

describe('ScoutFacade', () => {
  let facade: ScoutFacade;
  let getCandidates: ReturnType<typeof vi.fn>;
  let showError: ReturnType<typeof vi.fn>;

  const many: ScoutCandidate[] = Array.from({ length: 25 }, (_, i) =>
    candidate({
      objectName: `OBJ${String(i).padStart(2, '0')}`,
      neoScore: i * 4,
      phaScore: i,
      caDist: i % 2 === 0 ? String(i) : null,
    }),
  );

  const sampleResponse: ScoutApiResponse = {
    data: many,
    count: String(many.length),
    signature: { source: 'NASA/JPL Scout API', version: '1.3' },
  };

  beforeEach(() => {
    getCandidates = vi.fn(() => of(sampleResponse));
    showError = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: ScoutApiService, useValue: { getCandidates } },
        { provide: ErrorToastService, useValue: { show: showError } },
      ],
    });

    facade = TestBed.inject(ScoutFacade);
  });

  async function flushLoad(
    response: ScoutApiResponse = sampleResponse,
  ): Promise<void> {
    getCandidates.mockReturnValueOnce(of(response));
    facade.loadAll();
    await Promise.resolve();
  }

  it('should load all candidates through the facade', async () => {
    await flushLoad();

    expect(facade.loading()).toBe(false);
    expect(facade.candidates().length).toBe(25);
    expect(facade.totalCandidates()).toBe(25);
    expect(facade.filteredCandidates().length).toBe(25);
    expect(facade.totalFilteredCandidates()).toBe(25);
  });

  it('should reload candidates', async () => {
    await flushLoad();

    getCandidates.mockReturnValueOnce(
      of({
        ...sampleResponse,
        data: many.slice(0, 3),
        count: '3',
      }),
    );
    facade.reload();
    await Promise.resolve();

    expect(facade.candidates().length).toBe(3);
    expect(facade.filteredCandidates().length).toBe(3);
  });

  it('should search, filter, and sort client-side', async () => {
    await flushLoad();

    facade.setSearch('OBJ1');
    expect(
      facade.filteredCandidates().every((c) => c.objectName.includes('OBJ1')),
    ).toBe(true);
    expect(facade.totalFilteredCandidates()).toBe(
      facade.filteredCandidates().length,
    );
    expect(facade.totalFilteredCandidates()).toBeLessThan(
      facade.totalCandidates(),
    );

    facade.setSearch('');
    facade.setFilter({ minNeoScore: 80, hasCloseApproach: true });
    expect(
      facade
        .filteredCandidates()
        .every((c) => c.neoScore >= 80 && c.caDist != null),
    ).toBe(true);

    facade.setFilter({});
    facade.setSort('neoScore', 'desc');
    const sorted = facade.filteredCandidates();
    const first = sorted[0];
    const second = sorted[1];
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first?.neoScore ?? 0).toBeGreaterThanOrEqual(second?.neoScore ?? 0);
  });

  it('should toast when the API fails', async () => {
    getCandidates.mockReturnValueOnce(throwError(() => new Error('boom')));
    facade.loadAll();
    await Promise.resolve();

    expect(facade.loading()).toBe(false);
    expect(facade.candidates()).toEqual([]);
    expect(showError).toHaveBeenCalledWith('boom');
  });

  it('should show an error toast via handleError', () => {
    facade.handleError(new Error('Scout API failed'));

    expect(showError).toHaveBeenCalledWith('Scout API failed');
  });
});
