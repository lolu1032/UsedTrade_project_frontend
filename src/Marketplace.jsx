// src/components/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marketplace = () => {
  const [products, setProducts] = useState([]);  // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [location, setLocation] = useState('수원시 권선구');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('중고거래');
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/boards/products`, {
        params: { page: currentPage, size: 14 }, // params 방식으로 전달
      });
  
      if (response.data && response.data.content) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error('Unexpected API response format:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    fetchProducts();
  };
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Fetch products by category
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Sample dummy products for testing when API fails
  const dummyProducts = [
    { id: 1, title: '운동기구 배달은 안됨', price: 50000, location: '세류2동', views: 23, imageUrl: 'https://example.com/150' },
    { id: 2, title: '스노우라인 롱킬렉스 캠핑의자', price: 90000, location: '탑동', views: 47, imageUrl: 'https://example.com/150' }
  ];
  
  return (
    <div className="max-w-screen-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <span className="text-orange-500 font-bold text-xl">좋은거래</span>
        </div>
        <div className='flex'>
        <div className="flex items-center space-x-1 bg-gray-200 rounded-full px-2 py-1 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className='text-s'>{location}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
          <div className="flex items-center space-x-2 px-4 py-2">
            <button className="text-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Search */}
      <div className="px-4 py-2">
        <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-md overflow-hidden">
          <div className="flex-grow flex items-center px-4">
            <span className="text-gray-500 mr-2 text-xs">
              {selectedCategory}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <input 
              type="text" 
              placeholder="검색어를 입력해주세요" 
              className="ml-2 flex-grow outline-none py-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-gray-900 text-white px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
      
      {/* Breadcrumb */}
      <div className="flex items-center text-sm px-4 py-2 text-gray-500">
        <span>홈</span>
        <span className="mx-1">{'>'}</span>
        <span className="font-medium text-black">중고거래</span>
      </div>
      
      {/* Title */}
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold">경기도 수원시 권선구 중고거래</h1>
      </div>
      
      {/* Filter */}
      <div className="px-4 py-2">
        <button className="flex items-center text-sm bg-gray-100 rounded-full px-3 py-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          필터 (1)
        </button>
      </div>
      
      {/* Product List */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Use API data if available, otherwise use dummy data for testing */}
            {(products.length > 0 ? products : dummyProducts).map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="relative pt-[100%] bg-gray-200"> {/* Use padding-top instead of aspect ratio */}
                  <img 
                    src={product.imageUrl || 'https://example.com/150'} 
                    alt={product.title} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap">{product.title || '상품 제목'}</h3>
                  <p className="font-bold mt-1">{product.price?.toLocaleString() || '0'}원</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{product.location || '도원동'}</span>
                    <span>조회 {product.views || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === index ? 'bg-gray-900 text-white' : 'bg-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;