import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoutCandidate } from '@neo-scout/api';
import { ScoutFacade } from '@neo-scout/stores/scout';
import { ThemeStore } from '@neo-scout/stores/theme';
import { Scout } from './scout';

function candidate(name: string): ScoutCandidate {
  return {
    objectName: name,
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
  };
}

describe('Scout', () => {
  let fixture: ComponentFixture<Scout>;
  let component: Scout;
  let loadAll: ReturnType<typeof vi.fn>;
  let reload: ReturnType<typeof vi.fn>;
  let loading: ReturnType<typeof signal<boolean>>;
  let error: ReturnType<typeof signal<unknown | null>>;
  let filteredCandidates: ReturnType<typeof signal<ScoutCandidate[]>>;
  let totalCandidates: ReturnType<typeof signal<number>>;
  let totalFilteredCandidates: ReturnType<typeof signal<number>>;

  beforeEach(async () => {
    loadAll = vi.fn();
    reload = vi.fn();
    loading = signal(true);
    error = signal<unknown | null>(null);
    filteredCandidates = signal<ScoutCandidate[]>([]);
    totalCandidates = signal(0);
    totalFilteredCandidates = signal(0);

    await TestBed.configureTestingModule({
      imports: [Scout],
      providers: [
        {
          provide: ScoutFacade,
          useValue: {
            loadAll,
            reload,
            loading,
            error,
            filteredCandidates,
            totalCandidates,
            totalFilteredCandidates,
            candidates: filteredCandidates,
          },
        },
        {
          provide: ThemeStore,
          useValue: {
            mode: signal<'light' | 'dark'>('light'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Scout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should load all candidates on create', () => {
    expect(loadAll).toHaveBeenCalledTimes(1);
  });

  it('should show a centered skeleton while the initial load is empty', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(
      root.querySelector('[aria-label="Loading Scout candidates"]'),
    ).toBeTruthy();
    expect(root.querySelector('ag-grid-angular')).toBeFalsy();
  });

  it('should render the grid when candidates are available', async () => {
    loading.set(false);
    totalCandidates.set(2);
    totalFilteredCandidates.set(2);
    filteredCandidates.set([candidate('OBJ01'), candidate('OBJ02')]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('ag-grid-angular')).toBeTruthy();
    expect(
      root.querySelector('[aria-label="Loading Scout candidates"]'),
    ).toBeFalsy();
    expect(
      root.querySelector('[aria-label="No Scout candidates available"]'),
    ).toBeFalsy();
  });

  it('should show an empty state when there are no candidates', async () => {
    loading.set(false);
    error.set(null);
    totalCandidates.set(0);
    filteredCandidates.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const empty = root.querySelector(
      '[aria-label="No Scout candidates available"]',
    );
    expect(empty).toBeTruthy();
    expect(empty?.textContent).toContain(
      'No near-Earth objects were found right now',
    );
    expect(root.querySelector('ag-grid-angular')).toBeFalsy();
  });

  it('should not show the empty state while an error is present', async () => {
    loading.set(false);
    error.set(new Error('failed'));
    totalCandidates.set(0);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(
      root.querySelector('[aria-label="No Scout candidates available"]'),
    ).toBeFalsy();
  });

  it('should refresh from the empty state', async () => {
    loading.set(false);
    totalCandidates.set(0);
    fixture.detectChanges();
    await fixture.whenStable();

    component['refresh']();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('should show the filtered row range in the footer', async () => {
    loading.set(false);
    totalCandidates.set(10);
    totalFilteredCandidates.set(3);
    filteredCandidates.set([
      candidate('OBJ01'),
      candidate('OBJ02'),
      candidate('OBJ03'),
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const footer = root.querySelector('[aria-label="Showing 1–3 of 10"]');
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain('Showing 1–3 of 10');
  });

  it('should include a non-sortable row number column', () => {
    const rowNumber = component.columnDefs.find(
      (col) => col.colId === 'rowNumber',
    );

    expect(rowNumber).toBeTruthy();
    expect(rowNumber?.headerName).toBe('#');
    expect(rowNumber?.sortable).toBe(false);
    expect(rowNumber?.pinned).toBe('left');
  });
});
