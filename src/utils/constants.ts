const BASE_URL = 'https://pokeapi.co/api/v2';

const POKEMON_API = `/pokemon`;
const POKEMON_SPECIES_API = `/pokemon-species`;
const POKEMON_TYPE = `/type`;

const MAX_WIDTH = 210;
const STATS_NAMES = ['HP', 'Attack', 'Defense', 'Sp.Attack', 'Sp.Def', 'Speed'];
const DETAIL_STATS_NAMES = [
  'HP',
  'Attack',
  'Defense',
  'Speed',
  'SpecialAtt',
  'SpecialDef',
];
const GENDER_OPTIONS = ['Male', 'Female', 'Genderless'];

export {
  BASE_URL,
  POKEMON_API,
  POKEMON_SPECIES_API,
  POKEMON_TYPE,
  MAX_WIDTH,
  STATS_NAMES,
  DETAIL_STATS_NAMES,
  GENDER_OPTIONS,
};
