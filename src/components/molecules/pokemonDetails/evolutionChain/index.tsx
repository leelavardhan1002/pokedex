'use client';

import PokemonCard from '@/components/molecules/pokemonCard';
import { IoIosArrowRoundForward } from 'react-icons/io';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PokemonDetails, PokemonInfoProps } from '@/utils/types';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';

const EvolutionChain: React.FC<PokemonInfoProps> = ({ pokemonDetails }) => {
  const [pokemonDetailsList, setPokemonDetailsList] = useState<
    PokemonDetails[]
  >([]);
  const [prevPokemonName, setPrevPokemonName] = useState<string | null>(null);
  const [nextPokemonName, setNextPokemonName] = useState<string | null>(null);
  const currentId = pokemonDetails.id
    ? parseInt(pokemonDetails.id?.toString())
    : 0;

  useEffect(() => {
    const fetchPokemonEvolutionDetails = async () => {
      try {
        if (pokemonDetails.details) {
          setPokemonDetailsList(pokemonDetails.details);
        }
        if (pokemonDetails.nextPokemonName && pokemonDetails.prevPokemonName) {
          setNextPokemonName(pokemonDetails.nextPokemonName);
          setPrevPokemonName(pokemonDetails.prevPokemonName);
        }
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };

    fetchPokemonEvolutionDetails();
  }, [pokemonDetails.id]);

  return (
    <div className="flex flex-col w-full md:w-3/4 lg:w-2/4 bg-PRIMARY p-8">
      <p className="text-SECONDARY font-xl font-bold mb-4">Evolution Chain</p>
      <div className="flex justify-between items-center ">
        {pokemonDetailsList?.map((detail, index) => (
          <React.Fragment key={detail.id}>
            <div className="">
              <Link href={`/pokemon-detail-page/${detail.id}`}>
                <PokemonCard
                  name={detail.pokemonName}
                  imageUrl={detail.imageUrl}
                  types={detail.types}
                  id={detail.id}
                  imageHeight={65}
                  imageWidth={65}
                  showId={false}
                  cardHeight="h-[100px] md:h-[175px]"
                  cardWidth="w-[100px] md:w-[125px]"
                  divHeight="h-[100px] sm:h-[175px]"
                  divWidth="w-[75px] sm:w-[125px]"
                />
              </Link>
            </div>
            {index < pokemonDetailsList.length - 1 && (
              <div className="rounded-full font-bold text-SECONDARY">
                <IoIosArrowRoundForward className="text-4xl md:text-6xl" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between items-start mt-8 gap-2">
        {prevPokemonName && (
          <Link href={`/pokemon-detail-page/${currentId - 1}`}>
            <button
              className="flex items-center p-2 rounded-lg font-bold bg-SECONDARY text-white sm:hidden"
              aria-label="Previous"
            >
              <BsArrowLeftCircle className="text-xl mr-2" />
              <span className="text-white">
                {prevPokemonName.toUpperCase()}
              </span>
            </button>
          </Link>
        )}
        {nextPokemonName && (
          <Link href={`/pokemon-detail-page/${currentId + 1}`}>
            <button
              className="flex items-center p-2 rounded-lg font-bold bg-SECONDARY text-white sm:hidden"
              aria-label="Next"
            >
              <span className="text-white">
                {nextPokemonName.toUpperCase()}
              </span>
              <BsArrowRightCircle className="text-xl ml-2" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EvolutionChain;
