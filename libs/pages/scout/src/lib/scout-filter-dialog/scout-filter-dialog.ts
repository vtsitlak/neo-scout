import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';
import { ScoutFilter } from '@neo-scout/stores/scout';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import {
  draftToScoutFilter,
  emptyScoutFilterDraft,
  ScoutFilterDraft,
  scoutFilterToDraft,
} from './scout-filter-dialog.mapper';

@Component({
  selector: 'neo-scout-filter-dialog',
  imports: [Button, Dialog, FormField, InputText, PrimeTemplate],
  templateUrl: './scout-filter-dialog.html',
  styleUrl: './scout-filter-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoutFilterDialog {
  readonly visible = input(false);
  readonly filter = input<ScoutFilter>({});

  readonly visibleChange = output<boolean>();
  readonly filterChange = output<ScoutFilter>();

  readonly #draftModel = signal<ScoutFilterDraft>(emptyScoutFilterDraft());
  /** min/max schema mirrors HTML bounds via FormField (0–100 Scout scores). */
  readonly draftForm = form(this.#draftModel, (schema) => {
    min(schema.minNeoScore, 0);
    max(schema.minNeoScore, 100);
    min(schema.minPhaScore, 0);
    max(schema.minPhaScore, 100);
  });

  constructor() {
    // Reset draft from applied filter whenever the dialog opens.
    effect(() => {
      if (!this.visible()) {
        return;
      }
      this.#draftModel.set(scoutFilterToDraft(this.filter()));
    });
  }

  protected onVisibleChange(open: boolean): void {
    this.visibleChange.emit(open);
  }

  protected apply(): void {
    this.filterChange.emit(draftToScoutFilter(this.#draftModel()));
    this.visibleChange.emit(false);
  }

  protected clear(): void {
    this.#draftModel.set(emptyScoutFilterDraft());
    this.filterChange.emit({});
    this.visibleChange.emit(false);
  }

  protected cancel(): void {
    this.visibleChange.emit(false);
  }
}
