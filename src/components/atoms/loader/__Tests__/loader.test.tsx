import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from '..';

describe('Loader', () => {
  it('renders correctly', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('loader');
    expect(container.firstChild).toHaveClass('z-[500]');
  });
});
