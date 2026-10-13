import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeStore } from '@neo-scout/stores/theme';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render brand SVG assets, theme toggle, and info footer', async () => {
    // Arrange
    const fixture = TestBed.createComponent(App);

    // Act
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Assert
    expect(compiled.querySelectorAll('img[alt="NEO Scout"]').length).toBe(2);
    expect(compiled.querySelector('neo-theme-toggle')).toBeTruthy();
    expect(compiled.querySelector('neo-info-footer')).toBeTruthy();
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
