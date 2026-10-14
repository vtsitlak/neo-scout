import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  email,
  FieldTree,
  form,
  FormField,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import {
  ContactEmployeeCount,
  ContactFacade,
  ContactInquiry,
} from '@neo-scout/stores/contact';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';

const emptyInquiry = (): ContactInquiry => ({
  name: '',
  workEmail: '',
  company: '',
  employeeCount: '',
  message: '',
});

const fieldControlClass =
  'w-full rounded-md border bg-[var(--ns-bg-elevated)] px-3 py-2 text-sm text-[var(--ns-fg)]';

@Component({
  selector: 'neo-contact',
  imports: [Button, Divider, FormField, Message],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class Contact {
  private readonly contactFacade = inject(ContactFacade);

  readonly status = this.contactFacade.status;
  readonly lastInquiry = this.contactFacade.lastInquiry;

  readonly #draftModel = signal<ContactInquiry>(emptyInquiry());
  readonly inquiryForm = form(this.#draftModel, (inquiry) => {
    required(inquiry.name, { message: 'Name is required' });
    required(inquiry.workEmail, { message: 'Work email is required' });
    email(inquiry.workEmail, { message: 'Enter a valid work email' });
    required(inquiry.message, { message: 'Message is required' });
    minLength(inquiry.message, 20, {
      message: 'Message must be at least 20 characters',
    });
  });

  readonly employeeCountOptions: {
    label: string;
    value: ContactEmployeeCount;
  }[] = [
    { label: 'Select company size (optional)', value: '' },
    { label: '1–10', value: '1-10' },
    { label: '11–50', value: '11-50' },
    { label: '51–200', value: '51-200' },
    { label: '201–500', value: '201-500' },
    { label: '500+', value: '500+' },
  ];

  readonly isSubmitting = computed(() => this.status() === 'submitting');
  readonly showSuccess = computed(() => this.status() === 'success');

  protected fieldError(field: FieldTree<string>): string | null {
    const state = field();
    if (!state.touched() || !state.invalid()) {
      return null;
    }
    const first = state.errors()[0];
    return first?.message ?? first?.kind ?? 'Invalid value';
  }

  /** Neutral border until touched; avoid PrimeNG/HTML :invalid red on load. */
  protected fieldClass(field: FieldTree<string>): string {
    const border = this.fieldError(field)
      ? 'border-red-400'
      : 'border-[var(--ns-border)]';
    return `${fieldControlClass} ${border}`;
  }

  protected async onSubmit(): Promise<void> {
    await submit(this.inquiryForm, async () => {
      await this.contactFacade.submit({ ...this.#draftModel() });
    });
  }

  protected sendAnother(): void {
    // Clears touched/dirty so required errors are not shown on the fresh form.
    this.inquiryForm().reset(emptyInquiry());
    this.contactFacade.reset();
  }
}
