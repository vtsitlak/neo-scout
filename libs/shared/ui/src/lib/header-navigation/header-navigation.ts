import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import type { MenuItem } from './menu-item';

@Component({
  selector: 'neo-header-navigation',
  imports: [Toolbar, ButtonDirective, RouterLink, RouterLinkActive],
  templateUrl: './header-navigation.html',
  styleUrl: './header-navigation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class HeaderNavigation {
  /** Primary navigation destinations; the active route uses a filled primary button. */
  readonly items = input<readonly MenuItem[]>([]);
}
