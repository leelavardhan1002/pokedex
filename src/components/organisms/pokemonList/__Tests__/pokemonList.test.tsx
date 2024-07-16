import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/redux/store';
import PokemonListClient from '..';

// Mock the dependencies
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

interface MockPokemonCardProps {
  id: number;
  name: string;
}

jest.mock('../../../molecules/pokemonCard', () => {
  return function MockPokemonCard({ id, name }: MockPokemonCardProps) {
    return <div data-testid={`pokemon-card-${id}`}>{name}</div>;
  };
});
interface MockPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

jest.mock('../../../atoms/pagination', () => {
  return function MockPagination({
    currentPage,
    onPageChange,
  }: MockPaginationProps) {
    return (
      <div data-testid="pagination">
        <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      </div>
    );
  };
});

jest.mock('../../../atoms/loader', () => {
  return function MockLoader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

const mockPokemon = {
  id: '1',
  formattedId: '001',
  name: 'Bulbasaur',
  imageUrl: 'https://example.com/bulbasaur.png',
  type: ['Grass', 'Poison'],
  gender: ['Male', 'Female'],
  stats: [
    { name: 'hp', base_stat: 45 },
    { name: 'attack', base_stat: 49 },
    { name: 'defense', base_stat: 49 },
    { name: 'speed', base_stat: 45 },
    { name: 'special-attack', base_stat: 65 },
    { name: 'special-defense', base_stat: 65 },
  ],
};

describe('PokemonListClient', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockSearchParams = new URLSearchParams();
  const mockPathname = '/pokemon-list';

  beforeEach(() => {
    (useAppSelector as jest.Mock).mockReturnValue('');
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
  });
  it('renders the component with initial pokemons', () => {
    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
  });

  it('filters pokemons based on search query', () => {
    (useAppSelector as jest.Mock).mockReturnValue('Bulba');
    render(
      <PokemonListClient
        initialPokemons={[
          mockPokemon,
          { ...mockPokemon, id: '2', name: 'Charmander' },
        ]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('pokemon-card-2')).not.toBeInTheDocument();
  });

  it('filters pokemons based on gender', () => {
    mockSearchParams.set('genders', 'Male');
    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
  });

  it('filters pokemons based on type', () => {
    mockSearchParams.set('types', 'Grass');
    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
  });

  it('filters pokemons based on stat ranges', () => {
    mockSearchParams.set('HP', '40,50');
    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
  });

  it('handles page change', async () => {
    mockSearchParams.set('genders', 'Male');
    mockSearchParams.set('types', 'Grass');
    mockSearchParams.set('HP', '40,50');

    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={2}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        `${mockPathname}?genders=Male&types=Grass&HP=40%2C50&page=2`,
        undefined
      );
    });
  });

  it('handles limit change', async () => {
    mockSearchParams.set('genders', 'Male');
    mockSearchParams.set('types', 'Grass');
    mockSearchParams.set('HP', '40,50');
    mockSearchParams.set('page', '2');

    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={2}
        limit={20}
        error={null}
      />
    );

    fireEvent.change(screen.getByLabelText('Pokémon per page:'), {
      target: { value: '40' },
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        `${mockPathname}?genders=Male&types=Grass&HP=40%2C50&page=1&limit=40`,
        undefined
      );
    });
  });

  it('displays a message when no pokemons are found', () => {
    (useAppSelector as jest.Mock).mockReturnValue('NonexistentPokemon');
    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    expect(
      screen.getByText(
        'No Pokémon found on this page. Please adjust your filters or pagination.'
      )
    ).toBeInTheDocument();
  });

  it('renders an error component when there is an error', () => {
    render(
      <PokemonListClient
        initialPokemons={[]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={404}
      />
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('shows loader when navigating', async () => {
    jest.useFakeTimers();

    render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={2}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('updates state when search params change', () => {
    const { rerender } = render(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={1}
        limit={20}
        error={null}
      />
    );

    mockSearchParams.set('page', '2');
    mockSearchParams.set('limit', '40');

    rerender(
      <PokemonListClient
        initialPokemons={[mockPokemon]}
        initialTotalPages={1}
        currentPage={2}
        limit={20}
        error={null}
      />
    );

    expect(screen.getByLabelText('Pokémon per page:')).toHaveValue('20');
  });
});
