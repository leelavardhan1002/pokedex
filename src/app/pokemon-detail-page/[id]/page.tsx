// app/pokemon-detail-page/[id]/page.tsx
import React, { Suspense } from 'react';
import PokemonAdvancedInfo from '@/components/molecules/pokemonDetails/advancedInfo';
import PokemonBasicInfo from '@/components/molecules/pokemonDetails/basicInfo';
import EvolutionChain from '@/components/molecules/pokemonDetails//evolutionChain';
import PokemonStats from '@/components/molecules/pokemonDetails/stats';
import { fetchPokemonDetails, fetchPokemons } from '@/api/data';
import { PokemonDetailPageProps } from '@/utils/types';
import Loader from '@/components/atoms/loader';

interface Metadata {
  title: string;
  description: string;
}

export async function generateStaticParams() {
  const limit = 1025;
  const { pokemons } = await fetchPokemons(1, limit);
  return pokemons.map((pokemon) => ({ id: pokemon.id.toString() }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const pokemonDetails = await fetchPokemonDetails(params.id);

  if (!pokemonDetails) {
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

const PokemonDetailPageContent: React.FC<{ id: string }> = async ({ id }) => {
  const pokemonDetails = await fetchPokemonDetails(id);

  if (!pokemonDetails) {
    return (
      <div className="bg-PRIMARY h-[100vh]" data-testid="mock-loader">
        <Loader />
      </div>
    );
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
      <PokemonDetailPageContent id={params.id} />
    </Suspense>
  );
};

export default PokemonDetailPage;
