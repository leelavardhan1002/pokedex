import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Providers } from '../providers';

// Mock the redux store
jest.mock('../../redux/store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe('Providers Component', () => {
  test('renders children wrapped in Redux Provider', () => {
    function TestChild() {
      return <div data-testid="mock-provider">Test Child</div>;
    }
    const { getByTestId, getByText } = render(
      <Providers>
        <TestChild />
      </Providers>
    );

    const providerElement = getByTestId('mock-provider');
    expect(providerElement).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
