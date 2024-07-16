import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/atoms/searchBar';
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '',
    query: { search: 'test' },
    asPath: '',
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation(() => ''),
  }),
}));

const mockReducer = (state = {}) => {
  return state;
};

const mockStore = configureStore({
  reducer: mockReducer,
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('SearchBar component', () => {
  it('should render with initial state', () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <Provider store={mockStore}>
        <SearchBar />
      </Provider>
    );
    expect(getByLabelText('Search by')).toBeInTheDocument();
    expect(getByPlaceholderText('Name or Number')).toBeInTheDocument();
  });

  it('should update search query on input change', () => {
    const { getByPlaceholderText } = render(
      <Provider store={mockStore}>
        <SearchBar />
      </Provider>
    );
    const input = getByPlaceholderText('Name or Number') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });

  it('should clear search on clear button click', () => {
    const { getByPlaceholderText, getByRole } = render(
      <Provider store={mockStore}>
        <SearchBar />
      </Provider>
    );
    const input = getByPlaceholderText('Name or Number') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    const clearButton = getByRole('button');
    fireEvent.click(clearButton);
    expect(input.value).toBe('');
  });
});
