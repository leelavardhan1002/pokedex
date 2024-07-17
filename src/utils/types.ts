export interface PokemonDetail {
  formattedId: string;
  id: string;
  imageUrl: string;
  name: string;
  type: string[];
  gender: string[];
  stats: { name: string; base_stat: number }[];
}

export interface PokemonProps {
  imageUrl?: string;
  name?: string;
  id?: number;
  description?: string;
  height?: string;
  weight?: string;
  gender?: string[];
  eggGroups?: string[];
  abilities?: string[];
  types: string[];
  weakAgainst?: string[];
  pokemonStats?: {
    stat: {
      name: string;
    };
    base_stat: number;
  }[];
  evolutionChainUrl?: string;
  cardWidth?: string;
  cardHeight?: string;
  imageWidth?: number;
  imageHeight?: number;
  showId?: boolean;
  divWidth?: string;
  divHeight?: string;
  details?: PokemonDetails[];
  prevPokemonName?: string;
  nextPokemonName?: string;
}

export interface PokemonInfoProps {
  pokemonDetails: PokemonProps;
}

export interface PokemonDetailPageProps {
  params: {
    id: string;
    name: string;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface StatValues {
  HP: [number, number];
  Attack: [number, number];
  Defense: [number, number];
  Speed: [number, number];
  SpecialAtt: [number, number];
  SpecialDef: [number, number];
}

export interface Props {
  label: string;
  stats: (keyof StatValues)[];
}

export interface URLParams {
  types?: string[];
  genders?: string[];
  search?: string;
  HP?: string;
  Attack?: string;
  Defense?: string;
  Speed?: string;
  SpecialAtt?: string;
  SpecialDef?: string;
  limit?: string;
  page?: string;
}

export interface FilterDropdownProps {
  label: string;
  options: string[];
  paramName: string;
  onChange: (options: string[]) => void;
}

export interface PokemonDetails {
  imageUrl: string;
  types: string[];
  id: number;
  pokemonName: string;
}
