import { inject, Injectable } from '@angular/core';
import { ContactInquiry } from './contact.models';
import { ContactStore } from './contact.store';

/**
 * Public entry point for Contact inquiry submission state.
 * Components should inject this facade — not the store or data service.
 */
@Injectable({ providedIn: 'root' })
export class ContactFacade {
  readonly #store = inject(ContactStore);

  readonly status = this.#store.status;
  readonly error = this.#store.error;
  readonly lastInquiry = this.#store.lastInquiry;

  submit(inquiry: ContactInquiry): Promise<void> {
    return this.#store.submit(inquiry);
  }

  reset(): void {
    this.#store.reset();
  }
}
