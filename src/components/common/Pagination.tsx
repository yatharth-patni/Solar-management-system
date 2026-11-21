import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-[#77727D]">
      <div className="flex items-center space-x-2">
        <span>
          Showing <span className="font-semibold text-[#17151A]">{startItem}</span> - <span className="font-semibold text-[#17151A]">{endItem}</span> of <span className="font-semibold text-[#17151A]">{totalItems}</span> results
        </span>
        {onItemsPerPageChange && (
          <div className="ml-4 flex items-center space-x-1.5 pl-3 border-l border-[#E7E5E9]">
            <span>Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-transparent border border-[#E7E5E9] rounded-md px-1.5 py-0.5 text-xs text-[#17151A] focus:outline-none"
            >
              <option value={7}>7</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#E7E5E9]/80 text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, idx) => (
          typeof p === 'number' ? (
            <button
              key={idx}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-medium transition-colors ${
                currentPage === p
                  ? 'bg-[#765087] text-white shadow-subtle'
                  : 'text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5]'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-1 text-[#9E9AA3]">...</span>
          )
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#E7E5E9]/80 text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
