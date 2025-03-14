// components/marketplace/FilterBar.js

const FilterBar = () => {
    return (
      <div className="px-4 py-2">
        <button className="flex items-center text-sm bg-gray-100 rounded-full px-3 py-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          필터 (1)
        </button>
      </div>
    )
  }
  
  export default FilterBar