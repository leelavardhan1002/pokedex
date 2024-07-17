'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/atoms/searchBar';
import StatsDropdown from '@/components/atoms/stats';
import FilterDropdown from '@/components/atoms/type';
import { BsListCheck } from 'react-icons/bs';
import Modal from '@/components/atoms/modal';
import { StatValues } from '@/utils/types';
import {
  BASE_URL,
  DETAIL_STATS_NAMES,
  GENDER_OPTIONS,
  POKEMON_TYPE,
} from '@/utils/constants';
import { capitalizeFirstLetter } from '@/utils/helper';
import { apiClient } from '@/api/apiService';
import log from 'loglevel';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    log.log(selectedTypes);
  };

  const handleGenderChange = (genders: string[]) => {
    setSelectedGenders(genders);
    log.log(selectedGenders);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? '' : dropdown);
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await apiClient.get(`${BASE_URL}${POKEMON_TYPE}`);
        const types = response.results.map((type: { name: string }) =>
          capitalizeFirstLetter(type.name)
        );
        setTypeOptions(types);
      } catch (error) {
        console.error('Error fetching Pokémon types:', error);
      }
    };

    fetchTypes();
  }, []);

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

    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <header
      className="flex flex-col mx-[15px]"
      role="banner"
      data-testid="header"
    >
      <div className="flex flex-col lg:flex-row h-10 lg:items-center mb-8">
        <h1 className="text-left text-2xl font-bold text-SECONDARY">Pokédex</h1>
        <div className="hidden lg:block h-10 border-l border-SECONDARY mx-4" />
        <p className="text-md font-medium text-[#222c85] lg:border-l-0 lg:border-SECONDARY border-t lg:border-none border-SECONDARY mt-2 pt-2 lg:pt-0">
          Search for any Pokémon that exist on this planet
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 rounded-md mt-8 lg:mt-0">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex flex-row items-center gap-4 rounded-md mt-8 lg:mt-0">
          <div className="hidden lg:flex gap-4">
            <FilterDropdown
              label="Type"
              options={typeOptions}
              paramName="types"
              onChange={handleTypeChange}
              isOpen={openDropdown === 'types'}
              toggleDropdown={toggleDropdown}
              data-testid="type-dropdown"
            />
            <FilterDropdown
              label="Gender"
              options={GENDER_OPTIONS}
              paramName="genders"
              onChange={handleGenderChange}
              isOpen={openDropdown === 'genders'}
              toggleDropdown={toggleDropdown}
              data-testid="gender-dropdown"
            />
            <StatsDropdown
              label="Stats"
              stats={DETAIL_STATS_NAMES as (keyof StatValues)[]}
              isOpen={openDropdown === 'stats'}
              toggleDropdown={toggleDropdown}
              data-testid="stats-dropdown"
            />
          </div>

          <button
            className="flex lg:hidden pb-8"
            onClick={() => setIsModalOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
            aria-label="Open filters"
            data-testid="bs-list-check-icon"
            tabIndex={0}
          >
            <BsListCheck
              size={24}
              className="bg-SECONDARY rounded-lg w-[65px] h-[48px] p-[10px]"
            />
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4 mt-5">
          <FilterDropdown
            label="Type"
            options={typeOptions}
            paramName="types"
            onChange={handleTypeChange}
            isOpen={openDropdown === 'types'}
            toggleDropdown={toggleDropdown}
          />
          <FilterDropdown
            label="Gender"
            options={GENDER_OPTIONS}
            paramName="genders"
            onChange={handleGenderChange}
            isOpen={openDropdown === 'genders'}
            toggleDropdown={toggleDropdown}
          />
          <StatsDropdown
            label="Stats"
            stats={DETAIL_STATS_NAMES as (keyof StatValues)[]}
            isOpen={openDropdown === 'stats'}
            toggleDropdown={toggleDropdown}
          />
        </div>
        <div className="flex justify-center items-end mr-4 mt-2">
          <button
            onClick={() => {
              clearFilters();
            }}
            className="bg-SECONDARY text-xs font-bold text-white rounded-md px-4 py-2 w-fit"
            aria-label="clear filters"
          >
            Clear Filters
          </button>
        </div>
      </Modal>
    </header>
  );
}
