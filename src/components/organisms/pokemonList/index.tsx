'use client';

import React, { useEffect, useState } from 'react';
import PokemonCard from '@/components/molecules/pokemonCard';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Pagination from '@/components/atoms/pagination';
import Error from '@/app/_error';
import { PokemonDetail } from '@/utils/types';
import Loader from '@/components/atoms/loader';
import { DETAIL_STATS_NAMES } from '@/utils/constants';

interface PokemonListClientProps {
  initialPokemons: PokemonDetail[];
  initialTotalPages: number;
  currentPage: number;
  limit: number;
  error: number | null;
}

interface StatRange {
  [key: string]: [number, number];
}

const PokemonListClient: React.FC<PokemonListClientProps> = ({
  initialPokemons,
  initialTotalPages,
  currentPage: initialCurrentPage,
  limit: initialLimit,
  error,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );
  const selectedGenders = searchParams.get('genders')?.split(',') ?? [];
  const selectedTypes = searchParams.get('types')?.split(',') ?? [];
  const statRanges: [string, number[] | undefined][] = [
    ['hp', searchParams.get('HP')?.split(',').map(Number)],
    ['attack', searchParams.get('Attack')?.split(',').map(Number)],
    ['defense', searchParams.get('Defense')?.split(',').map(Number)],
    ['speed', searchParams.get('Speed')?.split(',').map(Number)],
    ['special-attack', searchParams.get('SpecialAtt')?.split(',').map(Number)],
    ['special-defense', searchParams.get('SpecialDef')?.split(',').map(Number)],
  ];
  const statRangesObject: StatRange = Object.fromEntries(
    statRanges.filter(([, values]) => values) as [string, [number, number]][]
  );
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [limit, setLimit] = useState(initialLimit);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    if (pageParam) setCurrentPage(parseInt(pageParam, 10));
    if (limitParam) setLimit(parseInt(limitParam, 10));

    setIsNavigating(false);
  }, [searchParams]);

  const filteredPokemons = initialPokemons.filter((pokemon) => {
    const matchesSearchQuery =
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.id.includes(searchQuery);

    const matchesGenderFilter =
      selectedGenders.length === 0 ||
      selectedGenders.some((gender) => pokemon.gender.includes(gender));

    const matchesTypeFilter =
      selectedTypes.length === 0 ||
      selectedTypes.some((type) => pokemon.type.includes(type));

    const matchesStatFilter = Object.entries(statRangesObject).every(
      ([stat, range]: [string, [number, number]]) =>
        pokemon.stats.some(
          (statData) =>
            statData.name === stat &&
            statData.base_stat >= range[0] &&
            statData.base_stat <= range[1]
        )
    );

    return (
      matchesSearchQuery &&
      matchesGenderFilter &&
      matchesTypeFilter &&
      matchesStatFilter
    );
  });

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('types');
    params.delete('genders');

    DETAIL_STATS_NAMES.forEach((stat) => {
      params.delete(stat);
    });

    params.delete('search');

    const page = params.get('page');
    const limit = params.get('limit');

    params.forEach((value, key) => params.delete(key));
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setIsNavigating(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`, undefined);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsNavigating(true);
    const newLimit = parseInt(event.target.value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // reset to the first page when limit changes
    router.push(`${pathname}?${params.toString()}`, undefined);
  };

  if (error) {
    return <Error statusCode={error} />;
  }

  return (
    <div data-testid="pokemon-list">
      {isNavigating ? (
        <Loader />
      ) : (
        <div>
          <div className="flex justify-end mr-4 mt-2">
            <button
              onClick={() => {
                clearFilters();
              }}
              className="bg-SECONDARY text-xs font-bold text-white rounded-md px-4 py-2 w-fit hidden lg:block"
              aria-label="clear filters"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex flex-wrap">
            {filteredPokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/6 flex justify-evenly mt-4 mb-2"
              >
                <Link
                  href={`pokemon-detail-page/${pokemon.formattedId}/${pokemon.name.toLowerCase()}`}
                >
                  <PokemonCard
                    id={parseInt(pokemon.id)}
                    imageUrl={pokemon.imageUrl}
                    name={pokemon.name}
                    types={pokemon.type}
                  />
                </Link>
              </div>
            ))}
          </div>
          {filteredPokemons.length < 1 && (
            <p className="w-full text-center text-SECONDARY my-28">
              No Pokémon found on this page. Please adjust your filters or
              pagination.
            </p>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={initialTotalPages}
            onPageChange={handlePageChange}
          />
          <div className="mt-4 w-full flex justify-center items-center">
            <label htmlFor="limit" className="mr-2 text-SECONDARY">
              Pokémon per page:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={handleLimitChange}
              className="border p-2 text-SECONDARY rounded-lg"
            >
              <option value={20}>20</option>
              <option value={40}>40</option>
              <option value={60}>60</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonListClient;
