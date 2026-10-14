import { ScoutCandidate } from '@neo-scout/api';
import type { ColDef, ValueGetterParams } from 'ag-grid-community';

const sortableField = (
  field: keyof ScoutCandidate,
  headerName: string,
  width?: number,
): ColDef<ScoutCandidate> => ({
  field,
  headerName,
  sortable: true,
  filter: false,
  resizable: true,
  ...(width ? { width } : { minWidth: 110 }),
});

/** Display index only — not a data field, so not sortable. */
const rowNumberColumn: ColDef<ScoutCandidate> = {
  colId: 'rowNumber',
  headerName: '#',
  width: 64,
  maxWidth: 72,
  pinned: 'left',
  sortable: false,
  filter: false,
  resizable: false,
  suppressHeaderMenuButton: true,
  valueGetter: (params: ValueGetterParams<ScoutCandidate>) =>
    params.node?.rowIndex == null ? '' : params.node.rowIndex + 1,
};

/** Row index + all ScoutCandidate fields as AG Grid columns. */
export const SCOUT_COLUMN_DEFS: ColDef<ScoutCandidate>[] = [
  rowNumberColumn,
  sortableField('objectName', 'Object', 120),
  sortableField('neoScore', 'NEO', 90),
  sortableField('phaScore', 'PHA', 90),
  sortableField('neo1kmScore', 'NEO 1km', 100),
  sortableField('ieoScore', 'IEO', 90),
  sortableField('geocentricScore', 'Geocentric', 110),
  sortableField('tisserandScore', 'Tisserand', 110),
  sortableField('rating', 'Rating', 90),
  sortableField('moid', 'MOID', 100),
  sortableField('caDist', 'CA dist', 100),
  sortableField('H', 'H', 80),
  sortableField('Vmag', 'Vmag', 90),
  sortableField('nObs', 'nObs', 90),
  sortableField('arc', 'Arc', 100),
  sortableField('rmsN', 'rmsN', 90),
  sortableField('unc', 'Unc', 90),
  sortableField('uncP1', 'Unc P1', 90),
  sortableField('ra', 'RA', 90),
  sortableField('dec', 'Dec', 90),
  sortableField('elong', 'Elong', 90),
  sortableField('rate', 'Rate', 90),
  sortableField('vInf', 'vInf', 90),
  sortableField('lastRun', 'Last run', 150),
  sortableField('tEphem', 'tEphem', 150),
];
