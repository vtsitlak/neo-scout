import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeStore } from '@neo-scout/stores/theme';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
  });

  it('should create', () => {
    // Arrange / Act / Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the large logo, intro copy, and Scout/Contact CTAs', () => {
    // Arrange / Act
    const root = fixture.nativeElement as HTMLElement;

    // Assert
    expect(root.querySelector('img[alt="NEO Scout"]')).toBeTruthy();
    expect(root.textContent).toContain('near-Earth asteroid candidates');
    expect(root.textContent).toContain('Scout');
    expect(root.textContent).toContain('Contact');
    expect(fixture.componentInstance.logoLgSrc()).toBe('brand/logo-lg.svg');
  });

  it('should switch the large logo path in dark mode', async () => {
    // Arrange
    const themeStore = TestBed.inject(ThemeStore);

    // Act
    themeStore.setMode('dark');
    await fixture.whenStable();

    // Assert
    expect(fixture.componentInstance.logoLgSrc()).toBe(
      'brand/logo-lg-dark.svg',
    );
  });
});
