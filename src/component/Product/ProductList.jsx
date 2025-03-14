// components/marketplace/ProductList.js
import ProductItem from "./ProductItem"

const ProductList = ({ products, loading, onProductClick }) => {
  if (loading) {
    return (
      <div className="px-4 py-2">
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            onClick={() => onProductClick(product)} 
          />
        ))}
      </div>
    </div>
  )
}

export default ProductList