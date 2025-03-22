import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

// Chat Room List Component
const ChatRoomList = ({ onSelectRoom, onCreateRoom, onBack }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchRooms();
    }, []);
  
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/chat/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("채팅방 목록 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleCreateRoom = async (e) => {
      e.preventDefault();
      if (!newRoomName.trim()) return;
  
      try {
        const response = await axios.post("/api/chat/room", { name: newRoomName });
        setRooms([...rooms, response.data]);
        setNewRoomName("");
        if (onCreateRoom) onCreateRoom(response.data);
      } catch (error) {
        console.error("채팅방 생성 실패:", error);
      }
    };
  
    return (
      <div className="h-full flex flex-col">
        <div className="border-b p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">채팅</h2>
            {onBack && (
              <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
                나가기
              </button>
            )}
          </div>
  
          <form onSubmit={handleCreateRoom} className="flex">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="새 채팅방 이름"
              className="flex-1 border p-2 rounded-l-md"
            />
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-r-md">
              생성
            </button>
          </form>
        </div>
  
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">로딩 중...</div>
          ) : rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">채팅방이 없습니다.</div>
          ) : (
            <ul>
              {rooms.map((room) => (
                <li
                  key={room.roomId}
                  onClick={() => onSelectRoom(room)}
                  className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium">{room.name}</div>
                  <div className="text-sm text-gray-500">
                    {room.lastMessage || "새로운 채팅방"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };
  

// Chat Room Component
const ChatRoom = ({ room, onBack, userId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS("/ws-stomp");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setConnected(true);
      console.log("Connected to STOMP");

      // Subscribe to room messages
      client.subscribe(`/sub/chat/room/${room.roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });

      // Send ENTER message
      client.publish({
        destination: "/pub/chat/enter",
        body: JSON.stringify({
          type: "ENTER",
          roomId: room.roomId,
          sender: username,
          senderId: userId,
        }),
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP Error", frame);
      setConnected(false);
    };

    client.activate();
    setStompClient(client);

    // Cleanup on unmount
    return () => {
      if (client && client.connected) {
        // Send EXIT message
        client.publish({
          destination: "/pub/chat/message",
          body: JSON.stringify({
            type: "EXIT",
            roomId: room.roomId,
            sender: username,
            senderId: userId,
          }),
        });
        client.deactivate();
      }
    };
  }, [room.roomId, userId, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected || !stompClient) return;

    const chatMessage = {
      type: "TALK",
      roomId: room.roomId,
      sender: username,
      senderId: userId,
      message: newMessage,
    };

    stompClient.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(chatMessage),
    });

    setNewMessage("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex justify-between items-center p-4">
          <button onClick={onBack} className="text-2xl">
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="font-bold">{room.name}</div>
          <div className="w-6"></div> {/* Empty space for alignment */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.senderId === userId ? "text-right" : "text-left"
            }`}
          >
            {msg.type === "ENTER" || msg.type === "EXIT" ? (
              <div className="text-center text-gray-500 text-sm my-2">
                {msg.message}
              </div>
            ) : (
              <>
                {msg.senderId !== userId && (
                  <div className="text-sm text-gray-500 mb-1">{msg.sender}</div>
                )}
                <div
                  className={`inline-block rounded-lg py-2 px-3 max-w-xs break-words ${
                    msg.senderId === userId
                      ? "bg-orange-500 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.message}
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t bg-white p-4 flex items-center"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지 입력..."
          className="flex-1 border rounded-md p-2 mr-2"
          disabled={!connected}
        />
        <button
          type="submit"
          className="bg-orange-500 text-white p-2 rounded-md"
          disabled={!connected}
        >
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

// Main Chat Component
const Chat = ({ onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const id = localStorage.getItem("id");
    const name = localStorage.getItem("username") || "사용자";
    setUserId(id);
    setUsername(name);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {selectedRoom ? (
        <ChatRoom
          room={selectedRoom}
          onBack={() => setSelectedRoom(null)}
          userId={userId}
          username={username}
        />
      ) : (
        <ChatRoomList 
        onSelectRoom={setSelectedRoom} 
        onCreateRoom={setSelectedRoom} 
        onBack={onClose}  // 💥 여기가 핵심 추가
        />
      )}
    </div>
  );
};

// Chat Button Component - can be used in ProductDetail or other places
const ChatButton = ({ productId, productTitle, sellerName, onOpenChat }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const handleChatClick = async () => {
    const isLoggedIn = !!localStorage.getItem("accessToken");
    
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    
    try {
      // Create or find chat room for this product
      const response = await axios.post("/api/chat/room", {
        name: `${productTitle} - ${sellerName}`
      });
      
      if (onOpenChat) {
        onOpenChat(response.data);
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
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
      
      <button 
        onClick={handleChatClick}
        className="bg-orange-500 text-white w-full py-3 rounded-md font-bold"
      >
        채팅하기
      </button>
    </>
  );
};

export { Chat, ChatButton, ChatRoomList, ChatRoom };