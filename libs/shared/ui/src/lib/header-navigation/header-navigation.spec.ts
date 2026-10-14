import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HeaderNavigation } from './header-navigation';
import type { MenuItem } from './menu-item';

@Component({
  selector: 'neo-header-navigation-host',
  imports: [HeaderNavigation],
  template: `
    <neo-header-navigation [items]="items">
      <span startPlaceholder data-testid="start-slot">Brand</span>
      <span endPlaceholder data-testid="end-slot">End</span>
    </neo-header-navigation>
  `,
})
class HeaderNavigationHost {
  items: MenuItem[] = [
    { text: 'Scout', link: '/scout' },
    { text: 'Contact', link: '/contact' },
  ];
}

describe('HeaderNavigation', () => {
  let fixture: ComponentFixture<HeaderNavigationHost>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNavigationHost],
      providers: [
        provideRouter([
          { path: 'scout', component: HeaderNavigationHost },
          { path: 'contact', component: HeaderNavigationHost },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNavigationHost);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('neo-header-navigation'),
    ).toBeTruthy();
  });

  it('should project start and end placeholders', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(
      root.querySelector('[data-testid="start-slot"]')?.textContent,
    ).toContain('Brand');
    expect(
      root.querySelector('[data-testid="end-slot"]')?.textContent,
    ).toContain('End');
  });

  it('should render navigation buttons for each menu item', () => {
    const root = fixture.nativeElement as HTMLElement;
    const nav = root.querySelector('nav[aria-label="Primary"]');
    const links = root.querySelectorAll('a[href], p-button');

    expect(nav).toBeTruthy();
    expect(root.textContent).toContain('Scout');
    expect(root.textContent).toContain('Contact');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it('should mark the active route with aria-current="page"', async () => {
    await router.navigateByUrl('/scout');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const links = Array.from(
      root.querySelectorAll('nav[aria-label="Primary"] a'),
    ) as HTMLAnchorElement[];
    const scout = links.find((el) => el.textContent?.includes('Scout'));
    const contact = links.find((el) => el.textContent?.includes('Contact'));

    expect(scout?.getAttribute('aria-current')).toBe('page');
    expect(contact?.getAttribute('aria-current')).toBeNull();
    expect(scout?.classList.contains('p-button-primary')).toBe(true);
    expect(contact?.classList.contains('p-button-text')).toBe(true);
  });

  it('should render a toolbar', () => {
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('p-toolbar'),
    ).toBeTruthy();
  });
});
