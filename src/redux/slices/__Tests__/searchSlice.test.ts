import searchReducer, { setSearchQuery } from '../searchSlice';

describe('searchSlice', () => {
  const initialState = {
    searchQuery: '',
  };

  it('should return the initial state', () => {
    expect(searchReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setSearchQuery', () => {
    it('should handle setSearchQuery with a non-empty string', () => {
      const searchQuery = 'Pikachu';
      const actual = searchReducer(initialState, setSearchQuery(searchQuery));
      expect(actual.searchQuery).toEqual(searchQuery);
    });

    it('should handle setSearchQuery with an empty string', () => {
      const stateWithQuery = { searchQuery: 'Charizard' };
      const actual = searchReducer(stateWithQuery, setSearchQuery(''));
      expect(actual.searchQuery).toEqual('');
    });

    it('should handle setSearchQuery with a string containing spaces', () => {
      const searchQuery = '  Mewtwo  ';
      const actual = searchReducer(initialState, setSearchQuery(searchQuery));
      expect(actual.searchQuery).toEqual(searchQuery);
    });
  });

  it('should handle multiple setSearchQuery actions', () => {
    let state = searchReducer(initialState, setSearchQuery('Bulbasaur'));
    state = searchReducer(state, setSearchQuery('Ivysaur'));
    state = searchReducer(state, setSearchQuery('Venusaur'));

    expect(state.searchQuery).toEqual('Venusaur');
  });
});
