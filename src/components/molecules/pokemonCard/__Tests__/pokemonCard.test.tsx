import React from 'react';
import { render } from '@testing-library/react';
import PokemonCard from '@/components/molecules/pokemonCard';
import '@testing-library/jest-dom';

jest.mock(
  'next/image',
  () =>
    function Image({ src, alt }: { src: string; alt: string }) {
      return <img src={src} alt={alt} />;
    }
);
jest.mock(
  'next/link',
  () =>
    function Link({ children }: { children: React.ReactNode }) {
      return <div>{children}</div>;
    }
);
describe('PokemonCard Component', () => {
  test('renders with provided values', () => {
    const { getByAltText, getByText } = render(
      <PokemonCard
        imageUrl="example.png"
        name="Pikachu"
        id={25}
        types={['electric']}
      />
    );

    expect(getByAltText('Pikachu')).toBeInTheDocument();
    expect(getByText('PIKACHU')).toBeInTheDocument();
    expect(getByText('025')).toBeInTheDocument();
  });

  test('renders with custom dimensions', () => {
    const { container } = render(
      <PokemonCard
        types={['fire']}
        cardWidth="200px"
        cardHeight="300px"
        divWidth="w-[100px]"
        divHeight="h-[150px]"
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle('width: 200px');
    expect(card).toHaveStyle('height: 300px');
    expect(card.firstChild).toHaveClass('flex justify-center items-center');
    expect(card.firstChild).toHaveClass('flex justify-center items-center');
  });

  test('renders with different types', () => {
    const { container } = render(<PokemonCard types={['water', 'poison']} />);

    const card = container.firstChild;
    expect(card).toHaveClass('from-WATER');
    expect(card).toHaveClass('to-POISON');
  });

  test('hides ID when showId is false', () => {
    const { queryByText } = render(
      <PokemonCard types={['fire']} name="Squirtle" id={7} showId={false} />
    );

    expect(queryByText('007')).toBeNull();
  });

  test('applies correct styling based on Pokémon types', () => {
    const testCases = [
      { types: ['Fire'], expectedClasses: ['from-FIRE', 'to-NORMAL'] },
      { types: ['Water'], expectedClasses: ['from-WATER', 'to-NORMAL'] },
    ];

    // Iterate through each test case
    testCases.forEach(({ types, expectedClasses }) => {
      const { container } = render(<PokemonCard types={types} />);

      expectedClasses.forEach((className) => {
        expect(container.firstChild).toHaveClass(className);
      });
    });
  });

  test('displays Pokémon name correctly', () => {
    const pokemonName = 'Pikachu';

    const { getByText } = render(
      <PokemonCard name={pokemonName} types={['Electric']} />
    );

    expect(getByText(pokemonName.toUpperCase())).toBeInTheDocument();
  });

  test('displays Pokémon ID correctly', () => {
    const pokemonId = 25;

    const { getByText } = render(
      <PokemonCard id={pokemonId} types={['Electric']} />
    );

    expect(
      getByText(pokemonId.toString().padStart(3, '0'))
    ).toBeInTheDocument();
  });

  test('displays Pokémon name and ID when showId prop is true', () => {
    const pokemonName = 'Pikachu';
    const pokemonId = 25;

    const { getByText } = render(
      <PokemonCard
        name={pokemonName}
        id={pokemonId}
        showId
        types={['Electric']}
      />
    );

    expect(getByText(pokemonName.toUpperCase())).toBeInTheDocument();
    expect(
      getByText(pokemonId.toString().padStart(3, '0'))
    ).toBeInTheDocument();
  });

  test('does not display Pokémon name and ID when showId prop is false', () => {
    const pokemonName = 'Pikachu';
    const pokemonId = 25;

    const { queryByText } = render(
      <PokemonCard
        name={pokemonName}
        id={pokemonId}
        showId={false}
        types={['Electric']}
      />
    );

    expect(queryByText(pokemonName.toUpperCase())).toBeNull();
    expect(queryByText(pokemonId.toString().padStart(3, '0'))).toBeNull();
  });

  test('applies correct colors based on Pokémon types', () => {
    const testCases = [
      { types: ['Fire'], expectedClasses: ['from-FIRE', 'to-NORMAL'] },
      { types: ['Water'], expectedClasses: ['from-WATER', 'to-NORMAL'] },
      { types: ['Grass'], expectedClasses: ['from-GRASS', 'to-NORMAL'] },
      {
        types: ['Electric'],
        expectedClasses: ['from-ELECTRIC', 'to-NORMAL'],
      },
      { types: ['Ice'], expectedClasses: ['from-ICE', 'to-NORMAL'] },
      {
        types: ['Fighting'],
        expectedClasses: ['from-FIGHTING', 'to-NORMAL'],
      },
      { types: ['Poison'], expectedClasses: ['from-POISON', 'to-NORMAL'] },
      { types: ['Ground'], expectedClasses: ['from-GROUND', 'to-NORMAL'] },
      { types: ['Flying'], expectedClasses: ['from-FLYING', 'to-NORMAL'] },
      { types: ['Psychic'], expectedClasses: ['from-PSYCHIC', 'to-NORMAL'] },
      { types: ['Bug'], expectedClasses: ['from-BUG', 'to-NORMAL'] },
      { types: ['Rock'], expectedClasses: ['from-ROCK', 'to-NORMAL'] },
      { types: ['Ghost'], expectedClasses: ['from-GHOST', 'to-NORMAL'] },
      { types: ['Dragon'], expectedClasses: ['from-DRAGON', 'to-NORMAL'] },
      { types: ['Dark'], expectedClasses: ['from-DARK', 'to-NORMAL'] },
      { types: ['Steel'], expectedClasses: ['from-STEEL', 'to-NORMAL'] },
      { types: ['Fairy'], expectedClasses: ['from-FAIRY', 'to-NORMAL'] },
      { types: ['Normal'], expectedClasses: ['from-NORMAL', 'to-NORMAL'] },
      {
        types: ['Fire', 'Water'],
        expectedClasses: ['from-FIRE', 'to-WATER'],
      },
      {
        types: ['Water', 'Grass'],
        expectedClasses: ['from-WATER', 'to-GRASS'],
      },
    ];

    testCases.forEach(({ types, expectedClasses }) => {
      const { container } = render(<PokemonCard types={types} />);

      expectedClasses.forEach((className) => {
        expect(container.firstChild).toHaveClass(className);
      });
    });
  });
});
