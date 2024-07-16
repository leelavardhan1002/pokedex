import React from 'react';
import '@testing-library/jest-dom';
import { fetchPokemonDetails } from '@/api/data';
import { generateMetadata } from '../page';

// Mock the imported components and functions
jest.mock('../../../../components/molecules/pokemonDetails/basicInfo', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-basic-info">Mock Basic Info</div>,
}));

jest.mock(
  '../../../../components/molecules/pokemonDetails/advancedInfo',
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="mock-advanced-info">Mock Advanced Info</div>
    ),
  })
);

jest.mock('../../../../components/molecules/pokemonDetails/stats', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-stats">Mock Stats</div>,
}));

jest.mock(
  '../../../../components/molecules/pokemonDetails/evolutionChain',
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="mock-evolution-chain">Mock Evolution Chain</div>
    ),
  })
);

jest.mock('../../../../components/atoms/loader', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-loader">Mock Loader</div>,
}));

jest.mock('../../../../api/data', () => ({
  fetchPokemonDetails: jest.fn(),
  fetchPokemons: jest.fn(),
}));

jest.mock('../page', () => {
  const originalModule = jest.requireActual('../page');
  return {
    ...originalModule,
    PokemonDetailPageContent: jest.fn(({ id }) => (
      <div data-testid="mock-pokemon-detail-content">
        Pokemon Detail Content for ID: {id}
      </div>
    )),
  };
});

describe('generateStaticParams', () => {
  it('generates correct metadata for existing Pokemon', async () => {
    const mockPokemonDetails = {
      name: 'Bulbasaur',
      types: ['Grass', 'Poison'],
      description: 'A strange seed was planted on its back at birth.',
    };

    (fetchPokemonDetails as jest.Mock).mockResolvedValue(mockPokemonDetails);

    const metadata = await generateMetadata({ params: { id: '1' } });

    expect(metadata).toEqual({
      title: 'Bulbasaur | Pokemon Details',
      description:
        'Learn about Bulbasaur, a Grass/Poison type Pokemon with A strange seed was planted on its back at birth..',
    });

    expect(fetchPokemonDetails).toHaveBeenCalledWith('1');
  });

  it('generates not found metadata for non-existent Pokemon', async () => {
    (fetchPokemonDetails as jest.Mock).mockResolvedValue(null);

    const metadata = await generateMetadata({ params: { id: '999999' } });

    expect(metadata).toEqual({
      title: 'Pokemon Not Found',
      description: 'The requested Pokemon could not be found.',
    });

    expect(fetchPokemonDetails).toHaveBeenCalledWith('999999');
  });
});
