import { NextPageContext } from 'next';
import pokemonBall from '@/assests/images/pokeball.png';
import Image from 'next/image';
import Link from 'next/link';

function ErrorPage({ statusCode }: { readonly statusCode: number }) {
  let errorMessage = '';

  switch (statusCode) {
    case 400:
      errorMessage = '400 Bad Request';
      break;
    case 401:
      errorMessage = '401 Unauthorized';
      break;
    case 403:
      errorMessage = '403 Forbidden';
      break;
    case 404:
      errorMessage = '404 Not Found';
      break;
    case 408:
      errorMessage = '408 Request Timeout';
      break;
    case 500:
      errorMessage = '500 Internal Server Error';
      break;
    case 501:
      errorMessage = '501 Not Implemented';
      break;
    case 502:
      errorMessage = '502 Bad Gateway';
      break;
    case 503:
      errorMessage = '503 Service Unavailable';
      break;
    case 504:
      errorMessage = '504 Gateway Timeout';
      break;
    default:
      errorMessage = `An error ${statusCode} occurred`;
      break;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-PRIMARY p-4">
      <div className="text-center p-4 bg-white rounded shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-red-700">
          {errorMessage}
        </h1>
        <p className="mt-2 text-base md:text-lg text-gray-700">
          Oops! Something went wrong. Please try again.
        </p>
        <div className="flex items-center justify-center mt-4">
          <span className="text-SECONDARY font-light text-5xl md:text-[10rem]">
            O
          </span>
          <Image
            src={pokemonBall}
            alt="Pokemon ball"
            width={150}
            height={150}
            className="w-20 h-20 md:w-1/2 md:h-auto"
          />
          <span className="text-SECONDARY font-light text-5xl md:text-[10rem]">
            P
          </span>
          <span className="text-SECONDARY font-light text-5xl md:text-[10rem]">
            S
          </span>
        </div>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-SECONDARY text-white rounded"
        >
          Please Try Again
        </Link>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  let statusCode = 404;

  if (res && res.statusCode) {
    statusCode = res.statusCode;
  } else if (err && err.statusCode) {
    statusCode = err.statusCode;
  }

  return { statusCode };
};

export default ErrorPage;
