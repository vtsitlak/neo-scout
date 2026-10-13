import { TestBed } from '@angular/core/testing';
import {
  ScoutApiResponse,
  ScoutApiService,
  ScoutCandidate,
} from '@neo-scout/api';
import { of } from 'rxjs';
import { ScoutFacade } from './scout.facade';
import { DEFAULT_SCOUT_PAGE_SIZE } from './scout.models';

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

    TestBed.configureTestingModule({
      providers: [{ provide: ScoutApiService, useValue: { getCandidates } }],
    });

    facade = TestBed.inject(ScoutFacade);
  });

  function settle(): void {
    TestBed.flushEffects();
    TestBed.tick();
    TestBed.flushEffects();
  }

  function flushLoad(response: ScoutApiResponse = sampleResponse): void {
    getCandidates.mockReturnValueOnce(of(response));
    facade.loadAll();
    settle();
  }

  it('should load all candidates through the facade', () => {
    flushLoad();

    expect(facade.isLoadingAll()).toBe(false);
    expect(facade.candidates().length).toBe(25);
    expect(facade.visibleCandidates().length).toBe(DEFAULT_SCOUT_PAGE_SIZE);
    expect(facade.hasMore()).toBe(true);
  });

  it('should reload candidates', () => {
    flushLoad();

    getCandidates.mockReturnValueOnce(
      of({
        ...sampleResponse,
        data: many.slice(0, 3),
        count: '3',
      }),
    );
    facade.reload();
    settle();

    expect(facade.candidates().length).toBe(3);
    expect(facade.hasMore()).toBe(false);
  });

  it('should get by id and expose selectedCandidate', () => {
    flushLoad();

    facade.getById('OBJ05');

    expect(facade.isLoadingById()).toBe(false);
    expect(facade.selectedCandidate()?.objectName).toBe('OBJ05');
  });

  it('should search, filter, sort, and load more', async () => {
    flushLoad();

    facade.setSearch('OBJ1');
    expect(
      facade.filteredCandidates().every((c) => c.objectName.includes('OBJ1')),
    ).toBe(true);

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

    facade.setSearch('');
    facade.setFilter({});
    facade.resetVisible();
    expect(facade.visibleCandidates().length).toBe(DEFAULT_SCOUT_PAGE_SIZE);
    expect(facade.hasMore()).toBe(true);
    expect(facade.isLoadingMore()).toBe(false);
    facade.loadMore();
    expect(facade.isLoadingMore()).toBe(true);
    expect(facade.visibleCandidates().length).toBe(facade.totalFiltered());
    await Promise.resolve();
    expect(facade.isLoadingMore()).toBe(false);
    expect(facade.hasMore()).toBe(false);
  });

  it('should expose handleError as a no-op', () => {
    expect(() => facade.handleError(new Error('boom'))).not.toThrow();
  });
});
