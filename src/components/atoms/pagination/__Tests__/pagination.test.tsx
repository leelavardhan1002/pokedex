import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '..';
import '@testing-library/jest-dom';

describe('Pagination', () => {
  const onPageChange = jest.fn();

  it('renders without crashing', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />
    );
  });

  it('renders the correct current page and total pages', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />
    );
    expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
  });

  it('disables the "Previous" button when the current page is 1', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />
    );
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables the "Next" button when the current page is the total pages', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onPageChange with the correct argument when the "Previous" button is clicked', () => {
    render(
      <Pagination currentPage={2} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with the correct argument when the "Next" button is clicked', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
