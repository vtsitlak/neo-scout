import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoFooter } from './info-footer';

describe('InfoFooter', () => {
  let fixture: ComponentFixture<InfoFooter>;

  const appInfo = {
    version: '0.1.0',
    copyright: {
      year: '2026',
      email: 'hello@example.com',
    },
    source: 'https://github.com/vtsitlak/neo-scout',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoFooter);
    fixture.componentRef.setInput('appInfo', appInfo);
    await fixture.whenStable();
  });

  it('should create as a full-width block host', () => {
    // Arrange / Act / Assert
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.classList.contains('block')).toBe(true);
    expect(fixture.nativeElement.classList.contains('w-full')).toBe(true);
    expect(fixture.nativeElement.classList.contains('mt-auto')).toBe(true);
  });

  it('should render version, copyright, mailto, and source link', () => {
    // Arrange / Act
    const root = fixture.nativeElement as HTMLElement;
    const mailto = root.querySelector(
      'a[href="mailto:hello@example.com"]',
    ) as HTMLAnchorElement | null;
    const source = root.querySelector(
      'a[href="https://github.com/vtsitlak/neo-scout"]',
    ) as HTMLAnchorElement | null;

    // Assert
    expect(root.textContent).toContain('v0.1.0');
    expect(root.textContent).toContain('©');
    expect(root.textContent).toContain('2026');
    expect(mailto?.textContent?.trim()).toBe('hello@example.com');
    expect(source?.textContent?.trim()).toBe(
      'https://github.com/vtsitlak/neo-scout',
    );
    expect(source?.getAttribute('target')).toBe('_blank');
  });

  it('should render a horizontal divider', () => {
    // Arrange / Act
    const divider = (fixture.nativeElement as HTMLElement).querySelector(
      'p-divider',
    );

    // Assert
    expect(divider).toBeTruthy();
  });
});
