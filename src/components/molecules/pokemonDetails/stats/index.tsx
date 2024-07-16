import { MAX_WIDTH, STATS_NAMES } from '@/utils/constants';
import { PokemonInfoProps } from '@/utils/types';
import React from 'react';

const PokemonStats: React.FC<PokemonInfoProps> = ({ pokemonDetails }) => {
  return (
    <div className="flex flex-col w-full md:w-3/4 lg:w-2/4 bg-PRIMARY p-8">
      <div className="flex flex-col w-full justify-between bg-[#b0d2d2] rounded-lg py-4 px-3">
        <p className="text-SECONDARY font-xl font-bold mb-4 ml-3">Stats</p>
        <div className="flex flex-wrap -mx-2">
          {pokemonDetails.pokemonStats &&
            pokemonDetails.pokemonStats.map((stat, index) => (
              <div key={index} className="w-full sm:w-1/2 px-5 mb-4">
                <div className="flex justify-between items-center">
                  <div className="w-1/4 text-SECONDARY text-xs">
                    {STATS_NAMES[index]}
                  </div>
                  <div className="w-3/4 bg-[#93b2b2] rounded-sm h-4 overflow-hidden">
                    <div
                      className="bg-SECONDARY h-full text-[11px] pl-1 items-center"
                      style={{
                        width: `${Math.min(stat.base_stat, MAX_WIDTH)}px`,
                        minWidth: '0px',
                        maxWidth: `${MAX_WIDTH}px`,
                      }}
                    >
                      {stat.base_stat}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonStats;
