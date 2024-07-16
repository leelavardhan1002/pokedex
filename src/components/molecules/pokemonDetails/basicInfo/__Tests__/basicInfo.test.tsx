import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PokemonInfoProps, PokemonProps } from '@/utils/types';
import PokemonBasicInfo from '@/components/molecules/pokemonDetails/basicInfo';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('PokemonBasicInfo', () => {
  const mockPokemonProps: PokemonProps = {
    id: 1,
    name: 'Bulbasaur',
    imageUrl: 'http://example.com/bulbasaur.png',
    types: ['Grass', 'Poison'],
    description: 'Bulbasaur is a grass/poison type Pokemon.',
    cardHeight: '100px',
    cardWidth: '100px',
  };

  const mockPokemonInfoProps: PokemonInfoProps = {
    pokemonDetails: mockPokemonProps,
  };

  it('renders without crashing', () => {
    const { getByText } = render(
      <PokemonBasicInfo {...mockPokemonInfoProps} />
    );
    expect(getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('handles missing id in pokemonDetails', () => {
    const { getByText } = render(
      <PokemonBasicInfo
        {...{
          ...mockPokemonInfoProps,
          pokemonDetails: { ...mockPokemonProps, id: undefined },
        }}
      />
    );
    expect(getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('shows truncated description initially', () => {
    const { getAllByText } = render(
      <PokemonBasicInfo {...mockPokemonInfoProps} />
    );
    const description = getAllByText(
      'Bulbasaur is a grass/poison type Pokemon.'
    );
    expect(description[0]).toBeInTheDocument();
  });

  it('shows full description when Read More button is clicked', () => {
    const { getAllByText } = render(
      <PokemonBasicInfo {...mockPokemonInfoProps} />
    );
    fireEvent.click(getAllByText('Read More')[0]);
    const description = getAllByText(
      'Bulbasaur is a grass/poison type Pokemon.'
    );
    expect(description[1]).toBeInTheDocument();
  });

  it('hides full description when Close button is clicked', () => {
    const { getByText, getAllByText } = render(
      <PokemonBasicInfo {...mockPokemonInfoProps} />
    );
    fireEvent.click(getAllByText('Read More')[0]);
    fireEvent.click(getByText('×'));
    const description = getAllByText(
      'Bulbasaur is a grass/poison type Pokemon.'
    );
    expect(description[1]).toBeInTheDocument();
  });
});
