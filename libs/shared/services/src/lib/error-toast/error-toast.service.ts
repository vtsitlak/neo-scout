import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Shows centered PrimeNG error toasts from a plain message string.
 * Requires `MessageService` and `<p-toast position="center" />` in the app shell.
 */
@Injectable({ providedIn: 'root' })
export class ErrorToastService {
  readonly #messages = inject(MessageService);

  show(message: string): void {
    const detail = message.trim();
    if (!detail) {
      return;
    }

    this.#messages.add({
      severity: 'error',
      summary: 'Error',
      detail,
      life: 6000,
    });
  }
}
