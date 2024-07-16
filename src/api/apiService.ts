// services/apiService.ts
/* eslint-disable */

import axios from 'axios';
import {
  BASE_URL,
  POKEMON_API,
  POKEMON_SPECIES_API,
  POKEMON_TYPE,
} from '@/utils/constants';

// Define a type for the HTTP client
type HttpClient = {
  get: (url: string) => Promise<any>;
};

// Create Axios client
const axiosClient: HttpClient = {
  get: (url: string) => axios.get(url).then((response) => response.data),
};

// Create Fetch client with error handling
const fetchClient: HttpClient = {
  get: async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

// Choose which client to use (you can switch this based on your preference)
export const apiClient: HttpClient = axiosClient; // or axiosClient

// API functions
export const getPokemon = (id: string) =>
  apiClient.get(`${BASE_URL}${POKEMON_API}/${id}`);

export const getPokemonSpecies = (id: string) =>
  apiClient.get(`${BASE_URL}${POKEMON_SPECIES_API}/${id}`);

export const getDetailsFromUrl = (url: string) => apiClient.get(url);

export const getPokemonType = (type: string) =>
  apiClient.get(`${BASE_URL}${POKEMON_TYPE}/${type.toLowerCase()}`);

export const getPokemonList = (limit: number, offset: number) =>
  apiClient.get(`${BASE_URL}${POKEMON_API}?limit=${limit}&offset=${offset}`);

export const getSpeciesName = (name: string) =>
  apiClient.get(`${BASE_URL}${POKEMON_API}/${name}`);

export const getNextOrPrevPokemon = (id: string) =>
  apiClient.get(`${BASE_URL}${POKEMON_API}/${id}`);

// Add more API functions as needed
