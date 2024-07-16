// api/data.ts
/* eslint-disable */

import pokemonImage from '@/assests/images/miraidon-aquatic-mode.png';
import { capitalizeFirstLetter } from '@/utils/helper';
import {
  getPokemon,
  getPokemonSpecies,
  getPokemonType,
  getPokemonList,
  getSpeciesName,
  getNextOrPrevPokemon,
  getDetailsFromUrl,
} from '@/api/apiService';

// Helper Functions
const formatHeight = (height: number) => {
  const totalFeet = height * 3.28084;
  const feet = Math.floor(totalFeet);
  const inches = Math.round((totalFeet - feet) * 12);
  return `${feet}'${inches}"`;
};

const getUniqueFlavorTexts = (flavorTextEntries: any[]) => {
  return Array.from(
    new Set(
      flavorTextEntries
        .filter((entry) => entry.language.name === 'en')
        .map((entry) => entry.flavor_text.replace(/\s+/g, ' ').trim())
    )
  )
    .slice(0, 7)
    .join(' ');
};

const getEggGroups = (eggGroups: { name: string }[]) => {
  return eggGroups.map((eggGroup) => capitalizeFirstLetter(eggGroup.name));
};

const getEvolutionChain = async (url: string) => {
  const response = await getDetailsFromUrl(url);
  const chain = [];
  let current = response.chain;
  while (current) {
    chain.push(current.species);
    current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
  }
  return chain;
};

const getPrevNextPokemonNames = async (id: number) => {
  let prevPokemonName = '';
  let nextPokemonName = '';

  if (id > 1) {
    let prevId = id - 1;
    while (prevId > 0) {
      try {
        const response = await getNextOrPrevPokemon(prevId.toString());
        prevPokemonName = response.name;
        break;
      } catch {
        prevId--;
      }
    }
  }

  if (id < 905) {
    let nextId = id + 1;
    while (nextId <= 905) {
      try {
        const response = await getNextOrPrevPokemon(nextId.toString());
        nextPokemonName = response.name;
        break;
      } catch {
        nextId++;
      }
    }
  }

  return { prevPokemonName, nextPokemonName };
};

const getPokemonDetailsFromChain = async (chain: any[]) => {
  const detailsPromises = chain.map(async (species) => {
    const response = await getSpeciesName(species.name);
    const pokemonData = response;
    const types = pokemonData.types.map(
      (typeInfo: { type: { name: string } }) => typeInfo.type.name
    );
    const imageUrl =
      pokemonData.sprites.other.dream_world.front_default || pokemonImage;
    return {
      imageUrl,
      types,
      id: pokemonData.id,
      pokemonName: species.name,
    };
  });

  return Promise.all(detailsPromises);
};

const getWeaknesses = async (types: string[]) => {
  const promises = types.map((type) => getPokemonType(type));
  const responses = await Promise.all(promises);
  const weakAgainstSet = new Set<string>();

  responses.forEach((response) => {
    response.damage_relations.double_damage_from.forEach((type: any) => {
      weakAgainstSet.add(capitalizeFirstLetter(type.name));
    });
  });

  return Array.from(weakAgainstSet);
};

const getGender = (genderRate: number) => {
  if (genderRate === -1) return ['Genderless'];
  if (genderRate === 8) return ['Female'];
  if (genderRate === 0) return ['Male'];
  return ['Male', 'Female'];
};

// Main Functions
const fetchPokemonDetails = async (id: string) => {
  try {
    const [pokemonResponse, speciesResponse] = await Promise.all([
      getPokemon(id),
      getPokemonSpecies(id),
    ]);

    const pokemon = pokemonResponse;
    const species = speciesResponse;

    const formattedHeight = formatHeight(pokemon.height);
    const combinedDescription = getUniqueFlavorTexts(
      species.flavor_text_entries
    );
    const eggGroups = getEggGroups(species.egg_groups);
    const evolutionChain = await getEvolutionChain(species.evolution_chain.url);
    const details = await getPokemonDetailsFromChain(evolutionChain);
    const { prevPokemonName, nextPokemonName } = await getPrevNextPokemonNames(
      parseInt(id)
    );
    const types = pokemon.types.map((type: any) =>
      capitalizeFirstLetter(type.type.name)
    );
    const weakAgainst = await getWeaknesses(types);
    const gender = getGender(species.gender_rate);

    return {
      imageUrl: pokemon.sprites.other.dream_world.front_default || pokemonImage,
      name: pokemon.name.toUpperCase(),
      id: pokemon.id,
      description: combinedDescription || 'No description available.',
      height: formattedHeight,
      weight: `${Math.round(pokemon.weight)} Kg`,
      gender,
      eggGroups,
      abilities: pokemon.abilities.map((ability: any) =>
        capitalizeFirstLetter(ability.ability.name)
      ),
      types,
      weakAgainst,
      pokemonStats: pokemon.stats,
      evolutionChainUrl: species.evolution_chain.url,
      details,
      prevPokemonName,
      nextPokemonName,
    };
  } catch (error) {
    console.error('Error fetching Pokémon details:', error);
    return null;
  }
};

const fetchPokemonEvolutionDetails = async (id: number) => {
  try {
    const speciesResponse = await getPokemonSpecies(id.toString());
    const evolutionChain = await getEvolutionChain(
      speciesResponse.evolution_chain.url
    );
    const details = await getPokemonDetailsFromChain(evolutionChain);
    return details;
  } catch (error) {
    console.error('Error fetching Pokémon evolution details:', error);
    return [];
  }
};

const fetchPokemons = async (currentPage: number, limit: number) => {
  try {
    const offset = (currentPage - 1) * limit;
    const response = await getPokemonList(limit, offset);
    const { results } = response;
    const totalPokemons = response.count;

    const detailedPokemons = await Promise.all(
      results.map(async (pokemon: { url: string }) => {
        const pokemonResponse = await getDetailsFromUrl(pokemon.url);
        const pokemonData = pokemonResponse;
        const type = pokemonData.types.map(
          (typeInfo: { type: { name: string } }) =>
            capitalizeFirstLetter(typeInfo.type.name)
        );
        const imageUrl =
          pokemonData.sprites.other.dream_world.front_default || pokemonImage;
        const pokemonStats = pokemonData.stats.map((stat: any) => ({
          name: stat.stat.name,
          base_stat: stat.base_stat,
        }));
        const genderResponse = await getDetailsFromUrl(pokemonData.species.url);
        const gender = getGender(genderResponse.gender_rate);

        return {
          formattedId: pokemonData.id,
          id: String(pokemonData.id).padStart(3, '0'),
          imageUrl,
          name: pokemonData.name,
          type,
          gender,
          stats: pokemonStats,
          totalPokemonCount: totalPokemons,
        };
      })
    );

    return {
      pokemons: detailedPokemons,
      totalPages: Math.ceil(totalPokemons / limit),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    return {
      pokemons: [],
      totalPages: 0,
      error: (error as any).response?.status || 500,
    };
  }
};

export { fetchPokemonDetails, fetchPokemonEvolutionDetails, fetchPokemons };
