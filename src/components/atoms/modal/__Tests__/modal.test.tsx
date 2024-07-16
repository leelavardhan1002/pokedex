import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '..';

describe('Modal', () => {
  const onCloseMock = jest.fn();
  const modalContent = <div>Modal Content</div>;

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={onCloseMock}>
        {modalContent}
      </Modal>
    );

    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen onClose={onCloseMock}>
        {modalContent}
      </Modal>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <Modal isOpen onClose={onCloseMock}>
        {modalContent}
      </Modal>
    );

    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should render children correctly', () => {
    const customContent = (
      <div data-testid="custom-content">Custom Modal Content</div>
    );
    render(
      <Modal isOpen onClose={onCloseMock}>
        {customContent}
      </Modal>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Modal Content')).toBeInTheDocument();
  });
});
