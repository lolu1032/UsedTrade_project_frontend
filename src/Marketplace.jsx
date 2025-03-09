"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import LocationSelector from "./LocationSelector"

const Marketplace = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("중고거래")
  const [currentLocation, setCurrentLocation] = useState("서울시 강남구 신사동")
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Dummy products for testing when API is not available
  const dummyProducts = [
    {
      id: 1,
      title: "아이폰 13 프로 맥스 256GB 그래파이트",
      price: 950000,
      location: "도원동",
      views: 128,
      imageUrl: "https://via.placeholder.com/300",
      description: "애플 정품. 2022년 3월 구매, 배터리 효율 89%. 케이스, 충전기 포함. 기스 없이 깨끗하게 사용했습니다.",
      seller: "애플러버",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "갤럭시 S22 울트라 512GB 팬텀블랙",
      price: 850000,
      location: "도원동",
      views: 95,
      imageUrl: "https://via.placeholder.com/300",
      description: "삼성전자 갤럭시 S22 울트라 512GB 팬텀블랙 색상입니다. S펜 기능 완벽합니다. 약간의 네고 가능합니다. 직거래 선호합니다.",
      seller: "갤럭시팬",
      createdAt: "2024-02-03"
    },
    {
      id: 3,
      title: "맥북 프로 M1 13인치 512GB",
      price: 1250000,
      location: "도원동",
      views: 210,
      imageUrl: "https://via.placeholder.com/300",
      description: "맥북 프로 M1 13인치 512GB SSD 모델입니다. 사용 기간 1년 미만, 충전 사이클 87회입니다. 상태 매우 좋습니다. 박스, 충전기 모두 있습니다.",
      seller: "맥북사랑",
      createdAt: "2024-01-28"
    },
    {
      id: 4,
      title: "애플워치 시리즈 7 GPS 41mm",
      price: 320000,
      location: "도원동",
      views: 76,
      imageUrl: "https://via.placeholder.com/300",
      description: "애플워치 시리즈 7 GPS 41mm 스타라이트 색상입니다. 구매 6개월 됐습니다. 보호필름 부착해서 사용해서 기스 없습니다. 충전기, 스트랩 포함입니다.",
      seller: "워치매니아",
      createdAt: "2024-02-10"
    },
  ]

  useEffect(() => {
    fetchProducts()
  }, [currentPage, currentLocation])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // 실제 API 호출 시 location 파라미터 추가
      const response = await axios.get(`/boards/products`, {
        params: {
          page: currentPage,
          size: 4,
          location: currentLocation, // 현재 선택된 위치로 필터링
        },
      })

      if (response.data && response.data.content) {
        setProducts(response.data.content)
        setTotalPages(response.data.totalPages)
      } else {
        console.error("Unexpected API response format:", response.data)
        setProducts([])
        // For demo purposes, set dummy total pages
        setTotalPages(5)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
      // For demo purposes, set dummy total pages
      setTotalPages(5)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    fetchProducts()
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    // Fetch products by category
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // 위치 변경 시 호출되는 함수
  const handleLocationChange = (newLocation) => {
    // 서울특별시, 강남구 -> 서울시 강남구로 포맷 변경
    let formattedLocation = newLocation.replace("특별시", "시").replace("광역시", "시")

    // 마지막 위치가 동 단위까지 표시되도록 처리
    const parts = formattedLocation.split(",").map((part) => part.trim())
    if (parts.length >= 2) {
      formattedLocation = parts.join(" ")
    }

    setCurrentLocation(formattedLocation)
    // 페이지 리셋 및 새 위치로 상품 검색
    setCurrentPage(0)
  }

  // 사이드 메뉴 토글 함수
  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen)
  }

  // 상품 선택 시 상세 페이지 열기
  const openProductDetail = (product) => {
    setSelectedProduct(product)
  }

  // 상세 페이지 닫기
  const closeProductDetail = () => {
    setSelectedProduct(null)
  }

  // 상품 세부 정보 페이지 컴포넌트
  const ProductDetail = ({ product, onClose }) => {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center p-4 border-b">
            <button onClick={onClose} className="text-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex space-x-4">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-200 w-full" style={{ height: '300px' }}>
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm">{product.seller?.charAt(0) || "판"}</span>
            </div>
            <div>
              <p className="font-medium">{product.seller || "판매자"}</p>
              <p className="text-sm text-gray-500">{product.location || "위치 정보 없음"}</p>
            </div>
          </div>
          
          <h1 className="text-xl font-bold mb-2">{product.title}</h1>
          <p className="text-sm text-gray-500 mb-2">{product.category || "중고거래"} • {product.createdAt || "등록일 정보 없음"}</p>
          
          <p className="text-lg font-bold mb-4">{product.price?.toLocaleString() || "0"}원</p>
          
          <div className="border-t border-b py-4 mb-4">
            <p>{product.description || "상품 설명이 없습니다."}</p>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>관심 {product.likes || 0}</span>
            <span>조회 {product.views || 0}</span>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 flex justify-between items-center">
          <button className="flex items-center justify-center w-12 h-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div className="flex-1 ml-4">
            <button className="bg-orange-500 text-white w-full py-3 rounded-md font-bold">
              채팅하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 사이드 메뉴 컴포넌트
  const SideMenu = ({ isOpen, onClose }) => {
    const menuItems = [
      { id: 1, name: "홈", icon: "home" },
      { id: 2, name: "내 근처", icon: "location" },
      { id: 3, name: "채팅", icon: "chat" },
      { id: 4, name: "관심목록", icon: "heart" },
      { id: 5, name: "나의 좋은거래", icon: "user" },
      { id: 6, name: "동네생활", icon: "community" },
      { id: 7, name: "중고거래 인증", icon: "verify" },
      { id: 8, name: "알림", icon: "notification" },
      { id: 9, name: "설정", icon: "settings" },
    ]

    return (
      <>
        {/* 오버레이 */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          ></div>
        )}
        
        {/* 사이드 메뉴 */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4 border-b">
            <button onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6 p-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">로그인/회원가입</p>
                <p className="text-sm text-gray-500">계정을 만들어 보세요</p>
              </div>
            </div>
            
            <ul>
              {menuItems.map((item) => (
                <li key={item.id} className="py-3 border-b">
                  <a href="#" className="flex items-center">
                    <div className="w-6 h-6 mr-4"></div>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="max-w-screen-md mx-auto bg-gray-50 min-h-screen relative">
      {/* Side Menu */}
      <SideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
      
      {/* Product Detail */}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={closeProductDetail} />
      )}
      
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <span className="text-orange-500 font-bold text-xl">좋은거래</span>
        </div>
        <div className="flex">
          {/* LocationSelector에 onLocationChange 핸들러 전달 */}
          <LocationSelector onLocationChange={handleLocationChange} />
          <div className="flex items-center space-x-2 px-4 py-2">
            <button className="text-2xl" onClick={toggleSideMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Breadcrumb */}
      <div className="flex items-center text-sm px-4 py-2 text-gray-500">
        <span>홈</span>
        <span className="mx-1">{">"}</span>
        <span className="font-medium text-black">중고거래</span>
      </div>

      {/* Title - 현재 선택된 위치 표시 */}
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold">{currentLocation}</h1>
      </div>

      {/* Filter */}
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
              <div 
                key={product.id} 
                className="border border-gray-200 rounded-md overflow-hidden cursor-pointer" 
                onClick={() => openProductDetail(product)}
              >
                <div className="relative pt-[100%] bg-gray-200">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.title || "상품 제목"}
                  </h3>
                  <p className="font-bold mt-1">{product.price?.toLocaleString() || "0"}원</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{product.location || "도원동"}</span>
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
        <div className="flex justify-center py-4 items-center">
          {/* Left arrow button for previous page range */}
          <button
            onClick={() => handlePageChange(Math.max(Math.floor(currentPage / 10) * 10 - 10, 0))}
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
                  onClick={() => handlePageChange(pageNum)}
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
            onClick={() => handlePageChange(Math.min(Math.floor(currentPage / 10) * 10 + 10, totalPages - 1))}
            className="mx-1 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
            disabled={Math.floor(currentPage / 10) * 10 + 10 >= totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

export default Marketplace