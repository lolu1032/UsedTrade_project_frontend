import React, { useState } from "react";
import axios from "axios";

const ChatButton = ({ productId, productTitle, sellerName, onOpenChat }) => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    
    const handleChatClick = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const isLoggedIn = !!accessToken;
      
      if (!isLoggedIn) {
        setAuthModalOpen(true);
        return;
      }
      
      try {
        const username = localStorage.getItem("username");
        const userId = parseFloat(localStorage.getItem("id"));
        
        try {
          // First, try to create the room
          const response = await axios.post("/api/chat/room", {
            name: `${productTitle} - ${sellerName}`,
            userId: userId,
            productId: productId
          });
          
          // If room creation is successful, open the chat room
          if (onOpenChat) {
            onOpenChat({
              component: "ChatRoom",
              props: {
                room: response.data,
                userId: userId,
                username: username
              }
            });
          }
        } catch (error) {
          // If 500 internal server error or 409 Conflict, show room list
          if (error.response && (error.response.status === 500 || error.response.status === 409)) {
            if (onOpenChat) {
              onOpenChat({
                component: "ChatRoomList",
                props: {
                  productId: productId,
                  productTitle: productTitle,
                  sellerName: sellerName
                }
              });
            }
          } else {
            // For other errors, log and potentially show an error
            console.error("채팅방 생성 실패:", error);
          }
        }
      } catch (error) {
        console.error("채팅 처리 중 오류:", error);
      }
    };
    
  return (
    <>
      {authModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">로그인이 필요합니다</h2>
            <p className="mb-4">채팅 기능을 사용하려면 로그인이 필요합니다.</p>
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
                  window.location.href = "/login";
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={handleChatClick}
        className="bg-orange-500 text-white w-full py-3 rounded-md font-bold"
      >
        채팅하기
      </button>
    </>
  );
};

export default ChatButton;