/** Optional company size buckets for the inquiry form. */
export type ContactEmployeeCount =
  | ''
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '500+';

export interface ContactInquiry {
  name: string;
  workEmail: string;
  company: string;
  employeeCount: ContactEmployeeCount;
  message: string;
}

export type ContactSubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactState {
  status: ContactSubmitStatus;
  error: unknown | null;
  lastInquiry: ContactInquiry | null;
}
