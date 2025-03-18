import { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ searchTerm, selectedCategory, onSearchChange, onSearch }) => {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!searchTerm.trim()) {
        // If search term is empty, clear search mode
        if (typeof onSearch === 'function') {
          onSearch(e, null);
        }
        return;
      }
      
      // Initial search with page 0
      const response = await axios.get('/api/search', {
        params: {
          keyword: searchTerm,
          page: 0,
          size: 4
        }
      });
      
      // Pass the search results to parent component along with pagination info
      if (typeof onSearch === 'function') {
        onSearch(e, {
          content: response.data.content || [],
          totalPages: response.data.totalPages || 0,
          isSearch: true,
          keyword: searchTerm
        });
      }
    } catch (error) {
      console.error('검색 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    onSearchChange(e);
    
    // If search term is cleared, exit search mode
    if (!e.target.value.trim()) {
      if (typeof onSearch === 'function') {
        onSearch(e, null);
      }
    }
  };
  
  return (
    <div className="px-4 py-2">
      <form onSubmit={handleSubmit} className="flex border border-gray-300 rounded-md overflow-hidden">
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
            onChange={handleInputChange}
          />
          {searchTerm && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => {
                onSearchChange({ target: { value: '' } });
                if (typeof onSearch === 'function') {
                  onSearch(new Event('submit'), null);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className="bg-gray-900 text-white px-4"
          disabled={loading}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;