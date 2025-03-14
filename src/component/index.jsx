import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./Header"
import SearchBar from "./UI/SearchBar"
import FilterBar from "./UI/FilterBar"
import ProductList from "./Product/ProductList"
import Pagination from "./UI/Pagination"
import SideMenu from "./SideMenu"
import ProductDetail from "./Product/ProductDetail"
import AuthModal from "./auth/AuthModal"

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
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState("login")

  useEffect(() => {
    fetchProducts()
  }, [currentPage, currentLocation])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/boards/products`, {
        params: {
          page: currentPage,
          size: 8,
          location: currentLocation,
        },
      })

      if (response.data && response.data.content) {
        setProducts(response.data.content)
        setTotalPages(response.data.totalPages)
      } else {
        console.error("Unexpected API response format:", response.data)
        setProducts([])
        setTotalPages(5) // For demo purposes
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
      setTotalPages(5) // For demo purposes
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    // Fetch products by category
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleLocationChange = (newLocation) => {
    let formattedLocation = newLocation.replace("특별시", "시").replace("광역시", "시")
    const parts = formattedLocation.split(",").map((part) => part.trim())
    
    if (parts.length >= 2) {
      formattedLocation = parts.join(" ")
    }

    setCurrentLocation(formattedLocation)
    setCurrentPage(0)
  }

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen)
  }

  const openProductDetail = (product) => {
    setSelectedProduct(product)
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
  }

  const openAuthModal = (view = "login") => {
    setAuthModalView(view)
    setAuthModalOpen(true)
    setSideMenuOpen(false)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
  }

  return (
    <div className="max-w-screen-md mx-auto bg-gray-50 min-h-screen relative">
      {/* Side Menu */}
      <SideMenu
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        onLoginClick={() => openAuthModal("login")}
      />

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal 
          view={authModalView}
          onClose={closeAuthModal}
          onSwitchView={(view) => setAuthModalView(view)}
        />
      )}

      {/* Product Detail */}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={closeProductDetail} 
        />
      )}

      {/* Header */}
      <Header 
        onMenuClick={toggleSideMenu} 
        onLocationChange={handleLocationChange} 
      />

      {/* Search */}
      <SearchBar 
        searchTerm={searchTerm} 
        selectedCategory={selectedCategory}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
      />

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
      <FilterBar />

      {/* Product List */}
      <ProductList 
        products={products}
        loading={loading}
        onProductClick={openProductDetail}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default Marketplace