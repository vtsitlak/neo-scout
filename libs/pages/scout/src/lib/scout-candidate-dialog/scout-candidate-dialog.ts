import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ScoutCandidate } from '@neo-scout/api';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import {
  formatScoutDetailValue,
  hazardInterest,
  SCOUT_DETAIL_SECTIONS,
} from './scout-candidate-detail.model';

@Component({
  selector: 'neo-scout-candidate-dialog',
  imports: [Button, Dialog, Divider, PrimeTemplate, Tag],
  templateUrl: './scout-candidate-dialog.html',
  styleUrl: './scout-candidate-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoutCandidateDialog {
  readonly visible = input(false);
  readonly candidate = input<ScoutCandidate | null>(null);

  readonly visibleChange = output<boolean>();

  protected readonly sections = SCOUT_DETAIL_SECTIONS;

  protected readonly dialogHeader = computed(
    () => this.candidate()?.objectName ?? 'Candidate',
  );

  protected readonly scoreTags = computed(() => {
    const current = this.candidate();
    if (!current) {
      return [];
    }
    return [
      {
        label: 'Hazard interest',
        value: hazardInterest(current),
        severity: 'warn' as const,
      },
      { label: 'NEO', value: current.neoScore, severity: 'info' as const },
      { label: 'PHA', value: current.phaScore, severity: 'info' as const },
      {
        label: 'Rating',
        value: current.rating,
        severity: 'secondary' as const,
      },
    ];
  });

  protected formatValue = formatScoutDetailValue;

  protected fieldValue(
    candidate: ScoutCandidate,
    key: keyof ScoutCandidate,
  ): string {
    return formatScoutDetailValue(candidate[key]);
  }

  protected onVisibleChange(open: boolean): void {
    this.visibleChange.emit(open);
  }

  protected close(): void {
    this.visibleChange.emit(false);
  }
}
