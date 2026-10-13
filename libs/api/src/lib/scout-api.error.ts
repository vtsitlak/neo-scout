/**
 * Domain error raised by {@link ScoutApiService} when the Scout HTTP call fails.
 */
export class ScoutApiError extends Error {
  readonly status: number | null;
  readonly originalError: unknown;

  constructor(
    message: string,
    status: number | null = null,
    originalError: unknown = undefined,
  ) {
    super(message);
    this.name = 'ScoutApiError';
    this.status = status;
    this.originalError = originalError;
  }
}
