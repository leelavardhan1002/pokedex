import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NextPageContext } from 'next';
import Error from '../_error';
import { ImageProps } from 'next/image';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => (
    <img {...props} alt={props.alt} src={props.src as string} />
  ),
}));

// Mock the pokeball image import
jest.mock('@/assets/pokeball.png', () => 'mocked-pokeball.png');

describe('Error Component', () => {
  test('renders 501 Internal Server Error for status code 501', () => {
    render(<Error statusCode={501} />);
    expect(screen.getByText('501 Not Implemented')).toBeInTheDocument();
  });

  test('renders 501 Internal Server Error for status code 501', () => {
    render(<Error statusCode={502} />);
    expect(screen.getByText('502 Bad Gateway')).toBeInTheDocument();
  });

  test('renders 501 Internal Server Error for status code 501', () => {
    render(<Error statusCode={503} />);
    expect(screen.getByText('503 Service Unavailable')).toBeInTheDocument();
  });

  test('renders 501 Internal Server Error for status code 501', () => {
    render(<Error statusCode={504} />);
    expect(screen.getByText('504 Gateway Timeout')).toBeInTheDocument();
  });

  test('renders generic error message for other status codes', () => {
    render(<Error statusCode={404} />);
    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  test('renders generic error message for other status codes', () => {
    render(<Error statusCode={400} />);
    expect(screen.getByText('400 Bad Request')).toBeInTheDocument();
  });

  test('renders generic error message for other status codes', () => {
    render(<Error statusCode={401} />);
    expect(screen.getByText('401 Unauthorized')).toBeInTheDocument();
  });

  test('renders generic error message for other status codes', () => {
    render(<Error statusCode={403} />);
    expect(screen.getByText('403 Forbidden')).toBeInTheDocument();
  });

  test('renders generic error message for other status codes', () => {
    render(<Error statusCode={499} />);
    expect(screen.getByText('An error 499 occurred')).toBeInTheDocument();
  });

  test('renders generic error message for other status codes', () => {
    render(<Error statusCode={408} />);
    expect(screen.getByText('408 Request Timeout')).toBeInTheDocument();
  });

  test('displays the error message and try again text', () => {
    render(<Error statusCode={500} />);
    expect(screen.getByText('500 Internal Server Error')).toBeInTheDocument();
    expect(screen.getByText('Please Try Again')).toBeInTheDocument();
  });

  test('renders the OPS text and Pokeball image', () => {
    render(<Error statusCode={500} />);
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByAltText('Pokemon ball')).toBeInTheDocument();
  });

  test('Try Again link has correct href', () => {
    render(<Error statusCode={500} />);
    const link = screen.getByText('Please Try Again');
    expect(link).toHaveAttribute('href', '/');
  });

  test('getInitialProps returns correct statusCode from res', () => {
    const context = {
      res: { statusCode: 500 },
    } as NextPageContext;
    const props = Error.getInitialProps(context);
    expect(props).toEqual({ statusCode: 500 });
  });

  test('getInitialProps returns correct statusCode from err', () => {
    const context = {
      err: { statusCode: 400 },
    } as NextPageContext;
    const props = Error.getInitialProps(context);
    expect(props).toEqual({ statusCode: 400 });
  });

  test('getInitialProps returns 404 when no statusCode is available', () => {
    const context = {} as NextPageContext;
    const props = Error.getInitialProps(context);
    expect(props).toEqual({ statusCode: 404 });
  });
});
