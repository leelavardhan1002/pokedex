import { render, screen } from '@testing-library/react';
import { Metadata } from 'next';
import Home, { generateMetadata } from '../page';
import '@testing-library/jest-dom';

jest.mock(
  '../../components/organisms/pokemonList',
  () =>
    function pokemonList() {
      return <div>PokemonListClient</div>;
    }
);
jest.mock(
  '../../components/organisms/header',
  () =>
    function header() {
      return <div>Header</div>;
    }
);
jest.mock('../../api/data', () => ({
  fetchPokemons: jest.fn().mockResolvedValue({
    pokemons: [],
    totalPages: 1,
    error: null,
  }),
}));

describe('generateMetadata', () => {
  it('should generate correct metadata with provided page', async () => {
    const searchParams = { page: '2' };
    const expected: Metadata = {
      title: 'Pokémons - Page 2',
      description:
        'Browse through a list of Pokémon on page 2 with filtering and pagination options.',
    };
    const result = await generateMetadata({ searchParams });
    expect(result).toEqual(expected);
  });

  it('should generate correct metadata with default page', async () => {
    const expected: Metadata = {
      title: 'Pokémons - Page 1',
      description:
        'Browse through a list of Pokémon on page 1 with filtering and pagination options.',
    };
    const result = await generateMetadata({ searchParams: { page: '1' } });
    expect(result).toEqual(expected);
  });
});

describe('Home', () => {
  it('should render correctly with default values', async () => {
    render(
      await Home({
        searchParams: {
          page: '',
          limit: '',
        },
      })
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('PokemonListClient')).toBeInTheDocument();
  });

  it('should render correctly with provided search params', async () => {
    render(await Home({ searchParams: { page: '2', limit: '30' } }));
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('PokemonListClient')).toBeInTheDocument();
  });

  it('should handle non-numeric page and limit', async () => {
    render(await Home({ searchParams: { page: 'abc', limit: 'def' } }));
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('PokemonListClient')).toBeInTheDocument();
  });
});
