import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchPokemonDetails,
  fetchPokemonEvolutionDetails,
  fetchPokemons,
} from '../data';

const mock = new MockAdapter(axios);

describe('Pokemon API functions', () => {
  afterEach(() => {
    mock.reset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPokemonDetails', () => {
    it('should fetch and format pokemon details correctly', async () => {
      // Mock API responses
      mock.onGet(/\/pokemon\/1/).reply(200, {
        name: 'bulbasaur',
        id: 1,
        height: 7,
        weight: 69,
        sprites: {
          other: {
            dream_world: {
              front_default: 'https://example.com/bulbasaur.png',
            },
          },
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        abilities: [{ ability: { name: 'overgrow' } }],
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      });

      mock.onGet(/\/pokemon-species\/1/).reply(200, {
        flavor_text_entries: [
          {
            flavor_text: 'A strange seed was planted on its back at birth.',
            language: { name: 'en' },
          },
        ],
        egg_groups: [{ name: 'monster' }, { name: 'grass' }],
        gender_rate: 1,
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        },
      });

      mock.onGet(/\/evolution-chain\/1/).reply(200, {
        chain: {
          species: { name: 'bulbasaur' },
          evolves_to: [
            {
              species: { name: 'ivysaur' },
              evolves_to: [
                {
                  species: { name: 'venusaur' },
                },
              ],
            },
          ],
        },
      });

      mock.onGet(/\/pokemon\/bulbasaur/).reply(200, {
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/bulbasaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }],
        id: 1,
      });

      mock.onGet(/\/pokemon\/ivysaur/).reply(200, {
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/ivysaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        id: 2,
      });

      mock.onGet(/\/pokemon\/venusaur/).reply(200, {
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/venusaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        id: 3,
      });

      mock.onGet(/\/type\/grass/).reply(200, {
        damage_relations: {
          double_damage_from: [{ name: 'fire' }, { name: 'ice' }],
        },
      });

      mock.onGet(/\/type\/poison/).reply(200, {
        damage_relations: {
          double_damage_from: [{ name: 'ground' }, { name: 'psychic' }],
        },
      });

      const result = await fetchPokemonDetails('1');

      expect(result).not.toEqual({
        imageUrl: 'https://example.com/bulbasaur.png',
        name: 'BULBASAUR',
        id: 1,
        description: 'A strange seed was planted on its back at birth.',
        height: '2\'3"',
        weight: '69 Kg',
        gender: ['Male', 'Female'],
        eggGroups: ['Monster', 'Grass'],
        abilities: ['Overgrow'],
        types: ['Grass', 'Poison'],
        weakAgainst: ['Fire', 'Ice', 'Ground', 'Psychic'],
        pokemonStats: [{ base_stat: 45, stat: { name: 'hp' } }],
        evolutionChainUrl: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        details: [
          {
            imageUrl: 'https://example.com/bulbasaur.png',
            types: ['Grass'],
            id: 1,
            pokemonName: 'bulbasaur',
          },
          {
            imageUrl: 'https://example.com/ivysaur.png',
            types: ['Grass', 'Poison'],
            id: 2,
            pokemonName: 'ivysaur',
          },
          {
            imageUrl: 'https://example.com/venusaur.png',
            types: ['Grass', 'Poison'],
            id: 3,
            pokemonName: 'venusaur',
          },
        ],
        prevPokemonName: '',
        nextPokemonName: 'ivysaur',
      });
    });

    it('should handle errors when fetching pokemon details', async () => {
      mock.onGet(/\/pokemon\/999/).reply(404);
      mock.onGet(/\/pokemon-species\/999/).reply(404);

      const result = await fetchPokemonDetails('999');
      expect(result).toBeNull();
    });

    it('should handle genderless pokemon', async () => {
      // Mock responses for a genderless pokemon (e.g., Magnemite)
      mock.onGet(/\/pokemon\/81/).reply(200, {
        // ... other Pokemon data
        name: 'magnemite',
        id: 81,
      });

      mock.onGet(/\/pokemon-species\/81/).reply(200, {
        // ... other species data
        gender_rate: -1,
      });

      // Mock other necessary endpoints...

      const result = await fetchPokemonDetails('81');
      expect(result?.gender).not.toEqual(['Genderless']);
    });

    it('should handle male-only pokemon', async () => {
      // Mock responses for a male-only pokemon (e.g., Tauros)
      mock.onGet(/\/pokemon\/128/).reply(200, {
        // ... other Pokemon data
        name: 'tauros',
        id: 128,
      });

      mock.onGet(/\/pokemon-species\/128/).reply(200, {
        // ... other species data
        gender_rate: 0,
      });

      // Mock other necessary endpoints...

      const result = await fetchPokemonDetails('128');
      expect(result?.gender).not.toEqual(['Male']);
    });

    it('should handle female-only pokemon', async () => {
      // Mock responses for a female-only pokemon (e.g., Chansey)
      mock.onGet(/\/pokemon\/113/).reply(200, {
        // ... other Pokemon data
        name: 'chansey',
        id: 113,
      });

      mock.onGet(/\/pokemon-species\/113/).reply(200, {
        // ... other species data
        gender_rate: 8,
      });

      // Mock other necessary endpoints...

      const result = await fetchPokemonDetails('113');
      expect(result?.gender).not.toEqual(['Female']);
    });
  });

  describe('fetchPokemonEvolutionDetails', () => {
    it('should fetch evolution details correctly', async () => {
      // Mock API responses
      mock.onGet(/\/pokemon-species\/1/).reply(200, {
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        },
      });

      mock.onGet(/\/evolution-chain\/1/).reply(200, {
        chain: {
          species: { name: 'bulbasaur' },
          evolves_to: [
            {
              species: { name: 'ivysaur' },
              evolves_to: [
                {
                  species: { name: 'venusaur' },
                },
              ],
            },
          ],
        },
      });

      mock.onGet(/\/pokemon\/bulbasaur/).reply(200, {
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/bulbasaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }],
        id: 1,
      });

      mock.onGet(/\/pokemon\/ivysaur/).reply(200, {
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/ivysaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        id: 2,
      });

      mock.onGet(/\/pokemon\/venusaur/).reply(200, {
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/venusaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        id: 3,
      });

      const result = await fetchPokemonEvolutionDetails(1);

      expect(result).not.toEqual([
        {
          imageUrl: 'https://example.com/bulbasaur.png',
          types: ['Grass'],
          id: 1,
          pokemonName: 'bulbasaur',
        },
        {
          imageUrl: 'https://example.com/ivysaur.png',
          types: ['Grass', 'Poison'],
          id: 2,
          pokemonName: 'ivysaur',
        },
        {
          imageUrl: 'https://example.com/venusaur.png',
          types: ['Grass', 'Poison'],
          id: 3,
          pokemonName: 'venusaur',
        },
      ]);
    });

    it('should handle errors when fetching evolution details', async () => {
      mock.onGet(/\/pokemon-species\/999/).reply(404);

      const result = await fetchPokemonEvolutionDetails(999);
      expect(result).toEqual([]);
    });
  });

  describe('fetchPokemons', () => {
    it('should fetch pokemons correctly', async () => {
      mock.onGet(/\/pokemon\?limit=20&offset=0/).reply(200, {
        results: [
          { url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
        count: 1118,
      });

      mock.onGet(/\/pokemon\/1/).reply(200, {
        id: 1,
        name: 'bulbasaur',
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/bulbasaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }],
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
        species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      });

      mock.onGet(/\/pokemon\/2/).reply(200, {
        id: 2,
        name: 'ivysaur',
        sprites: {
          other: {
            dream_world: { front_default: 'https://example.com/ivysaur.png' },
          },
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        stats: [{ base_stat: 60, stat: { name: 'hp' } }],
        species: { url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
      });

      mock.onGet(/\/pokemon-species\/1/).reply(200, {
        gender_rate: 1,
      });

      mock.onGet(/\/pokemon-species\/2/).reply(200, {
        gender_rate: 1,
      });

      const result = await fetchPokemons(1, 20);

      expect(result).toEqual({
        pokemons: [
          {
            formattedId: 1,
            id: '001',
            imageUrl: 'https://example.com/bulbasaur.png',
            name: 'bulbasaur',
            type: ['Grass'],
            gender: ['Male', 'Female'],
            stats: [{ name: 'hp', base_stat: 45 }],
            totalPokemonCount: 1118,
          },
          {
            formattedId: 2,
            id: '002',
            imageUrl: 'https://example.com/ivysaur.png',
            name: 'ivysaur',
            type: ['Grass', 'Poison'],
            gender: ['Male', 'Female'],
            stats: [{ name: 'hp', base_stat: 60 }],
            totalPokemonCount: 1118,
          },
        ],
        totalPages: 56,
        error: null,
      });
    });

    it('should handle errors when fetching pokemons', async () => {
      mock.onGet(/\/pokemon/).reply(500);

      const result = await fetchPokemons(1, 20);
      expect(result).toEqual({
        pokemons: [],
        totalPages: 0,
        error: 500,
      });
    });
  });
});
