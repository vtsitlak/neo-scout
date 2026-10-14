import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeStore } from '@neo-scout/stores/theme';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let fixture: ComponentFixture<ThemeToggle>;
  let themeStore: ThemeStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    themeStore = TestBed.inject(ThemeStore);
    themeStore.setMode('light');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render an accessible icon-only theme button', () => {
    const root = fixture.nativeElement as HTMLElement;
    const button = root.querySelector(
      '[aria-label="Toggle color theme"]',
    ) as HTMLElement | null;

    expect(button).toBeTruthy();
    expect(root.querySelector('.pi-moon, .pi-sun')).toBeTruthy();
  });

  it('should toggle ThemeStore between light and dark', () => {
    const component = fixture.componentInstance;

    component['toggle']();
    expect(themeStore.mode()).toBe('dark');

    component['toggle']();
    expect(themeStore.mode()).toBe('light');
  });
});
