import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeStore } from '@neo-scout/stores/theme';
import { MessageService } from 'primeng/api';
import { App } from './app';
import { appRoutes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes), MessageService],
    }).compileComponents();
  });

  it('should render header, logo, theme toggle, router outlet, and footer', async () => {
    // Arrange
    const fixture = TestBed.createComponent(App);

    // Act
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    // Assert
    expect(compiled.querySelector('neo-header-navigation')).toBeTruthy();
    expect(compiled.querySelector('img[alt="NEO Scout"]')).toBeTruthy();
    expect(compiled.querySelector('neo-theme-toggle')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('neo-info-footer')).toBeTruthy();
    expect(compiled.querySelector('p-toast')).toBeTruthy();
    expect(fixture.componentInstance.logoSrc()).toBe('brand/logo.svg');
  });

  it('should expose Scout and Contact nav items', () => {
    // Arrange
    const fixture = TestBed.createComponent(App);

    // Act / Assert
    expect(fixture.componentInstance['navItems']).toEqual([
      { text: 'Scout', link: '/scout' },
      { text: 'Contact', link: '/contact' },
    ]);
  });

  it('should switch header logo path in dark mode', async () => {
    // Arrange
    const fixture = TestBed.createComponent(App);
    const themeStore = TestBed.inject(ThemeStore);

    // Act
    themeStore.setMode('dark');
    await fixture.whenStable();

    // Assert
    expect(fixture.componentInstance.logoSrc()).toBe('brand/logo-dark.svg');
  });
});
