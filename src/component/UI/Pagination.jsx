// components/marketplace/Pagination.js

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center py-4 items-center">
        {/* Left arrow button for previous page range */}
        <button
          onClick={() => onPageChange(Math.max(Math.floor(currentPage / 10) * 10 - 10, 0))}
          className="mx-1 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
          disabled={currentPage <= 9}
        >
          &lt;
        </button>
  
        {/* Page buttons */}
        {Array.from({ length: 10 }).map((_, index) => {
          const pageNum = Math.floor(currentPage / 10) * 10 + index
          return (
            pageNum < totalPages && (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
                  currentPage === pageNum ? "bg-gray-900 text-white" : "bg-gray-100"
                }`}
              >
                {pageNum + 1}
              </button>
            )
          )
        })}
  
        {/* Right arrow button for next page range */}
        <button
          onClick={() => onPageChange(Math.min(Math.floor(currentPage / 10) * 10 + 10, totalPages - 1))}
          className="mx-1 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
          disabled={Math.floor(currentPage / 10) * 10 + 10 >= totalPages}
        >
          &gt;
        </button>
      </div>
    )
  }
  
  export default Pagination