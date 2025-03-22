import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatButton, Chat } from "../Chat"; // Import the updated chat components

const ProductDetail = ({ product: initialProduct, onClose }) => {
  const [product, setProduct] = useState(initialProduct);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/boards/products/${initialProduct.id}`);
        if (response.data) {
          setProduct(response.data);

          // ✅ 로그인 되어있다면 좋아요 상태 확인
          const token = localStorage.getItem("accessToken");
          if (token) {
            const userId = localStorage.getItem("id");
            const likeResponse = await axios.get(`/api/like`, {
              params: { userId: userId, productId: initialProduct.id }
            });

            // ✅ 서버에서 받은 status 값으로 좋아요 상태 반영
            setIsLiked(likeResponse.data.status === true);
          }
        }
      } catch (error) {
        console.error("상품 상세 정보 가져오기 실패:", error);
      }
    };

    fetchProductDetails();
  }, [initialProduct.id]);

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }

    try {
      const userId = localStorage.getItem("id");
      const likeResponse = await axios.post("/api/like", {
        productId: product.id,
        userId: userId
      });

      // ✅ 서버에서 status로 좋아요 여부 확인 후 적용
      const liked = likeResponse.data.status === true;
      setIsLiked(liked);

      // ✅ 좋아요 수도 서버 응답 기준으로 증가/감소
      setProduct(prev => ({
        ...prev,
        likes: liked ? prev.likes + 1 : prev.likes - 1
      }));
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  const handleChatOpen = (chatRoom) => {
    setSelectedChatRoom(chatRoom);
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setSelectedChatRoom(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {chatOpen ? (
        // 업데이트된 Chat 컴포넌트를 사용하고 onClose 프롭 전달
        <Chat 
          initialRoom={selectedChatRoom} 
          onClose={() => {
            setChatOpen(false);
            setSelectedChatRoom(null);
          }} 
        />
      ) : (
        // Otherwise render the product detail
        <>
          {authModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">로그인이 필요합니다</h2>
                <p className="mb-4">상품 좋아요 기능을 사용하려면 로그인이 필요합니다.</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setAuthModalOpen(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalOpen(false);
                      // 로그인 페이지 이동 처리 필요
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md"
                  >
                    로그인하기
                  </button>
                </div>
              </div>
            </div>
          )}

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
                <button onClick={handleLikeClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={isLiked ? "currentColor" : "none"}
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

            <div className={`border-t border-b py-4 mb-4 ${product.description?.length > 100 ? 'overflow-y-auto max-h-48' : ''}`}>
              <p>{product.description || "상품 설명이 없습니다."}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>관심 {product.likes || 0}</span>
              <span>조회 {product.views || 0}</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 flex justify-between items-center">
            <button
              className="flex items-center justify-center w-12 h-12"
              onClick={handleLikeClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={isLiked ? "currentColor" : "none"}
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
              <ChatButton
                productId={product.id}
                productTitle={product.title}
                sellerName={product.username || "판매자"}
                onOpenChat={handleChatOpen}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;