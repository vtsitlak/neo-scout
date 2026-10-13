import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import { Button } from 'primeng/button';
import { AppStore } from './app.store';

type ScoutRow = {
  name: string;
  status: string;
};

@Component({
  imports: [RouterModule, Button, AgGridAngular],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(AppStore);

  /** AG Grid Community theme — no Enterprise licence required. */
  protected readonly gridTheme = themeQuartz;

  protected readonly columnDefs: ColDef<ScoutRow>[] = [
    { field: 'name', flex: 1 },
    { field: 'status', flex: 1 },
  ];

  protected readonly rowData: ScoutRow[] = [
    { name: 'Workspace', status: 'Initialized' },
    { name: 'PrimeNG', status: 'Ready' },
    { name: 'AG Grid Community', status: 'Ready' },
  ];
}
