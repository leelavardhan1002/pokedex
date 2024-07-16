import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import FilterDropdown from '@/components/atoms/type';
import { NextRouter } from 'next/router';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '',
    query: { search: 'test' },
    asPath: '',
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation(() => 'Option 1,Option 2'),
    toString: jest.fn().mockReturnValue(''),
  }),
}));

describe('FilterDropdown', () => {
  const mockRouter: NextRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    basePath: '',
    isFallback: false,
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
  };

  const defaultProps = {
    label: 'Test Label',
    options: ['Option 1', 'Option 2', 'Option 3'],
    paramName: 'test',
    onChange: jest.fn(),
    isOpen: false,
    toggleDropdown: jest.fn(),
  };

  it('renders correctly with initial state', () => {
    const { getByText, queryByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <FilterDropdown {...defaultProps} />
      </RouterContext.Provider>
    );

    expect(getByText('Test Label')).toBeInTheDocument();
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('+ 1 More')).toBeInTheDocument();
    expect(queryByText('Option 3')).not.toBeInTheDocument();
  });

  it('toggles dropdown on click', async () => {
    const { getByRole } = render(
      <RouterContext.Provider value={mockRouter}>
        <FilterDropdown {...defaultProps} />
      </RouterContext.Provider>
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(defaultProps.toggleDropdown).toHaveBeenCalledWith('test');
  });

  it('displays options when open', () => {
    const { getAllByRole } = render(
      <RouterContext.Provider value={mockRouter}>
        <FilterDropdown {...defaultProps} isOpen />
      </RouterContext.Provider>
    );

    const options = getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Option 1');
    expect(options[1]).toHaveTextContent('Option 2');
    expect(options[2]).toHaveTextContent('Option 3');
  });

  it('handles option selection', async () => {
    const { getAllByRole } = render(
      <RouterContext.Provider value={mockRouter}>
        <FilterDropdown {...defaultProps} isOpen />
      </RouterContext.Provider>
    );

    const options = getAllByRole('option');
    fireEvent.click(options[2]);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith([
        'Option 1',
        'Option 2',
        'Option 3',
      ]);
    });
  });

  it('handles option deselection', async () => {
    const { getAllByRole } = render(
      <RouterContext.Provider value={mockRouter}>
        <FilterDropdown {...defaultProps} isOpen />
      </RouterContext.Provider>
    );

    const options = getAllByRole('option');
    fireEvent.click(options[0]);

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith(['Option 2']);
    });
  });

  it('handles keyboard navigation', () => {
    const { getByRole } = render(
      <RouterContext.Provider value={mockRouter}>
        <FilterDropdown {...defaultProps} />
      </RouterContext.Provider>
    );

    const button = getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(defaultProps.toggleDropdown).toHaveBeenCalledWith('test');

    fireEvent.keyDown(button, { key: ' ' });
    expect(defaultProps.toggleDropdown).toHaveBeenCalledWith('test');
  });

  it('handles keyboard selection of options', async () => {
    const { getAllByRole } = render(
      <RouterContext.Provider value={mockRouter}>
        <FilterDropdown {...defaultProps} isOpen />
      </RouterContext.Provider>
    );

    const options = getAllByRole('option');
    fireEvent.keyDown(options[2], { key: 'Enter' });

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith([
        'Option 1',
        'Option 2',
        'Option 3',
      ]);
    });

    fireEvent.keyDown(options[2], { key: ' ' });

    await waitFor(() => {
      expect(defaultProps.onChange).toHaveBeenCalledWith([
        'Option 1',
        'Option 2',
      ]);
    });
  });
});
