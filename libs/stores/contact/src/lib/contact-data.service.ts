import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContactInquiry } from './contact.models';

interface ContactWeb3FormsConfig {
  accessKey: string;
}

interface Web3FormsSubmitResponse {
  success: boolean;
  message?: string;
}

const WEB3FORMS_SUBMIT_URL = 'https://api.web3forms.com/submit';
const PLACEHOLDER_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';

function contactWeb3FormsConfigUrl(): string {
  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  const normalized = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
  return `${normalized}contact.web3forms.json`;
}

/**
 * Submits contact inquiries via Web3Forms (access key from same-origin config).
 */
@Injectable({ providedIn: 'root' })
export class ContactDataService {
  readonly #http = inject(HttpClient);
  #accessKey: string | null = null;

  async submit(inquiry: ContactInquiry): Promise<void> {
    const accessKey = await this.#resolveAccessKey();

    const body = {
      access_key: accessKey,
      subject: 'NEO Scout contact inquiry',
      from_name: 'NEO Scout',
      name: inquiry.name,
      email: inquiry.workEmail,
      replyto: inquiry.workEmail,
      company: inquiry.company,
      employee_count: inquiry.employeeCount,
      message: inquiry.message,
    };

    try {
      const response = await firstValueFrom(
        this.#http.post<Web3FormsSubmitResponse>(WEB3FORMS_SUBMIT_URL, body, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      if (!response?.success) {
        throw new Error(
          response?.message?.trim() ||
            'Unable to deliver your message. Please try again.',
        );
      }
    } catch (error) {
      throw toSubmitError(error);
    }
  }

  async #resolveAccessKey(): Promise<string> {
    if (this.#accessKey) {
      return this.#accessKey;
    }

    let config: ContactWeb3FormsConfig;
    try {
      config = await firstValueFrom(
        this.#http.get<ContactWeb3FormsConfig>(contactWeb3FormsConfigUrl()),
      );
    } catch {
      throw new Error(
        'Contact form is not configured. Add contact.web3forms.json locally or set WEB3FORMS_ACCESS_KEY for Pages.',
      );
    }

    const key = config?.accessKey?.trim() ?? '';
    if (!key || key === PLACEHOLDER_ACCESS_KEY) {
      throw new Error(
        'Contact form is not configured. Add contact.web3forms.json locally or set WEB3FORMS_ACCESS_KEY for Pages.',
      );
    }

    this.#accessKey = key;
    return key;
  }
}

function toSubmitError(error: unknown): Error {
  if (error instanceof HttpErrorResponse) {
    const payload = error.error as Web3FormsSubmitResponse | string | null;
    if (payload && typeof payload === 'object' && payload.message?.trim()) {
      return new Error(payload.message.trim());
    }
    if (typeof payload === 'string' && payload.trim()) {
      return new Error(payload.trim());
    }
    return new Error('Unable to deliver your message. Please try again.');
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('Unable to deliver your message. Please try again.');
}
