import { inject, Injectable } from '@angular/core';
import { ScoutApiService, ScoutCandidate } from '@neo-scout/api';
import { firstValueFrom, map } from 'rxjs';

/**
 * Thin adapter over {@link ScoutApiService}.
 * Fetches the full Scout list (API has no paging params).
 */
@Injectable({ providedIn: 'root' })
export class ScoutDataService {
  readonly #api = inject(ScoutApiService);

  /** Fetch the full Scout candidate list. */
  load(): Promise<ScoutCandidate[]> {
    return firstValueFrom(
      this.#api.getCandidates().pipe(map((response) => response.data)),
    );
  }
}
