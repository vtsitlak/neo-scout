import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

/** Match app bootstrap so grid options like `rowStyle` resolve in unit tests. */
ModuleRegistry.registerModules([AllCommunityModule]);

setupTestBed();
