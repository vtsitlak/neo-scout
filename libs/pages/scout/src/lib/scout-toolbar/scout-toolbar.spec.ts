import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoutToolbar } from './scout-toolbar';

describe('ScoutToolbar', () => {
  let fixture: ComponentFixture<ScoutToolbar>;
  let component: ScoutToolbar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoutToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render search, filter, and refresh controls', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(
      root.querySelector('[aria-label="Search by object name"]'),
    ).toBeTruthy();
    expect(root.textContent).toContain('Filter');
    expect(root.textContent).toContain('Refresh');
  });

  it('should show the searchQuery input value', () => {
    fixture.componentRef.setInput('searchQuery', '6K72');
    fixture.detectChanges();

    const input = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLInputElement>('[aria-label="Search by object name"]');

    expect(input?.value).toBe('6K72');
  });

  it('should emit searchQueryChange when typing', () => {
    const emitted: string[] = [];
    component.searchQueryChange.subscribe((value) => emitted.push(value));

    const input = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLInputElement>('[aria-label="Search by object name"]');
    expect(input).toBeTruthy();

    input!.value = 'OBJ';
    input!.dispatchEvent(new Event('input'));

    expect(emitted).toEqual(['OBJ']);
  });

  it('should emit openFilters when Filter is clicked', () => {
    const emitted: unknown[] = [];
    component.openFilters.subscribe(() => emitted.push(true));

    component['onFilterClick']();

    expect(emitted).toEqual([true]);
  });

  it('should hide the filter badge when no filters are active', () => {
    fixture.componentRef.setInput('activeFilterCount', 0);
    fixture.detectChanges();

    expect(component['filterBadgeDisabled']()).toBe(true);
  });

  it('should show the filter badge count when filters are active', () => {
    fixture.componentRef.setInput('activeFilterCount', 2);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const badge = root.querySelector('.p-badge');

    expect(component['filterBadgeDisabled']()).toBe(false);
    expect(badge?.textContent?.trim()).toBe('2');
  });

  it('should emit refresh when Refresh is clicked', () => {
    const emitted: unknown[] = [];
    component.refresh.subscribe(() => emitted.push(true));

    component['onRefreshClick']();

    expect(emitted).toEqual([true]);
  });
});
