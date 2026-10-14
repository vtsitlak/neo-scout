import { ScoutCandidate } from '@neo-scout/api';
import type { ColDef, ValueGetterParams } from 'ag-grid-community';

const sortableField = (
  field: keyof ScoutCandidate,
  headerName: string,
  minWidth = 110,
): ColDef<ScoutCandidate> => ({
  field,
  headerName,
  sortable: true,
  filter: false,
  resizable: true,
  minWidth,
  flex: 1,
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

/**
 * Default Scout grid columns: identity, filter targets, and key observability fields.
 * Remaining ScoutCandidate fields stay available on the model for later detail/chooser work.
 */
export const SCOUT_COLUMN_DEFS: ColDef<ScoutCandidate>[] = [
  rowNumberColumn,
  sortableField('objectName', 'Object', 120),
  sortableField('neoScore', 'NEO score', 120),
  sortableField('phaScore', 'PHA score', 120),
  sortableField('caDist', 'Close approach', 140),
  sortableField('moid', 'MOID', 100),
  sortableField('H', 'Abs. magnitude (H)', 160),
  sortableField('Vmag', 'Apparent mag.', 140),
  sortableField('nObs', 'Observations', 130),
  sortableField('arc', 'Arc (days)', 120),
  sortableField('lastRun', 'Last run', 140),
];
