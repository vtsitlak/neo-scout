import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import type { IHeaderParams } from 'ag-grid-community';
import type { IInnerHeaderAngularComp } from 'ag-grid-angular';
import { Tooltip } from 'primeng/tooltip';

export interface ScoutColumnInnerHeaderParams {
  description?: string;
}

@Component({
  selector: 'neo-scout-column-inner-header',
  imports: [Tooltip],
  template: `
    <span
      class="scout-col-header-label cursor-help"
      [pTooltip]="description()"
      tooltipPosition="top"
      [appendTo]="'body'"
      [showDelay]="200"
    >
      {{ displayName() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoutColumnInnerHeader implements IInnerHeaderAngularComp {
  protected readonly displayName = signal('');
  protected readonly description = signal('');

  agInit(params: IHeaderParams & ScoutColumnInnerHeaderParams): void {
    this.apply(params);
  }

  refresh(params: IHeaderParams & ScoutColumnInnerHeaderParams): boolean {
    this.apply(params);
    return true;
  }

  private apply(params: IHeaderParams & ScoutColumnInnerHeaderParams): void {
    this.displayName.set(params.displayName);
    this.description.set(params.description ?? '');
  }
}
