import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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
    { text: 'Home', link: '/' },
    { text: 'Scout', link: '/scout' },
  ];
}

describe('HeaderNavigation', () => {
  let fixture: ComponentFixture<HeaderNavigationHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNavigationHost],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNavigationHost);
    await fixture.whenStable();
  });

  it('should create', () => {
    // Arrange / Act / Assert
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('neo-header-navigation')).toBeTruthy();
  });

  it('should project start and end placeholders', () => {
    // Arrange / Act
    const root = fixture.nativeElement as HTMLElement;

    // Assert
    expect(root.querySelector('[data-testid="start-slot"]')?.textContent).toContain(
      'Brand',
    );
    expect(root.querySelector('[data-testid="end-slot"]')?.textContent).toContain(
      'End',
    );
  });

  it('should render navigation buttons for each menu item', () => {
    // Arrange / Act
    const root = fixture.nativeElement as HTMLElement;
    const nav = root.querySelector('nav[aria-label="Primary"]');
    const links = root.querySelectorAll('a[href], p-button');

    // Assert
    expect(nav).toBeTruthy();
    expect(root.textContent).toContain('Home');
    expect(root.textContent).toContain('Scout');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it('should render a toolbar', () => {
    // Arrange / Act / Assert
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('p-toolbar'),
    ).toBeTruthy();
  });
});
