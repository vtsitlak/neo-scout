import { TestBed } from '@angular/core/testing';
import { ErrorToastService } from '@neo-scout/shared/services';
import { ContactDataService } from './contact-data.service';
import { ContactFacade } from './contact.facade';
import { ContactInquiry } from './contact.models';

const sample: ContactInquiry = {
  name: 'Ada Lovelace',
  workEmail: 'ada@example.com',
  company: 'Analytical Engines',
  employeeCount: '11-50',
  message: 'Hello from the inquiry form.',
};

describe('ContactFacade', () => {
  let facade: ContactFacade;
  let submit: ReturnType<typeof vi.fn>;
  let showError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    submit = vi.fn(async () => undefined);
    showError = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: ContactDataService, useValue: { submit } },
        { provide: ErrorToastService, useValue: { show: showError } },
      ],
    });

    facade = TestBed.inject(ContactFacade);
  });

  it('should move to success after a successful submit', async () => {
    const pending = facade.submit(sample);
    expect(facade.status()).toBe('submitting');

    await pending;

    expect(facade.status()).toBe('success');
    expect(facade.lastInquiry()).toEqual(sample);
    expect(facade.error()).toBeNull();
    expect(showError).not.toHaveBeenCalled();
  });

  it('should toast and set error status when submit fails', async () => {
    submit.mockRejectedValueOnce(new Error('delivery failed'));

    await facade.submit(sample);

    expect(facade.status()).toBe('error');
    expect(facade.error()).toBeTruthy();
    expect(showError).toHaveBeenCalledWith('delivery failed');
  });

  it('should toast a contact fallback when the error has no message', async () => {
    submit.mockRejectedValueOnce({});

    await facade.submit(sample);

    expect(facade.status()).toBe('error');
    expect(showError).toHaveBeenCalledWith(
      'Unable to send your message. Please try again.',
    );
  });

  it('should reset to idle for another message', async () => {
    await facade.submit(sample);
    facade.reset();

    expect(facade.status()).toBe('idle');
    expect(facade.error()).toBeNull();
    expect(facade.lastInquiry()).toEqual(sample);
  });
});
