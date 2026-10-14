import { Injectable } from '@angular/core';
import { ContactInquiry } from './contact.models';

/**
 * Simulated contact submission (no backend).
 * Throws when `workEmail` ends with `@fail.test` so error UX can be exercised.
 */
@Injectable({ providedIn: 'root' })
export class ContactDataService {
  readonly #delayMs = 900;

  async submit(inquiry: ContactInquiry): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, this.#delayMs));

    if (inquiry.workEmail.trim().toLowerCase().endsWith('@fail.test')) {
      throw new Error('Unable to deliver your message. Please try again.');
    }
  }
}
