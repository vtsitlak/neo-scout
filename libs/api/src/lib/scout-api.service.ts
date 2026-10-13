import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ScoutApiResponse } from './models/scout-api.model';
import { ScoutApiError } from './scout-api.error';
import { SCOUT_API_URL } from './scout-api.tokens';

/**
 * Thin HTTP client for the NASA/JPL Scout candidate list.
 * Filtering, search, and pagination belong in a SignalStore consumer — not here.
 */
@Injectable({ providedIn: 'root' })
export class ScoutApiService {
  readonly #http = inject(HttpClient);
  readonly #url = inject(SCOUT_API_URL);

  getCandidates(): Observable<ScoutApiResponse> {
    return this.#http
      .get<ScoutApiResponse>(this.#url)
      .pipe(
        catchError((error: unknown) =>
          throwError(() => this.#toScoutApiError(error)),
        ),
      );
  }

  #toScoutApiError(error: unknown): ScoutApiError {
    if (error instanceof ScoutApiError) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      const detail =
        typeof error.message === 'string' && error.message.length > 0
          ? error.message
          : `Scout API request failed with status ${error.status}`;
      return new ScoutApiError(detail, error.status, error);
    }

    if (error instanceof Error) {
      return new ScoutApiError(error.message, null, error);
    }

    return new ScoutApiError('Unknown Scout API error', null, error);
  }
}
