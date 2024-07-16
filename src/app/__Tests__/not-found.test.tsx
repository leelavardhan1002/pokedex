import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Custom404 from '../not-found';

interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, width, height }: ImageProps) {
    return <img src={src} alt={alt} width={width} height={height} />;
  },
}));

// Mock the pokeball image import
jest.mock('../assets/pokeball.png', () => 'mocked-pokeball.png');

describe('Custom404 Component', () => {
  beforeEach(() => {
    render(<Custom404 />);
  });

  test('renders the error message', () => {
    expect(
      screen.getByText('Sorry, the page you are looking for does not exist.')
    ).toBeInTheDocument();
  });

  test('displays the 404 text', () => {
    const fourElements = screen.getAllByText('4');
    expect(fourElements).toHaveLength(2);
    fourElements.forEach((element) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass(
        'text-SECONDARY',
        'font-light',
        'text-5xl',
        'md:text-[15rem]'
      );
    });
  });

  test('renders the Pokeball image', () => {
    const image = screen.getByAltText('Pokemon ball');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-pokeball.png');
    expect(image).toHaveAttribute('width', '150');
    expect(image).toHaveAttribute('height', '150');
  });

  test('displays the Page Not Found heading', () => {
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toHaveClass(
      'text-2xl',
      'md:text-4xl',
      'font-bold',
      'text-red-700',
      'mt-4'
    );
  });

  test('renders the Go back home link', () => {
    const link = screen.getByText('Go back home');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass(
      'mt-4',
      'inline-block',
      'px-4',
      'py-2',
      'bg-SECONDARY',
      'text-white',
      'rounded'
    );
  });
});
