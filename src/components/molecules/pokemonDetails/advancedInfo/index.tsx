interface PokemonAdvancedInfoProps {
  pokemonDetails: {
    height: string;
    weight: string;
    gender: string[];
    eggGroups: string[];
    abilities: string[];
    types: string[];
    weakAgainst: string[];
  };
}

const PokemonAdvancedInfo: React.FC<PokemonAdvancedInfoProps> = ({
  pokemonDetails,
}) => {
  return (
    <div className="flex flex-col justify-between w-full md:w-3/4 lg:w-2/4 bg-PRIMARY p-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 sm:mb-10">
        <div className="col-span-1">
          <p className="text-SECONDARY font-bold text-sm mb-1">Height</p>
          <span className="text-SECONDARY font-medium text-xs">
            {pokemonDetails.height}
          </span>
        </div>
        <div className="col-span-1">
          <p className="text-SECONDARY font-bold text-sm mb-1">Weight</p>
          <span className="text-SECONDARY font-medium text-xs">
            {pokemonDetails.weight}
          </span>
        </div>
        <div className="col-span-1">
          <p className="text-SECONDARY font-bold text-sm mb-1">Gender(s)</p>
          <div>
            {pokemonDetails.gender.map((genderType: string, index: number) => (
              <span className="text-SECONDARY font-medium text-xs" key={index}>
                {genderType}
                {index !== pokemonDetails.gender.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <p className="text-SECONDARY font-bold text-sm mb-1">Egg Groups</p>
          <div>
            {pokemonDetails.eggGroups.map(
              (eggGroupsType: string, index: number) => (
                <span
                  className="text-SECONDARY font-medium text-xs"
                  key={index}
                >
                  {eggGroupsType}
                  {index !== pokemonDetails.eggGroups.length - 1 && ', '}
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-1">
          <p className="text-SECONDARY font-bold text-sm mb-1">Abilities</p>
          <div>
            {pokemonDetails.abilities.map(
              (abilityType: string, index: number) => (
                <span
                  className="text-SECONDARY font-medium text-xs"
                  key={index}
                >
                  {abilityType}
                  {index !== pokemonDetails.abilities.length - 1 && ', '}
                </span>
              )
            )}
          </div>
        </div>
        <div className="col-span-1 md:col-span-1">
          <p className="text-SECONDARY font-bold text-sm mb-1">Types</p>
          <div>
            {pokemonDetails.types.map((type: string, index: number) => {
              let color = '';
              switch (type.toUpperCase()) {
                case 'FIRE':
                  color = 'bg-FIRE';
                  break;
                case 'WATER':
                  color = 'bg-WATER';
                  break;
                case 'GRASS':
                  color = 'bg-GRASS';
                  break;
                case 'ELECTRIC':
                  color = 'bg-ELECTRIC';
                  break;
                case 'ICE':
                  color = 'bg-ICE';
                  break;
                case 'FIGHTING':
                  color = 'bg-FIGHTING';
                  break;
                case 'POISON':
                  color = 'bg-POISON';
                  break;
                case 'GROUND':
                  color = 'bg-GROUND';
                  break;
                case 'FLYING':
                  color = 'bg-FLYING';
                  break;
                case 'PSYCHIC':
                  color = 'bg-PSYCHIC';
                  break;
                case 'BUG':
                  color = 'bg-BUG';
                  break;
                case 'ROCK':
                  color = 'bg-ROCK';
                  break;
                case 'GHOST':
                  color = 'bg-GHOST';
                  break;
                case 'DRAGON':
                  color = 'bg-DRAGON';
                  break;
                case 'DARK':
                  color = 'bg-DARK';
                  break;
                case 'STEEL':
                  color = 'bg-STEEL';
                  break;
                case 'FAIRY':
                  color = 'bg-FAIRY';
                  break;
                default:
                  color = 'bg-NORMAL';
                  break;
              }
              return (
                <span
                  key={index}
                  className={`text-SECONDARY ${color} font-medium text-xs rounded-md border-SECONDARY border-[1.5px] mr-1 p-[2px]`}
                >
                  {type}
                </span>
              );
            })}
          </div>
        </div>
        <div className="col-span-2 md:col-span-2">
          <p className="text-SECONDARY font-bold text-sm mb-1">Weak Against</p>
          <div className="flex flex-wrap">
            {pokemonDetails.weakAgainst.map(
              (weakAgainstType: string, index: number) => (
                <span
                  key={index}
                  className={`text-SECONDARY font-medium text-xs rounded-md border-SECONDARY border-[1.5px] mr-1 mb-1 p-[2px] bg-${weakAgainstType.toUpperCase()}`}
                >
                  {weakAgainstType}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PokemonAdvancedInfo;
