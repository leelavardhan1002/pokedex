import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonStats from '@/components/molecules/pokemonDetails/stats';

describe('PokemonStats', () => {
  const mockPokemonStats = [
    { stat: { name: 'HP' }, base_stat: 49 },
    { stat: { name: 'Attack' }, base_stat: 65 },
    { stat: { name: 'Defense' }, base_stat: 65 },
    { stat: { name: 'Sp.Attack' }, base_stat: 45 },
    { stat: { name: 'Sp.Def' }, base_stat: 55 },
    { stat: { name: 'Speed' }, base_stat: 60 },
  ];

  const mockPokemonInfoProps = {
    pokemonDetails: {
      types: ['Fire', 'Flying'],
      pokemonStats: mockPokemonStats,
    },
  };

  it('renders without crashing', () => {
    render(<PokemonStats {...mockPokemonInfoProps} />);
    expect(screen.getByText('Stats')).toBeInTheDocument();
  });

  it('renders the correct number of stats', () => {
    render(<PokemonStats {...mockPokemonInfoProps} />);
    const statsElements = screen.getAllByText(
      /HP|Attack|Defense|Sp\.Attack|Sp\.Def|Speed/
    );
    expect(statsElements).toHaveLength(mockPokemonStats.length);
  });

  it('renders stat values correctly', () => {
    render(<PokemonStats {...mockPokemonInfoProps} />);
    mockPokemonStats.forEach((stat) => {
      const matchingElements = screen.getAllByText(stat.base_stat.toString());
      const statCount = mockPokemonStats.filter(
        (s) => s.base_stat === stat.base_stat
      ).length;
      expect(matchingElements).toHaveLength(statCount);
    });
  });
});
