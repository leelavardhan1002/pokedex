import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import StatsDropdown from '@/components/atoms/stats';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.ResizeObserver = ResizeObserverMock;
});

describe('StatsDropdown', () => {
  const mockToggleDropdown = jest.fn();
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({
      toString: () => '',
      get: mockGet,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when closed', () => {
    render(
      <StatsDropdown
        label="Stats"
        stats={['HP', 'Attack', 'Defense', 'Speed', 'SpecialAtt', 'SpecialDef']}
        isOpen={false}
        toggleDropdown={mockToggleDropdown}
      />
    );

    expect(screen.getByText('Stats')).toBeTruthy();
    expect(screen.queryByText('Select Stats')).not.toBeTruthy();
  });

  it('opens the dropdown when clicked', () => {
    render(
      <StatsDropdown
        label="Stats"
        stats={['HP', 'Attack', 'Defense', 'Speed', 'SpecialAtt', 'SpecialDef']}
        isOpen={false}
        toggleDropdown={mockToggleDropdown}
      />
    );

    fireEvent.click(screen.getByTestId('stats-dropdown'));
    expect(mockToggleDropdown).toHaveBeenCalledWith('stats');
  });

  it('renders correctly when open', () => {
    render(
      <StatsDropdown
        label="Stats"
        stats={['HP', 'Attack', 'Defense', 'Speed', 'SpecialAtt', 'SpecialDef']}
        isOpen
        toggleDropdown={mockToggleDropdown}
      />
    );

    expect(screen.getByText('Select Stats')).toBeTruthy();
    expect(screen.getAllByRole('slider')).toHaveLength(12);
  });

  it('updates stat values when sliders are moved', () => {
    render(
      <StatsDropdown
        label="Stats"
        stats={['HP']}
        isOpen
        toggleDropdown={mockToggleDropdown}
      />
    );

    const sliders = screen.getAllByRole('slider');
    fireEvent.mouseDown(sliders[0]);
    fireEvent.mouseMove(sliders[0], { clientX: 100 });
    fireEvent.mouseUp(sliders[0]);

    fireEvent.mouseDown(sliders[1]);
    fireEvent.mouseMove(sliders[1], { clientX: 200 });
    fireEvent.mouseUp(sliders[1]);

    // Check if the values have changed. The exact values might differ, so we're checking if they're not the initial values.
    expect(screen.queryByText('0')).not.toBeTruthy();
    expect(screen.queryByText('210')).not.toBeTruthy();
  });

  it('resets stats when Reset button is clicked', () => {
    render(
      <StatsDropdown
        label="Stats"
        stats={['HP']}
        isOpen
        toggleDropdown={mockToggleDropdown}
      />
    );

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    const countZeros = screen.getAllByText('0');
    const countTwoTen = screen.getAllByText('210');
    expect(countZeros.length).toBe(2);
    expect(countTwoTen.length).toBe(2);
  });

  it('applies stats and updates URL when Apply button is clicked', async () => {
    render(
      <StatsDropdown
        label="Stats"
        stats={['HP', 'Attack']}
        isOpen
        toggleDropdown={mockToggleDropdown}
      />
    );

    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
    expect(mockToggleDropdown).toHaveBeenCalledWith('');
  });

  it('closes the dropdown when the close button is clicked', () => {
    render(
      <StatsDropdown
        label="Stats"
        stats={['HP']}
        isOpen
        toggleDropdown={mockToggleDropdown}
      />
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockToggleDropdown).toHaveBeenCalledWith('');
  });
});
