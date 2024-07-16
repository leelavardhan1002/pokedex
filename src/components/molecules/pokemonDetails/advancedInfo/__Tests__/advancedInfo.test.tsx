import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonAdvancedInfo from '@/components/molecules/pokemonDetails/advancedInfo';

describe('PokemonAdvancedInfo', () => {
  const mockPokemonDetails = {
    height: '10',
    weight: '100',
    gender: ['Male', 'Female'],
    eggGroups: ['Group1', 'Group2'],
    abilities: ['Ability1', 'Ability2'],
    types: ['Fire', 'Water'],
    weakAgainst: ['Grass', 'Electric'],
  };

  it('renders correctly', () => {
    render(<PokemonAdvancedInfo pokemonDetails={mockPokemonDetails} />);

    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Gender(s)')).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
    expect(screen.getByText(/Female/)).toBeInTheDocument();

    expect(screen.getByText('Egg Groups')).toBeInTheDocument();
    expect(screen.getByText(/Group1/)).toBeInTheDocument();
    expect(screen.getByText('Group2')).toBeInTheDocument();

    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText(/Ability1/)).toBeInTheDocument();
    expect(screen.getByText('Ability2')).toBeInTheDocument();

    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();

    expect(screen.getByText('Weak Against')).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  it('renders type colors correctly', () => {
    const types = [
      'Fire',
      'Water',
      'Grass',
      'Electric',
      'Ice',
      'Fighting',
      'Poison',
      'Ground',
      'Flying',
      'Psychic',
      'Bug',
      'Rock',
      'Ghost',
      'Dragon',
      'Dark',
      'Steel',
      'Fairy',
      'Normal',
    ];

    types.forEach((type) => {
      const mockPokemonDetails = {
        types: [type],
        gender: [],
        eggGroups: [],
        abilities: [],
        weakAgainst: [],
      };

      render(<PokemonAdvancedInfo pokemonDetails={mockPokemonDetails} />);

      const typeElement = screen.getByText(type);
      expect(typeElement).toBeInTheDocument();
      expect(typeElement).toHaveClass(`bg-${type.toUpperCase()}`);
    });
  });
});
