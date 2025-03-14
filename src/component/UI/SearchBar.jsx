// components/marketplace/SearchBar.js

const SearchBar = ({ searchTerm, selectedCategory, onSearchChange, onSearch }) => {
    return (
      <div className="px-4 py-2">
        <form onSubmit={onSearch} className="flex border border-gray-300 rounded-md overflow-hidden">
          <div className="flex-grow flex items-center px-4">
            <span className="text-gray-500 mr-2 text-xs">{selectedCategory}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              className="ml-2 flex-grow outline-none py-3"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
          <button type="submit" className="bg-gray-900 text-white px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>
    )
  }
  
  export default SearchBar