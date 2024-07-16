import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Header from '@/components/organisms/header';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { capitalizeFirstLetter } from '@/utils/helper';

jest.mock('axios');

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

describe('Header', () => {
  beforeEach(() => {
    const mockedResponse = {
      data: {
        results: [{ name: 'normal' }, { name: 'fighting' }, { name: 'flying' }],
      },
    };

    axios.get = jest.fn().mockResolvedValue(mockedResponse);
  });

  test('renders the header structure', () => {
    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Pokédex')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('fetches types on component mount', async () => {
    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type');
    });
  });

  test('capitalizes the first letter of a string', () => {
    expect(capitalizeFirstLetter('normal')).toBe('Normal');
    expect(capitalizeFirstLetter('Fighting')).toBe('Fighting');
  });

  test('renders FilterDropdown and StatsDropdown components', () => {
    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    );

    const filterDropdowns = screen.getAllByRole('combobox');
    expect(filterDropdowns).toHaveLength(2);

    const statsDropdown = screen.getAllByRole('combobox');
    expect(statsDropdown[0]).toBeInTheDocument();
    expect(statsDropdown[1]).toBeInTheDocument();
  });

  test('renders SearchBar component', () => {
    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    );

    const searchBar = screen.getByRole('textbox');
    expect(searchBar).toBeInTheDocument();
  });
});
