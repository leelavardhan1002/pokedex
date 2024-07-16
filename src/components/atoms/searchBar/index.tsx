import { setSearchQuery } from '@/redux/slices/searchSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { LiaTimesSolid } from 'react-icons/lia';
import { useDispatch } from 'react-redux';

export default function SearchBar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      dispatch(setSearchQuery(search));
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', search);
      router.push(`?${params.toString()}`);
    }
  };

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearch(query);
      dispatch(setSearchQuery(query));
    }
  }, [searchParams]);

  const clearSearch = () => {
    setSearch('');
    dispatch(setSearchQuery(''));
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-start">
      <label
        className="text-[#222c85] ml-3 text-sm font-medium mb-1 hidden lg:block"
        htmlFor="search"
      >
        Search by
      </label>
      <div className="flex items-center bg-TERTIARY rounded-md p-2 w-full">
        <input
          type="text"
          placeholder="Name or Number"
          id="search"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          className="bg-transparent text-sm flex-1 py-2 outline-none text-SECONDARY placeholder-SECONDARY"
        />
        {search && (
          <button
            className="outline-none focus:outline-none  text-SECONDARY text-2xl mr-4"
            onClick={clearSearch}
            aria-label="Clear"
          >
            <LiaTimesSolid />
          </button>
        )}
        {!search && (
          <button
            className="outline-none focus:outline-none text-SECONDARY text-2xl mr-4"
            onClick={clearSearch}
            aria-label="Search"
          >
            <IoIosSearch />
          </button>
        )}
      </div>
    </div>
  );
}
