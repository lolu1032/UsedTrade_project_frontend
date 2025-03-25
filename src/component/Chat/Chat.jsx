import React, { useState, useEffect } from "react";
import ChatRoomList from "./ChatRoomList";
import ChatRoom from "./ChatRoom";

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
          onBack={onClose}
        />
      )}
    </div>
  );
};

export default Chat;