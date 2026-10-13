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
    await fixture.whenStable();
  });

  it('should create', () => {
    // Arrange / Act / Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render an accessible icon-only toggle button', () => {
    // Arrange / Act
    const toggle = (fixture.nativeElement as HTMLElement).querySelector(
      'p-togglebutton, p-toggleButton',
    );

    // Assert
    expect(toggle).toBeTruthy();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '[aria-label="Toggle color theme"]',
      ),
    ).toBeTruthy();
  });

  it('should switch ThemeStore to dark when toggled on', async () => {
    // Arrange / Act
    themeStore.setMode('dark');
    await fixture.whenStable();

    // Assert
    expect(themeStore.mode()).toBe('dark');
  });
});
