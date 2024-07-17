import React, { Suspense } from 'react';
import PokemonAdvancedInfo from '@/components/molecules/pokemonDetails/advancedInfo';
import PokemonBasicInfo from '@/components/molecules/pokemonDetails/basicInfo';
import EvolutionChain from '@/components/molecules/pokemonDetails//evolutionChain';
import PokemonStats from '@/components/molecules/pokemonDetails/stats';
import { fetchPokemonDetails, fetchPokemons } from '@/api/data';
import { PokemonDetailPageProps } from '@/utils/types';
import Loader from '@/components/atoms/loader';
import Custom404 from '@/app/not-found';

interface Metadata {
  title: string;
  description: string;
}

export async function generateStaticParams() {
  const limit = 1025;
  const { pokemons } = await fetchPokemons(1, limit);
  return pokemons.map((pokemon) => ({
    id: pokemon.id.toString(),
    name: pokemon.name.toLowerCase(),
  }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { id: string; name: string };
}): Promise<Metadata> {
  const pokemonDetails = await fetchPokemonDetails(params.id);

  if (!pokemonDetails || pokemonDetails.name.toLowerCase() !== params.name) {
    return {
      title: 'Pokemon Not Found',
      description: 'The requested Pokemon could not be found.',
    };
  }

  return {
    title: `${pokemonDetails.name || 'Unknown'} | Pokemon Details`,
    description: `Learn about ${pokemonDetails.name || 'this Pokemon'}, a ${(
      pokemonDetails.types || []
    ).join('/')} type Pokemon with ${
      pokemonDetails.description || 'unknown details'
    }.`,
  };
}

const PokemonDetailPageContent: React.FC<{
  id: string;
  name: string;
}> = async ({ id, name }) => {
  const pokemonId = parseInt(id, 10);
  if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 1025) {
    return <Custom404 />;
  }

  const pokemonDetails = await fetchPokemonDetails(id);
  if (!pokemonDetails || pokemonDetails.name.toLowerCase() !== name) {
    return <Custom404 />;
  }

  return (
    <main className="flex min-h-screen flex-col text-PRIMARY bg-SECONDARY items-center justify-center">
      <PokemonBasicInfo pokemonDetails={pokemonDetails} />
      <PokemonAdvancedInfo pokemonDetails={pokemonDetails} />
      <PokemonStats pokemonDetails={pokemonDetails} />
      <EvolutionChain pokemonDetails={pokemonDetails} />
    </main>
  );
};

const PokemonDetailPage: React.FC<PokemonDetailPageProps> = ({ params }) => {
  return (
    <Suspense
      fallback={
        <div className="bg-PRIMARY h-[100vh]" data-testid="mock-loader">
          <Loader />
        </div>
      }
    >
      <PokemonDetailPageContent id={params.id} name={params.name} />
    </Suspense>
  );
};

export default PokemonDetailPage;
