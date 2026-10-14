import { inject } from '@angular/core';
import { ErrorToastService } from '@neo-scout/shared/services';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ContactDataService } from './contact-data.service';
import { ContactInquiry, ContactState } from './contact.models';

const initialState: ContactState = {
  status: 'idle',
  error: null,
  lastInquiry: null,
};

function toErrorMessage(error: unknown): string {
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  return 'Unable to send your message. Please try again.';
}

export const ContactStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      dataService = inject(ContactDataService),
      errorToast = inject(ErrorToastService),
    ) => ({
      async submit(inquiry: ContactInquiry): Promise<void> {
        patchState(store, { status: 'submitting', error: null });
        try {
          await dataService.submit(inquiry);
          patchState(store, {
            status: 'success',
            error: null,
            lastInquiry: inquiry,
          });
        } catch (error) {
          patchState(store, { status: 'error', error });
          errorToast.show(toErrorMessage(error));
        }
      },

      /** Return to the form after a successful submit. */
      reset(): void {
        patchState(store, {
          status: 'idle',
          error: null,
        });
      },
    }),
  ),
);

export type ContactStore = InstanceType<typeof ContactStore>;
