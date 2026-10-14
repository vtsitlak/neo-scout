import {
  draftToScoutFilter,
  emptyScoutFilterDraft,
  scoutFilterToDraft,
} from './scout-filter-dialog.mapper';

describe('scout-filter-dialog.mapper', () => {
  it('should build an empty draft', () => {
    expect(emptyScoutFilterDraft()).toEqual({
      minNeoScore: null,
      minPhaScore: null,
      hasCloseApproach: false,
    });
  });

  it('should map a store filter into a draft', () => {
    expect(
      scoutFilterToDraft({
        minNeoScore: 40,
        hasCloseApproach: true,
      }),
    ).toEqual({
      minNeoScore: 40,
      minPhaScore: null,
      hasCloseApproach: true,
    });
  });

  it('should map a draft into a store filter and clamp scores', () => {
    expect(
      draftToScoutFilter({
        minNeoScore: -5,
        minPhaScore: 150,
        hasCloseApproach: true,
      }),
    ).toEqual({
      minNeoScore: 0,
      minPhaScore: 100,
      hasCloseApproach: true,
    });
  });

  it('should omit unset draft fields from the store filter', () => {
    expect(draftToScoutFilter(emptyScoutFilterDraft())).toEqual({});
  });
});
