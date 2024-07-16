import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';
import '@testing-library/jest-dom';

describe('RootLayout', () => {
  it('renders without crashing', () => {
    render(<RootLayout>Test</RootLayout>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <RootLayout>
        <div>Child</div>
      </RootLayout>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
