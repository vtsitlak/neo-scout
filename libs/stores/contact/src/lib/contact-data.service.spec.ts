import { ContactDataService } from './contact-data.service';
import { ContactInquiry } from './contact.models';

const sample: ContactInquiry = {
  name: 'Ada',
  workEmail: 'ada@example.com',
  company: '',
  employeeCount: '',
  message: 'Hello there, this is long enough.',
};

describe('ContactDataService', () => {
  it('should resolve for a normal inquiry', async () => {
    vi.useFakeTimers();
    const service = new ContactDataService();
    const pending = service.submit(sample);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(pending).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it('should reject when the email uses the fail.test domain', async () => {
    vi.useFakeTimers();
    const service = new ContactDataService();
    const pending = service.submit({
      ...sample,
      workEmail: 'oops@fail.test',
    });
    const expectation = expect(pending).rejects.toThrow(/Unable to deliver/);
    await vi.advanceTimersByTimeAsync(1000);
    await expectation;
    vi.useRealTimers();
  });
});
