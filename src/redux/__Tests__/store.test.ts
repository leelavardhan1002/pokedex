import { configureStore } from '@reduxjs/toolkit';
import { store, RootState } from '../store';
import searchReducer from '../slices/searchSlice';

jest.mock('../slices/searchSlice', () => ({
  __esModule: true,
  default: jest.fn((state = {}) => state),
}));

describe('Redux Store', () => {
  it('should create the store with the correct reducer structure', () => {
    expect(store.getState()).toEqual({
      search: expect.any(Object),
    });
  });

  it('should use the correct reducers', () => {
    const mockStore = configureStore({
      reducer: {
        search: searchReducer,
      },
    });

    expect(store.getState()).toEqual(mockStore.getState());
  });

  it('should have the correct type for RootState', () => {
    const state: RootState = store.getState();
    expect(state).toHaveProperty('search');
  });

  it('should have the correct type for AppDispatch', () => {
    const { dispatch } = store;
    expect(typeof dispatch).toBe('function');
  });

  it('should allow dispatching actions', () => {
    const action = { type: 'TEST_ACTION' };
    store.dispatch(action);
    expect(searchReducer).toHaveBeenCalledWith(expect.any(Object), action);
  });
});
