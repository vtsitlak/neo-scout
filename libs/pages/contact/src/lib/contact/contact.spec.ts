import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ContactFacade,
  ContactInquiry,
  ContactSubmitStatus,
} from '@neo-scout/stores/contact';
import { Contact } from './contact';

describe('Contact', () => {
  let fixture: ComponentFixture<Contact>;
  let component: Contact;
  let submitFn: ReturnType<typeof vi.fn>;
  let resetFn: ReturnType<typeof vi.fn>;
  let status: ReturnType<typeof signal<ContactSubmitStatus>>;
  let lastInquiry: ReturnType<typeof signal<ContactInquiry | null>>;

  beforeEach(async () => {
    submitFn = vi.fn(async () => undefined);
    resetFn = vi.fn();
    status = signal<ContactSubmitStatus>('idle');
    lastInquiry = signal<ContactInquiry | null>(null);

    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [
        {
          provide: ContactFacade,
          useValue: {
            submit: submitFn,
            reset: resetFn,
            status,
            lastInquiry,
            error: signal(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the two-column contact layout', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Contact NEO Scout');
    expect(
      root.querySelector('[aria-label="Company contact details"]'),
    ).toBeTruthy();
    expect(
      root.querySelector('[aria-label="Contact inquiry form"]'),
    ).toBeTruthy();
  });

  it('should submit a valid inquiry through the facade', async () => {
    component.inquiryForm.name().value.set('Ada Lovelace');
    component.inquiryForm.workEmail().value.set('ada@example.com');
    component.inquiryForm.company().value.set('Analytical Engines');
    component.inquiryForm.employeeCount().value.set('11-50');
    component.inquiryForm
      .message()
      .value.set('I would like to learn more about NEO Scout.');
    fixture.detectChanges();

    await component['onSubmit']();

    expect(submitFn).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      workEmail: 'ada@example.com',
      company: 'Analytical Engines',
      employeeCount: '11-50',
      message: 'I would like to learn more about NEO Scout.',
    });
  });

  it('should show success state and allow sending another message', () => {
    status.set('success');
    lastInquiry.set({
      name: 'Ada',
      workEmail: 'ada@example.com',
      company: '',
      employeeCount: '',
      message: 'Thanks for building NEO Scout with care.',
    });
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(
      root.querySelector('[aria-label="Message sent successfully"]'),
    ).toBeTruthy();
    expect(root.textContent).toContain('Send another message');

    component['sendAnother']();
    expect(resetFn).toHaveBeenCalledTimes(1);
  });

  it('should clear touched field errors when sending another message', () => {
    component.inquiryForm.name().value.set('Ada');
    component.inquiryForm.name().markAsTouched();
    component.inquiryForm.workEmail().markAsTouched();
    component.inquiryForm.message().markAsTouched();
    fixture.detectChanges();

    status.set('success');
    fixture.detectChanges();

    component['sendAnother']();
    status.set('idle');
    fixture.detectChanges();

    expect(component.inquiryForm.name().touched()).toBe(false);
    expect(component.inquiryForm.workEmail().touched()).toBe(false);
    expect(component.inquiryForm.message().touched()).toBe(false);
    expect(component.inquiryForm.name().value()).toBe('');
    expect(component['fieldError'](component.inquiryForm.name)).toBeNull();
  });
});
