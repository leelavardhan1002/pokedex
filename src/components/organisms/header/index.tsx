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

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string>('');

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

          <button className="flex lg:hidden pb-8">
            <BsListCheck
              size={24}
              className="bg-SECONDARY rounded-lg w-[65px] h-[48px] p-[10px]"
              onClick={() => setIsModalOpen(true)}
              data-testid="bs-list-check-icon"
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
      </Modal>
    </header>
  );
}
