import { FilterDropdownProps } from '@/utils/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface FilterDropdownComponentProps extends FilterDropdownProps {
  isOpen: boolean;
  toggleDropdown: (dropdown: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownComponentProps> = ({
  label,
  options,
  paramName,
  onChange,
  isOpen,
  toggleDropdown,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSelectedOptions = searchParams.get(paramName)?.split(',') || [];

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialSelectedOptions
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedOptions.length > 0) {
      params.set(paramName, selectedOptions.join(','));
    } else {
      params.delete(paramName);
    }

    router.push(`?${params.toString()}`);
  }, [selectedOptions, paramName, router]);

  const handleOptionClick = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown(paramName);
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent, option: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionClick(option);
    }
  };

  return (
    <div className="flex flex-col items-start relative hide-scrollbar">
      <p
        id={`${paramName}-label`}
        className="text-sm ml-3 text-SECONDARY font-medium mb-1"
      >
        {label}
      </p>
      <div
        className={`flex items-center lg:border-none border-[1.5px] border-SECONDARY rounded-md px-3 py-4 w-full lg:w-[180px] cursor-pointer ${
          isOpen ? 'bg-white' : 'bg-TERTIARY'
        }`}
        onClick={() => toggleDropdown(paramName)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${paramName}-label`}
        id={`${paramName}-button`}
      >
        <span
          className="flex-1 text-SECONDARY text-sm"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="listbox-id"
          aria-haspopup="listbox"
        >
          {selectedOptions.length > 0 ? (
            <span data-testid="selectedOptions">
              {selectedOptions[0]}
              {selectedOptions.length > 1 && (
                <span className="font-extrabold">
                  {` + ${selectedOptions.length - 1} More`}
                </span>
              )}
            </span>
          ) : (
            <span className="font-normal">select</span>
          )}
        </span>
        <div className="text-SECONDARY">
          <IoIosArrowDown />
        </div>
      </div>
      {isOpen && (
        <div
          className="sm:absolute flex flex-col top-full h-[180px] overflow-auto mt-2 p-2 text-SECONDARY text-sm font-semibold bg-white shadow-lg rounded-md w-full z-10"
          role="listbox"
          aria-labelledby={`${paramName}-label`}
        >
          <div className="">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center py-1 border-b-[1.5px] w-full border-gray-200 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                role="option"
                aria-selected={selectedOptions.includes(option)}
                tabIndex={0}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  readOnly
                  className="mr-2 accent-SECONDARY"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <span className="">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
