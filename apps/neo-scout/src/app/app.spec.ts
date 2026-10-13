import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { App } from './app';
import { ThemeStore } from './theme/theme.store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();
  });

  it('should render brand SVG assets and theme toggle', async () => {
    // Arrange
    const fixture = TestBed.createComponent(App);

    // Act
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Assert
    expect(compiled.querySelectorAll('img[alt="NEO Scout"]').length).toBe(2);
    expect(compiled.textContent).toContain('Dark mode');
    expect(fixture.componentInstance.logoSrc()).toBe('brand/logo.svg');
    expect(fixture.componentInstance.logoLgSrc()).toBe('brand/logo-lg.svg');
  });

  it('should switch brand SVG paths in dark mode', async () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    const themeStore = TestBed.inject(ThemeStore);

    // Act
    themeStore.setMode('dark');
    await fixture.whenStable();

    // Assert
    expect(fixture.componentInstance.logoSrc()).toBe('brand/logo-dark.svg');
    expect(fixture.componentInstance.logoLgSrc()).toBe(
      'brand/logo-lg-dark.svg',
    );
  });
});
