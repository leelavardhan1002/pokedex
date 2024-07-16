import { PokemonProps } from '@/utils/types';
import Image from 'next/image';

const PokemonCard: React.FC<PokemonProps> = ({
  id,
  imageUrl,
  name,
  types,
  showId = true,
  cardWidth = '150px',
  cardHeight = '225px',
  imageWidth = 75,
  imageHeight = 75,
  divWidth = 'w-[75px] sm:w-[125px]',
  divHeight = 'h-[95px]  sm:h-[125px]',
}) => {
  let finalFromColor = '';
  let finalToColor = '';

  switch (types[0].toUpperCase()) {
    case 'FIRE':
      finalFromColor = 'from-FIRE';
      break;
    case 'WATER':
      finalFromColor = 'from-WATER';
      break;
    case 'GRASS':
      finalFromColor = 'from-GRASS';
      break;
    case 'ELECTRIC':
      finalFromColor = 'from-ELECTRIC';
      break;
    case 'ICE':
      finalFromColor = 'from-ICE';
      break;
    case 'FIGHTING':
      finalFromColor = 'from-FIGHTING';
      break;
    case 'POISON':
      finalFromColor = 'from-POISON';
      break;
    case 'GROUND':
      finalFromColor = 'from-GROUND';
      break;
    case 'FLYING':
      finalFromColor = 'from-FLYING';
      break;
    case 'PSYCHIC':
      finalFromColor = 'from-PSYCHIC';
      break;
    case 'BUG':
      finalFromColor = 'from-BUG';
      break;
    case 'ROCK':
      finalFromColor = 'from-ROCK';
      break;
    case 'GHOST':
      finalFromColor = 'from-GHOST';
      break;
    case 'DRAGON':
      finalFromColor = 'from-DRAGON';
      break;
    case 'DARK':
      finalFromColor = 'from-DARK';
      break;
    case 'STEEL':
      finalFromColor = 'from-STEEL';
      break;
    case 'FAIRY':
      finalFromColor = 'from-FAIRY';
      break;
    default:
      finalFromColor = 'from-NORMAL';
      break;
  }

  switch (types[1]?.toUpperCase()) {
    case 'FIRE':
      finalToColor = 'to-FIRE';
      break;
    case 'WATER':
      finalToColor = 'to-WATER';
      break;
    case 'GRASS':
      finalToColor = 'to-GRASS';
      break;
    case 'ELECTRIC':
      finalToColor = 'to-ELECTRIC';
      break;
    case 'ICE':
      finalToColor = 'to-ICE';
      break;
    case 'FIGHTING':
      finalToColor = 'to-FIGHTING';
      break;
    case 'POISON':
      finalToColor = 'to-POISON';
      break;
    case 'GROUND':
      finalToColor = 'to-GROUND';
      break;
    case 'FLYING':
      finalToColor = 'to-FLYING';
      break;
    case 'PSYCHIC':
      finalToColor = 'to-PSYCHIC';
      break;
    case 'BUG':
      finalToColor = 'to-BUG';
      break;
    case 'ROCK':
      finalToColor = 'to-ROCK';
      break;
    case 'GHOST':
      finalToColor = 'to-GHOST';
      break;
    case 'DRAGON':
      finalToColor = 'to-DRAGON';
      break;
    case 'DARK':
      finalToColor = 'to-DARK';
      break;
    case 'STEEL':
      finalToColor = 'to-STEEL';
      break;
    case 'FAIRY':
      finalToColor = 'to-FAIRY';
      break;
    default:
      finalToColor = 'to-NORMAL';
      break;
  }

  return (
    <div
      style={{ width: cardWidth, height: cardHeight }}
      className={`bg-gradient-to-b ${finalFromColor} ${finalToColor} rounded-lg border-[1.5px] border-dashed border-SECONDARY flex flex-col justify-center items-center`}
    >
      <div className="flex justify-center items-center">
        <div
          className={`${divHeight} ${divWidth} flex justify-center items-center`}
        >
          <Image
            src={imageUrl ?? 'pokemonImage'}
            alt={name ?? ''}
            lang="en"
            width={imageWidth}
            height={imageHeight}
            priority
          />
        </div>
      </div>
      {showId && (
        <div className="mt-8 text-center">
          <p className="font-bold text-SECONDARY">{name?.toUpperCase()}</p>

          <p className="text-SECONDARY font-medium">
            {id?.toString().padStart(3, '0')}
          </p>
        </div>
      )}
    </div>
  );
};

export default PokemonCard;
