import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'neo-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
