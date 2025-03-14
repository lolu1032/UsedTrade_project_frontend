// components/marketplace/ProductItem.js

const ProductItem = ({ product, onClick }) => {
    return (
      <div
        className="border border-gray-200 rounded-md overflow-hidden cursor-pointer"
        onClick={onClick}
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
    )
  }
  
  export default ProductItem