

type TEduCPagination = {
  page: number;
  setPage: (page: number) => void;
  totalPages?: number;
  className?: string;
};

const EduCPagination = ({
  page,
  setPage,
  totalPages = 100,
  className,
}: TEduCPagination) => {
  // Ensure page is within valid range
  const currentPage = Math.max(1, Math.min(page, totalPages));

  // Generate page numbers to display
  const getPageNumbers = () => {
    // For small number of pages, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For many pages, show current page with neighbors and ellipsis
    const pages = [1];

    if (currentPage > 3) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add the current page and its neighbors
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push(-2); // -2 represents ellipsis
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={`flex items-center ${className || ""}`}>
      <button
        onClick={() => currentPage > 1 && setPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 border text-sm rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {getPageNumbers().map((pageNum, index) =>
        pageNum < 0 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-1 text-sm border-t border-b border-r"
          >
            ...
          </span>
        ) : (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`px-3 py-1 text-sm border-t border-b border-r ${
              currentPage === pageNum
                ? "bg-primary text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {pageNum}
          </button>
        )
      )}
      <button
        onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 text-sm border-t border-b border-r rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default EduCPagination;
