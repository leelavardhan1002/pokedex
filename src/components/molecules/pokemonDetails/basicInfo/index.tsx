'use client';

import React, { useState, useRef, useEffect } from 'react';
import PokemonCard from '@/components/molecules/pokemonCard';
import Link from 'next/link';
import {
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsXCircle,
} from 'react-icons/bs';
import { PokemonInfoProps } from '@/utils/types';
import { useRouter } from 'next/navigation';

const PokemonBasicInfo: React.FC<PokemonInfoProps> = ({ pokemonDetails }) => {
  const currentId = pokemonDetails.id
    ? parseInt(pokemonDetails.id?.toString())
    : 0;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const truncatedDescriptionSmall = (pokemonDetails.description ?? '')
    .split(' ')
    .slice(0, 30)
    .join(' ');

  const truncatedDescriptionLarge = (pokemonDetails.description ?? '')
    .split(' ')
    .slice(0, 75)
    .join(' ');

  const toggleDescriptionPopup = () => {
    setShowFullDescription(!showFullDescription);
  };
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    if (showFullDescription && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [showFullDescription]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFullDescription) {
        toggleDescriptionPopup();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFullDescription]);

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between w-full md:w-3/4 lg:w-2/4 bg-PRIMARY p-8">
      <div className="w-[25%] hidden sm:block">
        <PokemonCard
          name={pokemonDetails.name}
          showId={false}
          imageUrl={pokemonDetails.imageUrl}
          types={pokemonDetails.types}
          imageHeight={125}
          imageWidth={125}
          cardHeight={pokemonDetails.cardHeight}
          cardWidth={pokemonDetails.cardWidth}
          divHeight="h-[125px]"
          divWidth="w-[125px]"
        />
      </div>
      <div className="flex flex-col sm:w-[65%]">
        <div className="flex justify-between">
          <div className="w-2/3 flex flex-col sm:flex-row justify-between">
            <h1 className="text-left text-2xl font-extrabold text-SECONDARY mt-1">
              {pokemonDetails.name}
            </h1>
            <div className="hidden sm:block h-10 border-l border-SECONDARY mx-4" />
            <h1 className="text-left text-2xl font-medium text-SECONDARY mt-1">
              {currentId?.toString().padStart(3, '0')}{' '}
            </h1>
          </div>
          <div className="hidden sm:block h-10 border-l border-SECONDARY mx-4" />
          <div className="flex items-start mt-2 gap-2">
            <Link
              href={`/pokemon-detail-page/${currentId - 1}/${pokemonDetails.prevPokemonName?.toLowerCase()}`}
              passHref
              aria-label="Go to previous Pokemon"
            >
              <button
                className="rounded-full font-bold text-SECONDARY hidden sm:block"
                aria-label="Go to previous Pokemon"
              >
                <BsArrowLeftCircle className="text-xl" />
              </button>
            </Link>
            <button
              className="rounded-full font-bold text-SECONDARY"
              aria-label="Close and go back"
              onClick={handleGoBack}
            >
              <BsXCircle className="text-xl" />
            </button>
            <Link
              href={`/pokemon-detail-page/${currentId + 1}/${pokemonDetails.nextPokemonName?.toLowerCase()}`}
              passHref
              aria-label="Go to next Pokemon"
            >
              <button
                className="rounded-full font-bold text-SECONDARY hidden sm:block"
                aria-label="Go to next Pokemon"
              >
                <BsArrowRightCircle className="text-xl" />
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex gap-8">
          <div className="w-1/2 block sm:hidden">
            <PokemonCard
              imageUrl={pokemonDetails.imageUrl}
              types={pokemonDetails.types}
              imageHeight={125}
              imageWidth={125}
              cardHeight={pokemonDetails.cardHeight}
              cardWidth={pokemonDetails.cardWidth}
              divWidth="w-[125px] sm:w-[125px]"
              divHeight="h-[125px]  sm:h-[125px]"
            />
          </div>
          <p className="text-SECONDARY text-sm font-medium hidden md:block">
            {showFullDescription
              ? pokemonDetails.description
              : truncatedDescriptionLarge}
            {!showFullDescription && (
              <button
                className="text-SECONDARY font-extrabold underline focus:outline-none focus:ring-2 focus:ring-SECONDARY focus:ring-opacity-50 ml-1 p-1 rounded"
                onClick={toggleDescriptionPopup}
                aria-expanded={showFullDescription}
              >
                Read More
              </button>
            )}
          </p>
          <p className="text-SECONDARY text-sm font-medium block md:hidden">
            {showFullDescription
              ? pokemonDetails.description
              : truncatedDescriptionSmall}
            {!showFullDescription && (
              <button
                className="text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 p-1"
                onClick={toggleDescriptionPopup}
                aria-expanded={showFullDescription}
              >
                Read More
              </button>
            )}
          </p>
        </div>
        {showFullDescription && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              ref={popupRef}
              className="bg-SECONDARY p-8 max-w-md m-2 h-[550px] rounded-lg overflow-auto"
            >
              <div className="flex justify-between mb-4">
                <h2 id="modal-title" className="text-2xl font-bold text-white">
                  {pokemonDetails.name}
                </h2>
                <button
                  ref={closeButtonRef}
                  className="text-white font-semibold rounded text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 p-1"
                  onClick={toggleDescriptionPopup}
                  aria-label="Close description"
                >
                  &times;
                </button>
              </div>
              <p className="text-white">{pokemonDetails.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonBasicInfo;
