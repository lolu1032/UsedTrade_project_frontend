import axios from "axios";
import { useEffect, useState } from "react";

// components/marketplace/ProductDetail.js
const ProductDetail = ({ product: initialProduct, onClose }) => {
  const [product, setProduct] = useState(initialProduct);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/boards/products/${initialProduct.id}`);
        if (response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error("상품 상세 정보 가져오기 실패:", error);
      }
    };
    
    fetchProductDetails();
  }, [initialProduct.id]);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={onClose} className="text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex space-x-4">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 w-full" style={{ height: "300px" }}>
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm">{product.username?.charAt(0) || "판"}</span>
          </div>
          <div>
            <p className="font-medium">{product.username || "판매자"}</p>
            <p className="text-sm text-gray-500">{product.regionName || "위치 정보 없음"}</p>
          </div>
        </div>

        <h1 className="text-xl font-bold mb-2">{product.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          {"중고거래"} • {new Date().toLocaleDateString()}
        </p>

        <p className="text-lg font-bold mb-4">{product.price?.toLocaleString() || "0"}원</p>

        {/* 상품 설명을 길어지면 스크롤 가능하게 처리 */}
        <div className={`border-t border-b py-4 mb-4 ${product.description?.length > 100 ? 'overflow-y-auto max-h-48' : ''}`}>
          <p>{product.description || "상품 설명이 없습니다."}</p>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>관심 {product.likes || 0}</span>
          <span>조회 {product.views || 0}</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 flex justify-between items-center">
        <button className="flex items-center justify-center w-12 h-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <div className="flex-1 ml-4">
          <button className="bg-orange-500 text-white w-full py-3 rounded-md font-bold">채팅하기</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
