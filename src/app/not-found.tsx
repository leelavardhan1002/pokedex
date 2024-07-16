import Image from 'next/image';
import Link from 'next/link';
import pokemonBall from '../assests/images/pokeball.png';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-PRIMARY p-4">
      <div className="text-center p-4 bg-white rounded shadow-lg max-w-lg mx-auto">
        <p className="mt-2 text-base md:text-lg text-gray-700">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="flex items-center justify-center mt-4">
          <span className="text-SECONDARY font-light text-5xl md:text-[15rem]">
            4
          </span>
          <Image
            src={pokemonBall}
            alt="Pokemon ball"
            width={150}
            height={150}
            className="w-20 h-20 md:w-1/2 md:h-auto"
          />
          <span className="text-SECONDARY font-light text-5xl md:text-[15rem]">
            4
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-red-700 mt-4">
          Page Not Found
        </h1>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-SECONDARY text-white rounded"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
