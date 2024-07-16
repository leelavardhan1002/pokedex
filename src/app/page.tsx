import Header from '@/components/organisms/header';
import PokemonList from '@/components/organisms/pokemonList';
import { fetchPokemons } from '@/api/data';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Loader from '@/components/atoms/loader';
import { Providers } from './providers';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    page: string;
  };
}): Promise<Metadata> {
  const currentPage = Number(searchParams.page) || 1;

  return {
    title: `Pokémons - Page ${currentPage}`,
    description: `Browse through a list of Pokémon on page ${currentPage} with filtering and pagination options.`,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const currentPage = Number(searchParams.page?.toString() || '1');
  const limit = Number(searchParams.limit?.toString() || '20');

  const { pokemons, totalPages, error } = await fetchPokemons(
    currentPage,
    limit
  );

  return (
    <main className="flex min-h-screen flex-col px-1 py-10 md:px-16 md:py-10 bg-PRIMARY">
      <Providers>
        <Header />
        <Suspense fallback={<Loader />}>
          <PokemonList
            initialPokemons={pokemons}
            initialTotalPages={totalPages}
            currentPage={currentPage}
            limit={limit}
            error={error}
          />
        </Suspense>
      </Providers>
    </main>
  );
}
