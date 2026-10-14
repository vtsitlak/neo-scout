import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Divider } from 'primeng/divider';
import type { AppInfo } from './app-info';

@Component({
  selector: 'neo-info-footer',
  imports: [Divider],
  templateUrl: './info-footer.html',
  styleUrl: './info-footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mt-auto block w-full',
  },
})
export class InfoFooter {
  readonly appInfo = input.required<AppInfo>();
}
