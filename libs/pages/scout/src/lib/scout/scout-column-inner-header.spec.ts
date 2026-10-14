import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { IHeaderParams } from 'ag-grid-community';
import { ScoutColumnInnerHeader } from './scout-column-inner-header';

describe('ScoutColumnInnerHeader', () => {
  let fixture: ComponentFixture<ScoutColumnInnerHeader>;
  let component: ScoutColumnInnerHeader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutColumnInnerHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoutColumnInnerHeader);
    component = fixture.componentInstance;
  });

  it('should render the display name from agInit params', () => {
    component.agInit({
      displayName: 'NEO score',
      description: 'Scout interest score for near-Earth objects.',
    } as IHeaderParams & { description: string });
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('NEO score');
  });

  it('should refresh display name when params change', () => {
    component.agInit({
      displayName: 'NEO score',
      description: 'First',
    } as IHeaderParams & { description: string });
    fixture.detectChanges();

    const refreshed = component.refresh({
      displayName: 'PHA score',
      description: 'Second',
    } as IHeaderParams & { description: string });
    fixture.detectChanges();

    expect(refreshed).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'PHA score',
    );
  });
});
