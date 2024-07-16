import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PokemonProps } from '@/utils/types';
import EvolutionChain from '..';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

// Mock react-icons
jest.mock('react-icons/io', () => ({
  IoIosArrowRoundForward: () => <div data-testid="arrow-icon" />,
}));

jest.mock('react-icons/bs', () => ({
  BsArrowLeftCircle: () => <div data-testid="left-arrow-icon" />,
  BsArrowRightCircle: () => <div data-testid="right-arrow-icon" />,
}));

// Mock PokemonCard component
jest.mock('../../../pokemonCard', () => {
  return function MockPokemonCard({ name }: { name: string }) {
    return <div data-testid={`pokemon-card-${name}`}>{name}</div>;
  };
});

describe('EvolutionChain', () => {
  const mockPokemonDetails: PokemonProps = {
    id: 1,
    name: 'Bulbasaur',
    types: ['Grass', 'Poison'],
    details: [
      {
        id: 1,
        pokemonName: 'Bulbasaur',
        imageUrl: 'bulbasaur.png',
        types: ['Grass', 'Poison'],
      },
      {
        id: 2,
        pokemonName: 'Ivysaur',
        imageUrl: 'ivysaur.png',
        types: ['Grass', 'Poison'],
      },
      {
        id: 3,
        pokemonName: 'Venusaur',
        imageUrl: 'venusaur.png',
        types: ['Grass', 'Poison'],
      },
    ],
    prevPokemonName: 'Mew',
    nextPokemonName: 'Ivysaur',
  };

  it('renders evolution chain correctly', async () => {
    render(<EvolutionChain pokemonDetails={mockPokemonDetails} />);

    await waitFor(() => {
      expect(screen.getByText('Evolution Chain')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-card-Bulbasaur')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-card-Ivysaur')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-card-Venusaur')).toBeInTheDocument();
      expect(screen.getAllByTestId('arrow-icon')).toHaveLength(2);
    });
  });

  it('renders previous and next Pokemon buttons', async () => {
    render(<EvolutionChain pokemonDetails={mockPokemonDetails} />);

    await waitFor(() => {
      expect(screen.getByText('MEW')).toBeInTheDocument();
      expect(screen.getByText('IVYSAUR')).toBeInTheDocument();
      expect(screen.getByTestId('left-arrow-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-arrow-icon')).toBeInTheDocument();
    });
  });

  it('does not render previous Pokemon button when there is no previous Pokemon', async () => {
    const noPreviewPokemon = { ...mockPokemonDetails, prevPokemonName: '' };
    render(<EvolutionChain pokemonDetails={noPreviewPokemon} />);

    await waitFor(() => {
      expect(screen.queryByText('MEW')).not.toBeInTheDocument();
      expect(screen.queryByTestId('left-arrow-icon')).not.toBeInTheDocument();
    });
  });

  it('does not render next Pokemon button when there is no next Pokemon', async () => {
    const noNextPokemon = { ...mockPokemonDetails, nextPokemonName: '' };
    render(<EvolutionChain pokemonDetails={noNextPokemon} />);

    await waitFor(() => {
      expect(screen.queryByText('IVYSAUR')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right-arrow-icon')).not.toBeInTheDocument();
    });
  });

  it('handles case when Pokemon details are not available', async () => {
    const noPokemonDetails = {
      ...mockPokemonDetails,
      details: undefined,
      nextPokemonName: undefined,
      prevPokemonName: undefined,
    };
    render(<EvolutionChain pokemonDetails={noPokemonDetails} />);

    await waitFor(() => {
      expect(screen.getByText('Evolution Chain')).toBeInTheDocument();
      expect(
        screen.queryByTestId('pokemon-card-Bulbasaur')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('arrow-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('MEW')).not.toBeInTheDocument();
      expect(screen.queryByText('IVYSAUR')).not.toBeInTheDocument();
    });
  });
});
