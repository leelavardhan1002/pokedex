import { Props, StatValues, URLParams } from '@/utils/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BsXCircle } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import RangeSlider from '../slider';
import log from 'loglevel';

interface StatsDropdownProps extends Props {
  isOpen: boolean;
  toggleDropdown: (dropdown: string) => void;
}

const StatsDropdown: React.FC<StatsDropdownProps> = ({
  label,
  stats,
  isOpen,
  toggleDropdown,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatValues: StatValues = {
    HP: [0, 210],
    Attack: [0, 210],
    Defense: [0, 210],
    Speed: [0, 210],
    SpecialAtt: [0, 210],
    SpecialDef: [0, 210],
  };

  const [statValues, setStatValues] = useState<StatValues>(initialStatValues);
  const [appliedStatValues, setAppliedStatValues] =
    useState<StatValues>(initialStatValues);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);
  const [appliedGenders, setAppliedGenders] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [appliedPage, setAppliedPage] = useState<string>('');
  const [selectedLimit, setSelectedLimit] = useState<string>('');
  const [appliedLimit, setAppliedLimit] = useState<string>('');

  const handleSliderChange = (
    stat: keyof StatValues,
    newValue: number | number[]
  ) => {
    if (Array.isArray(newValue)) {
      setStatValues((prevValues) => ({
        ...prevValues,
        [stat]: newValue as [number, number],
      }));
    }
  };

  const resetStats = () => {
    setStatValues(initialStatValues);
  };

  const applyStats = () => {
    setAppliedStatValues(statValues);
    setAppliedTypes(selectedTypes);
    setAppliedGenders(selectedGenders);
    setAppliedLimit(selectedLimit);
    setAppliedPage(selectedPage);

    const params = new URLSearchParams(searchParams.toString()); // Use current search params

    stats.forEach((stat) => {
      const [min, max] = statValues[stat];
      params.set(stat, `${min},${max}`);
    });

    if (selectedTypes.length > 0) {
      params.set('types', selectedTypes.join(','));
    } else {
      params.delete('types');
    }

    if (selectedGenders.length > 0) {
      params.set('genders', selectedGenders.join(','));
    } else {
      params.delete('genders');
    }

    if (search.length > 0) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (selectedLimit.length > 0) {
      params.set('limit', selectedLimit);
    } else {
      params.delete('limit');
    }

    if (selectedPage.length > 0) {
      params.set('page', selectedPage);
    } else {
      params.delete('page');
    }

    router.push(`?${params.toString()}`);
    toggleDropdown('');

    log.log(
      appliedStatValues,
      appliedLimit,
      appliedPage,
      appliedGenders,
      appliedTypes
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const parsedParams: URLParams = {};

    stats.forEach((stat) => {
      parsedParams[stat] = params.get(stat) ?? undefined;
    });

    parsedParams.types = params.get('types')?.split(',') ?? [];
    parsedParams.genders = params.get('genders')?.split(',') ?? [];
    parsedParams.search = params.get('search') ?? '';
    parsedParams.page = params.get('page') ?? '';
    parsedParams.limit = params.get('limit') ?? '';

    setSelectedTypes(parsedParams.types);
    setSelectedGenders(parsedParams.genders);
    setSearch(parsedParams.search);
    setSelectedLimit(parsedParams.limit);
    setSelectedPage(parsedParams.page);

    const newStatValues: StatValues = {
      HP: parseStat(parsedParams.HP) ?? [0, 210],
      Attack: parseStat(parsedParams.Attack) ?? [0, 210],
      Defense: parseStat(parsedParams.Defense) ?? [0, 210],
      Speed: parseStat(parsedParams.Speed) ?? [0, 210],
      SpecialAtt: parseStat(parsedParams.SpecialAtt) ?? [0, 210],
      SpecialDef: parseStat(parsedParams.SpecialDef) ?? [0, 210],
    };
    setStatValues(newStatValues);
    setAppliedStatValues(newStatValues);
    setAppliedTypes(parsedParams.types);
    setAppliedGenders(parsedParams.genders);
    setAppliedLimit(parsedParams.limit);
    setAppliedPage(parsedParams.page);
  }, [stats, searchParams]);

  const parseStat = (
    value: string | undefined
  ): [number, number] | undefined => {
    if (value) {
      const [min, max] = value.split(',').map(Number);
      return [min, max];
    }
    return undefined;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown('stats');
    }
  };

  return (
    <div className="flex flex-col items-start relative">
      <p className="text-[#222c85] text-sm font-medium mb-1 ml-3">{label}</p>
      <div
        className={`flex items-center rounded-md px-3 py-4 sm:border-none border-[1.5px] border-SECONDARY w-full sm:w-[194px] cursor-pointer ${
          isOpen ? 'bg-white' : 'bg-TERTIARY'
        }`}
        onClick={() => toggleDropdown('stats')}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        id="stats-dropdown"
      >
        <span
          className="flex-1 text-SECONDARY text-sm"
          role="combobox"
          data-testid="StatsDropdown"
        >
          HP <span className="font-extrabold">+ 5 More</span>
        </span>
        <div className="text-SECONDARY">
          <IoIosArrowDown />
        </div>
      </div>
      {isOpen && (
        <div
          className="flex flex-col justify-center lg:absolute lg:right-0 top-full mt-2 bg-white shadow-lg rounded-md w-full lg:w-[585px] z-10 p-6"
          role="region"
          aria-labelledby="stats-dropdown"
        >
          <div className="flex w-full justify-between">
            <h3 className="text-xl font-bold mb-4 text-SECONDARY">
              Select Stats
            </h3>
            <button
              className="rounded-full font-bold text-SECONDARY mb-4"
              aria-label="Close"
              onClick={() => toggleDropdown('')}
            >
              <BsXCircle className="text-xl" />
            </button>
          </div>
          {stats.map((stat) => (
            <div key={stat} className="flex mb-4 items-center">
              <span className="w-1/3 text-SECONDARY text-xs xs:text-sm mb-2 min-w-[70px]">
                {stat}
              </span>
              <div className="flex mb-1 items-center w-full bg-[#F1F3F3] border border-SECONDARY rounded-md py-[1px]">
                <span className="w-1/4 text-SECONDARY flex justify-center">
                  {statValues[stat][0]}
                </span>
                <RangeSlider
                  value={statValues[stat]}
                  onChange={(newValue) =>
                    handleSliderChange(
                      stat,
                      Array.isArray(newValue) ? newValue : [newValue]
                    )
                  }
                  min={0}
                  max={210}
                  className="w-full h-3"
                />
                <span className="w-1/4 text-SECONDARY flex justify-center">
                  {statValues[stat][1]}
                </span>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button
              onClick={resetStats}
              className="bg-white text-SECONDARY text-xs font-bold border border-SECONDARY rounded-md px-4 py-2 mr-2"
            >
              Reset
            </button>
            <button
              onClick={applyStats}
              className="bg-SECONDARY text-xs font-bold text-white rounded-md px-4 py-2"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDropdown;
