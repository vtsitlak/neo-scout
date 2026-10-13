import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ScoutApiResponse,
  ScoutApiService,
  ScoutCandidate,
} from '@neo-scout/api';

/**
 * Signal-facing data source over {@link ScoutApiService}.
 * Uses `rxResource` so consumers get value / error / loading signals.
 */
@Injectable({ providedIn: 'root' })
export class ScoutDataService {
  readonly #api = inject(ScoutApiService);

  /**
   * `undefined` keeps the resource idle. Any number triggers a fetch;
   * bumping the number forces a new stream (reload).
   */
  readonly #requestId = signal<number | undefined>(undefined);

  readonly candidatesResource = rxResource<
    ScoutApiResponse,
    number | undefined
  >({
    params: () => this.#requestId(),
    stream: () => this.#api.getCandidates(),
  });

  readonly data = computed((): ScoutCandidate[] => {
    if (
      this.candidatesResource.status() === 'error' ||
      !this.candidatesResource.hasValue()
    ) {
      return [];
    }
    return this.candidatesResource.value().data;
  });

  readonly response = computed((): ScoutApiResponse | undefined => {
    if (
      this.candidatesResource.status() === 'error' ||
      !this.candidatesResource.hasValue()
    ) {
      return undefined;
    }
    return this.candidatesResource.value();
  });

  readonly error = this.candidatesResource.error;
  readonly isLoading = this.candidatesResource.isLoading;
  readonly status = this.candidatesResource.status;

  /** Start the first load, or refresh if already loaded. */
  load(): void {
    this.#requestId.update((id) => (id === undefined ? 1 : id + 1));
  }

  /** Force a fresh request from the Scout API. */
  reload(): void {
    this.#requestId.update((id) => (id === undefined ? 1 : id + 1));
  }
}
