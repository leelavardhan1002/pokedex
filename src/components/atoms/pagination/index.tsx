import { PaginationProps } from '@/utils/types';
import React from 'react';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 m-1 bg-SECONDARY rounded text-white"
      >
        Previous
      </button>
      <span className="px-4 py-2 m-1 flex items-center text-sm sm:text-md text-SECONDARY">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 m-1 bg-SECONDARY rounded text-white"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
