import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoutCandidate } from '@neo-scout/api';
import { ScoutCandidateDialog } from './scout-candidate-dialog';

function candidate(name: string): ScoutCandidate {
  return {
    objectName: name,
    neoScore: 50,
    phaScore: 10,
    neo1kmScore: 1,
    ieoScore: 2,
    geocentricScore: 3,
    tisserandScore: 4,
    rating: 5,
    moid: '0.1',
    caDist: null,
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

describe('ScoutCandidateDialog', () => {
  let fixture: ComponentFixture<ScoutCandidateDialog>;
  let component: ScoutCandidateDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutCandidateDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoutCandidateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should use the object name as the dialog header', () => {
    fixture.componentRef.setInput('candidate', candidate('6K72D21'));
    fixture.detectChanges();

    expect(component['dialogHeader']()).toBe('6K72D21');
  });

  it('should render candidate detail sections when open', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('candidate', candidate('OBJ01'));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Scores');
    expect(root.textContent).toContain('NEO score');
    expect(root.textContent).toContain('50');
    expect(root.textContent).toContain('Close approach');
    expect(root.textContent).toContain('—');
  });

  it('should show derived hazard interest from NEO and PHA scores', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('candidate', candidate('OBJ01'));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    // neoScore 50 + phaScore 10 → 30
    expect(root.textContent).toContain('Hazard interest: 30');
  });

  it('should bind descriptions for Prime tooltips on detail labels', () => {
    const neoField = component['sections']
      .flatMap((section) => section.fields)
      .find((field) => field.key === 'neoScore');

    expect(neoField?.description.toLowerCase()).toContain('near-earth');

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('candidate', candidate('OBJ01'));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const neoLabel = Array.from(root.querySelectorAll('dt')).find((el) =>
      el.textContent?.includes('NEO score'),
    );
    expect(neoLabel).toBeTruthy();
    expect(neoLabel?.classList.contains('cursor-help')).toBe(true);
  });

  it('should emit visibleChange false on close', () => {
    const emitted: boolean[] = [];
    component.visibleChange.subscribe((value) => emitted.push(value));

    component['close']();

    expect(emitted).toEqual([false]);
  });
});
