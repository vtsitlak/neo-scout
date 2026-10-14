import { ScoutCandidate } from '@neo-scout/api';
import type { ColDef, ValueGetterParams } from 'ag-grid-community';
import { ScoutColumnInnerHeader } from './scout-column-inner-header';
import { SCOUT_FIELD_META, SCOUT_ROW_NUMBER_META } from './scout-field-meta';

const withPrimeHeaderTooltip = (
  headerName: string,
  description: string,
): Pick<ColDef<ScoutCandidate>, 'headerName' | 'headerComponentParams'> => ({
  headerName,
  headerComponentParams: {
    innerHeaderComponent: ScoutColumnInnerHeader,
    innerHeaderComponentParams: { description },
  },
});

const sortableField = (
  field: keyof ScoutCandidate,
  minWidth = 110,
): ColDef<ScoutCandidate> => {
  const meta = SCOUT_FIELD_META[field];
  return {
    field,
    ...withPrimeHeaderTooltip(meta.label, meta.description),
    sortable: true,
    filter: false,
    resizable: true,
    minWidth,
    flex: 1,
  };
};

/** Display index only — not a data field, so not sortable. */
const rowNumberColumn: ColDef<ScoutCandidate> = {
  colId: 'rowNumber',
  ...withPrimeHeaderTooltip(
    SCOUT_ROW_NUMBER_META.label,
    SCOUT_ROW_NUMBER_META.description,
  ),
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
  sortableField('objectName', 120),
  sortableField('neoScore', 120),
  sortableField('phaScore', 120),
  sortableField('caDist', 140),
  sortableField('moid', 100),
  sortableField('H', 160),
  sortableField('Vmag', 140),
  sortableField('nObs', 130),
  sortableField('arc', 120),
  sortableField('lastRun', 140),
];
