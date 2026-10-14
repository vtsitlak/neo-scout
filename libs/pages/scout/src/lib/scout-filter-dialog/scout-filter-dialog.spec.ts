import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoutFilterDialog } from './scout-filter-dialog';

describe('ScoutFilterDialog', () => {
  let fixture: ComponentFixture<ScoutFilterDialog>;
  let component: ScoutFilterDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutFilterDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoutFilterDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit applied filter and close on apply', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('filter', { minNeoScore: 40 });
    fixture.detectChanges();
    TestBed.flushEffects();
    fixture.detectChanges();

    const filters: unknown[] = [];
    const visibility: boolean[] = [];
    component.filterChange.subscribe((value) => filters.push(value));
    component.visibleChange.subscribe((value) => visibility.push(value));

    component['apply']();

    expect(filters).toEqual([{ minNeoScore: 40 }]);
    expect(visibility).toEqual([false]);
  });

  it('should emit an empty filter and close on clear', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('filter', {
      minNeoScore: 40,
      hasCloseApproach: true,
    });
    fixture.detectChanges();
    TestBed.flushEffects();

    const filters: unknown[] = [];
    component.filterChange.subscribe((value) => filters.push(value));

    component['clear']();

    expect(filters).toEqual([{}]);
  });

  it('should close without emitting filter on cancel', () => {
    const filters: unknown[] = [];
    const visibility: boolean[] = [];
    component.filterChange.subscribe((value) => filters.push(value));
    component.visibleChange.subscribe((value) => visibility.push(value));

    component['cancel']();

    expect(filters).toEqual([]);
    expect(visibility).toEqual([false]);
  });

  it('should seed the draft from the filter input when opened', () => {
    const visible = signal(false);
    fixture.componentRef.setInput('visible', visible());
    fixture.componentRef.setInput('filter', {
      minPhaScore: 12,
      hasCloseApproach: true,
    });
    fixture.detectChanges();

    visible.set(true);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    TestBed.flushEffects();
    fixture.detectChanges();

    const filters: unknown[] = [];
    component.filterChange.subscribe((value) => filters.push(value));
    component['apply']();

    expect(filters).toEqual([{ minPhaScore: 12, hasCloseApproach: true }]);
  });
});
